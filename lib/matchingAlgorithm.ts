// lib/matchingAlgorithm.ts

import { PrismaClient } from '@prisma/client';
import { cosineSimilarity } from './aiProfileGenerator';
import { calculateScheduleCompatibility } from './scheduleParser';
import { MatchScore, MatchResult } from '@/types';

const prisma = new PrismaClient();

/**
 * Calculate shared interests between two users
 */
function calculateSharedInterests(
  interests1: { category: string; name: string; importance: number }[],
  interests2: { category: string; name: string; importance: number }[]
): {
  shared: string[];
  score: number;
} {
  const map1 = new Map(
    interests1.map(i => [`${i.category}:${i.name}`, i.importance])
  );
  const map2 = new Map(
    interests2.map(i => [`${i.category}:${i.name}`, i.importance])
  );

  const shared: string[] = [];
  let weightedScore = 0;
  let maxPossibleScore = 0;

  // Calculate weighted intersection
  for (const [key, importance1] of map1.entries()) {
    maxPossibleScore += importance1 * 5; // Max importance is 5
    
    const importance2 = map2.get(key);
    if (importance2) {
      shared.push(key.split(':')[1]);
      weightedScore += importance1 * importance2;
    }
  }

  // Normalize score to 0-100
  const score = maxPossibleScore > 0 
    ? Math.round((weightedScore / maxPossibleScore) * 100)
    : 0;

  return { shared, score };
}

/**
 * Calculate personality compatibility based on traits and values
 */
function calculatePersonalityCompatibility(
  questionnaire1: any,
  questionnaire2: any
): number {
  let score = 0;
  let factors = 0;

  // Values alignment (most important)
  if (questionnaire1.values && questionnaire2.values) {
    const sharedValues = questionnaire1.values.filter((v: string) =>
      questionnaire2.values.includes(v)
    );
    score += (sharedValues.length / Math.max(questionnaire1.values.length, 1)) * 40;
    factors += 40;
  }

  // Study preference compatibility
  if (questionnaire1.studyPreference && questionnaire2.studyPreference) {
    if (questionnaire1.studyPreference === questionnaire2.studyPreference ||
        questionnaire1.studyPreference === 'flexible' ||
        questionnaire2.studyPreference === 'flexible') {
      score += 15;
    }
    factors += 15;
  }

  // Going out frequency compatibility
  if (questionnaire1.goingOutFrequency && questionnaire2.goingOutFrequency) {
    const frequencies = ['rarely', 'sometimes', 'often', 'very_often'];
    const idx1 = frequencies.indexOf(questionnaire1.goingOutFrequency);
    const idx2 = frequencies.indexOf(questionnaire2.goingOutFrequency);
    
    if (idx1 >= 0 && idx2 >= 0) {
      const diff = Math.abs(idx1 - idx2);
      score += (diff === 0 ? 15 : diff === 1 ? 10 : 5);
    }
    factors += 15;
  }

  // Club overlap
  if (questionnaire1.clubs && questionnaire2.clubs) {
    const sharedClubs = questionnaire1.clubs.filter((c: string) =>
      questionnaire2.clubs.includes(c)
    );
    score += Math.min((sharedClubs.length * 10), 30);
    factors += 30;
  }

  return factors > 0 ? Math.round((score / factors) * 100) : 50;
}

/**
 * Main matching algorithm
 */
export async function findMatches(
  userId: string,
  limit: number = 10
): Promise<MatchResult[]> {
  
  // Get current user with all data
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      schedule: {
        include: {
          courses: {
            include: {
              timeSlots: true
            }
          }
        }
      },
      questionnaire: true,
      interests: true,
    }
  });

  if (!currentUser || !currentUser.embedding) {
    throw new Error('User profile incomplete. Please complete your profile first.');
  }

  // Get all potential matches (exclude self and already matched)
  const existingMatchIds = await prisma.match.findMany({
    where: {
      OR: [
        { userId: userId },
        { matchedUserId: userId }
      ]
    },
    select: {
      userId: true,
      matchedUserId: true
    }
  });

  const excludedIds = new Set([
    userId,
    ...existingMatchIds.map(m => m.userId),
    ...existingMatchIds.map(m => m.matchedUserId)
  ]);

  const potentialMatches = await prisma.user.findMany({
    where: {
      id: { notIn: Array.from(excludedIds) },
      profileCompleted: true,
      embedding: { not: { equals: null } }
    },
    include: {
      schedule: {
        include: {
          courses: {
            include: {
              timeSlots: true
            }
          }
        }
      },
      questionnaire: true,
      interests: true,
    },
    take: 100 // Pre-filter to top 100 for performance
  });

  // Calculate match scores for each potential match
  const scoredMatches = await Promise.all(
    potentialMatches.map(async (match) => {
      const score = await calculateMatchScore(currentUser, match);
      return { user: match, score };
    })
  );

  // Sort by overall score
  scoredMatches.sort((a, b) => b.score.overall - a.score.overall);

  // Take top matches
  const topMatches = scoredMatches.slice(0, limit);

  // Format results
  const results: MatchResult[] = topMatches.map(({ user, score }) => ({
    matchId: '', // Will be set when match is created
    user: {
      id: user.id,
      name: user.name,
      profilePicture: user.profilePicture || undefined,
      year: user.year ?? undefined,
      program: user.program ?? undefined,
      archetype: user.archetype ?? undefined,
      bio: user.bio ?? undefined,
    },
    score,
    suggestedActivities: [] // Will be generated on-demand
  }));

  return results;
}

