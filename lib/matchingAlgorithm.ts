import { QuestionnaireData, AIGeneratedProfile } from '@/types';
import { blendPreferences, calculateFeatureSimilarity } from './preferenceCalculator';

/**
 * User profile data structure for matching
 * Based on questionnaire, schedule, and AI summary (no archetypes)
 */
export interface UserMatchProfile {
  questionnaiреData: QuestionnaireData;
  aiSummary: AIGeneratedProfile;
  profileFeatures: Record<string, number>; // Extracted features from AI summary
  implicitFeatures: Record<string, number>; // Learned from profile views
  implicitConfidenceScore: number;
  schedule?: any[]; // Course schedule data
}

/**
 * Calculate a compatibility score between two users
 * Uses: questionnaire data + AI summary + schedule overlap + viewing behavior
 */
export function calculateCompatibilityScore(
  userA: UserMatchProfile,
  userB: UserMatchProfile,
): number {
  // Blend explicit features with implicit features
  const blendedAResult = blendPreferences(
    userA.profileFeatures,
    userA.implicitFeatures,
    userA.implicitConfidenceScore,
  );

  const blendedBResult = blendPreferences(
    userB.profileFeatures,
    userB.implicitFeatures,
    userB.implicitConfidenceScore,
  );

  const blendedA = blendedAResult.features;
  const blendedB = blendedBResult.features;

  // Calculate feature similarity using cosine similarity
  const featureSimilarity = calculateFeatureSimilarity(blendedA, blendedB);

  // Calculate schedule compatibility (time overlap for studying/hanging out)
  let scheduleCompatibility = 0.5; // Default neutral score
  if (userA.schedule && userB.schedule) {
    const timeOverlap = calculateScheduleOverlap(userA.schedule, userB.schedule);
    scheduleCompatibility = Math.min(1, timeOverlap / 10); // Normalize
  }

  // Calculate AI summary compatibility (comparing summary similarity)
  const summaryCompatibility = calculateSummaryCompatibility(userA.aiSummary, userB.aiSummary);

  // Weight the components:
  // 50% feature similarity, 30% AI summary match, 20% schedule overlap
  const totalScore = 
    (featureSimilarity * 0.5) + 
    (summaryCompatibility * 0.3) + 
    (scheduleCompatibility * 0.2);

  return Math.min(1, Math.max(0, totalScore));
}

/**
 * Calculate time overlap in schedules (simplified - counts matching time slots)
 */
function calculateScheduleOverlap(scheduleA: any[], scheduleB: any[]): number {
  if (!scheduleA.length || !scheduleB.length) return 0;

  let overlappingSlots = 0;
  scheduleA.forEach(courseA => {
    scheduleB.forEach(courseB => {
      // Simple overlap: same time slot or adjacent buildings
      if (courseA.time === courseB.time) {
        overlappingSlots++;
      }
    });
  });

  return overlappingSlots;
}

/**
 * Calculate compatibility of AI summaries
 * Compares writing style and expressed interests/values
 */
function calculateSummaryCompatibility(summaryA: AIGeneratedProfile, summaryB: AIGeneratedProfile): number {
  let score = 0;

  // Check personality insight overlap
  const insightsA = summaryA.personalityInsights.join(' ').toLowerCase();
  const insightsB = summaryB.personalityInsights.join(' ').toLowerCase();
  
  const insightWords = insightsA.split(/\s+/);
  insightWords.forEach(word => {
    if (insightsB.includes(word)) score += 0.05;
  });

  // Check strengths compatibility (complementary strengths are good)
  const strengthsA = summaryA.strengthsAsPartner.join(' ').toLowerCase();
  const strengthsB = summaryB.strengthsAsPartner.join(' ').toLowerCase();
  
  const strengthWords = strengthsA.split(/\s+/);
  strengthWords.forEach(word => {
    if (strengthsB.includes(word)) score += 0.05;
  });

  // Normalize to 0-1
  return Math.min(1, score / 2);
}

/**
 * Rank potential matches for a user based on compatibility
 */
export function rankMatches(
  currentUserProfile: UserMatchProfile,
  candidateProfiles: UserMatchProfile[],
): Array<{ index: number; score: number }> {
  const scores = candidateProfiles.map((candidate, index) => ({
    index,
    score: calculateCompatibilityScore(currentUserProfile, candidate),
  }));

  // Sort by score descending
  return scores.sort((a, b) => b.score - a.score);
}