/**
 * Calculate comprehensive match score between two users
 */
async function calculateMatchScore(
  user1: any,
  user2: any
): Promise<MatchScore> {
  
  // 1. Profile Similarity (40% weight) - Using embeddings
  let profileSimilarity = 0;
  if (user1.embedding && user2.embedding) {
    // Convert Buffer to number array if needed
    const embedding1 = Array.isArray(user1.embedding) 
      ? user1.embedding 
      : JSON.parse(user1.embedding.toString());
    const embedding2 = Array.isArray(user2.embedding)
      ? user2.embedding
      : JSON.parse(user2.embedding.toString());
    
    const similarity = cosineSimilarity(embedding1, embedding2);
    profileSimilarity = Math.round((similarity + 1) * 50); // Convert from [-1, 1] to [0, 100]
  }

  // 2. Schedule Compatibility (25% weight)
  let scheduleCompatibility = 0;
  let scheduleOverlap = { freeTimeSlots: [] as string[], commonCourses: [] as string[] };
  
  if (user1.schedule?.courses && user2.schedule?.courses) {
    const scheduleResult = calculateScheduleCompatibility(
      user1.schedule.courses,
      user2.schedule.courses
    );
    scheduleCompatibility = scheduleResult.compatibilityScore;
    scheduleOverlap = {
      freeTimeSlots: scheduleResult.freeTimeOverlap,
      commonCourses: scheduleResult.commonCourses
    };
  }

  // 3. Shared Interests (20% weight)
  const interestsResult = calculateSharedInterests(
    user1.interests || [],
    user2.interests || []
  );
  const sharedInterestsScore = interestsResult.score;
  const sharedInterests = interestsResult.shared;

  // Add questionnaire-based shared interests
  if (user1.questionnaire && user2.questionnaire) {
    // Music preferences
    const sharedBands = user1.questionnaire.favoriteBands?.filter((b: string) =>
      user2.questionnaire.favoriteBands?.includes(b)
    ) || [];
    sharedInterests.push(...sharedBands.map((b: string) => `Music: ${b}`));

    // Sports teams
    const sharedTeams = user1.questionnaire.sportsTeams?.filter((t: string) =>
      user2.questionnaire.sportsTeams?.includes(t)
    ) || [];
    sharedInterests.push(...sharedTeams.map((t: string) => `Sports: ${t}`));

    // Hobbies
    const sharedHobbies = user1.questionnaire.hobbies?.filter((h: string) =>
      user2.questionnaire.hobbies?.includes(h)
    ) || [];
    sharedInterests.push(...sharedHobbies);
  }

  // 4. Personality Compatibility (10% weight)
  let personalityCompatibility = 50; // Default neutral
  if (user1.questionnaire && user2.questionnaire) {
    personalityCompatibility = calculatePersonalityCompatibility(
      user1.questionnaire,
      user2.questionnaire
    );
  }

  // 5. Club/Activity Overlap (5% weight)
  const commonClubs = user1.questionnaire?.clubs?.filter((c: string) =>
    user2.questionnaire?.clubs?.includes(c)
  ) || [];

  // Calculate weighted overall score
  const overall = Math.round(
    profileSimilarity * 0.40 +
    scheduleCompatibility * 0.25 +
    sharedInterestsScore * 0.20 +
    personalityCompatibility * 0.10 +
    Math.min(commonClubs.length * 10, 100) * 0.05
  );

  return {
    overall,
    breakdown: {
      profileSimilarity,
      scheduleCompatibility,
      sharedInterestsScore,
      personalityCompatibility,
    },
    sharedInterests: Array.from(new Set(sharedInterests)).slice(0, 10),
    commonClubs,
    scheduleOverlap
  };
}

/**
 * Create a match in the database
 */
export async function createMatch(
  userId: string,
  matchedUserId: string,
  score: MatchScore
): Promise<string> {
  
  const match = await prisma.match.create({
    data: {
      userId,
      matchedUserId,
      score: score.overall,
      profileSimilarity: score.breakdown.profileSimilarity,
      scheduleCompatibility: score.breakdown.scheduleCompatibility,
      sharedInterests: score.sharedInterests,
      status: 'pending'
    }
  });

  return match.id;
}

/**
 * Accept a match (creates mutual match if other user also accepted)
 */
export async function acceptMatch(matchId: string): Promise<{
  status: 'accepted' | 'mutual';
  conversationId?: string;
}> {
  
  const match = await prisma.match.findUnique({
    where: { id: matchId }
  });

  if (!match) {
    throw new Error('Match not found');
  }

  // Check if there's a reciprocal match
  const reciprocalMatch = await prisma.match.findFirst({
    where: {
      userId: match.matchedUserId,
      matchedUserId: match.userId,
      status: 'accepted'
    }
  });

  if (reciprocalMatch) {
    // Mutual match! Update both and create conversation
    await prisma.match.updateMany({
      where: {
        OR: [
          { id: matchId },
          { id: reciprocalMatch.id }
        ]
      },
      data: { status: 'mutual' }
    });

    // Create conversation
    const conversation = await prisma.conversation.create({
      data: {
        matchId: matchId,
      }
    });

    return { status: 'mutual', conversationId: conversation.id };
  } else {
    // Just update this match
    await prisma.match.update({
      where: { id: matchId },
      data: { status: 'accepted' }
    });

    return { status: 'accepted' };
  }
}
