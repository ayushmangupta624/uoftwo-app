import { QuestionnaireData } from '@/types';
import { blendPreferences } from './preferenceCalculator';

/**
 * User preference data structure combining questionnaire and viewing behavior
 */
export interface UserPreferences {
  questionnaiреArchetypeScores: Record<string, number>;
  questionnaiрeBuildingScores: Record<string, number>;
  implicitArchetypeScores: Record<string, number>;
  implicitBuildingScores: Record<string, number>;
  implicitConfidenceScore: number;
}

/**
 * Calculate a compatibility score between two users
 * Uses blended preferences: 50% questionnaire, 25% viewing behavior, 25% schedule
 */
export function calculateCompatibilityScore(
  userA: UserPreferences,
  userB: UserPreferences,
): number {
  // Blend preferences with constant ratio (50% questionnaire, 25% viewing, 25% schedule placeholder)
  const blendedAResult = blendPreferences(
    userA.questionnaiреArchetypeScores,
    userA.implicitArchetypeScores,
    userA.implicitConfidenceScore,
  );

  const blendedBResult = blendPreferences(
    userB.questionnaiреArchetypeScores,
    userB.implicitArchetypeScores,
    userB.implicitConfidenceScore,
  );

  const blendedA = blendedAResult.archetypeScores;
  const blendedB = blendedBResult.archetypeScores;

  // Calculate archetype compatibility using cosine similarity
  let archetypeScore = 0;
  let archetypeMagnitudeA = 0;
  let archetypeMagnitudeB = 0;

  const allArchetypes = new Set([
    ...Object.keys(blendedA),
    ...Object.keys(blendedB),
  ]);

  allArchetypes.forEach(archetype => {
    const scoreA = blendedA[archetype] || 0;
    const scoreB = blendedB[archetype] || 0;

    archetypeScore += scoreA * scoreB;
    archetypeMagnitudeA += scoreA * scoreA;
    archetypeMagnitudeB += scoreB * scoreB;
  });

  const archetypeSimilarity =
    archetypeMagnitudeA > 0 && archetypeMagnitudeB > 0
      ? archetypeScore / (Math.sqrt(archetypeMagnitudeA) * Math.sqrt(archetypeMagnitudeB))
      : 0;

  // Calculate building compatibility
  let buildingScore = 0;
  let buildingMagnitudeA = 0;
  let buildingMagnitudeB = 0;

  const allBuildings = new Set([
    ...Object.keys(blendedAResult.buildingScores),
    ...Object.keys(blendedBResult.buildingScores),
  ]);

  allBuildings.forEach(building => {
    const scoreA = blendedAResult.buildingScores[building] || 0;
    const scoreB = blendedBResult.buildingScores[building] || 0;

    buildingScore += scoreA * scoreB;
    buildingMagnitudeA += scoreA * scoreA;
    buildingMagnitudeB += scoreB * scoreB;
  });

  const buildingSimilarity =
    buildingMagnitudeA > 0 && buildingMagnitudeB > 0
      ? buildingScore / (Math.sqrt(buildingMagnitudeA) * Math.sqrt(buildingMagnitudeB))
      : 0;

  // Weight archetypes more heavily than buildings (0.7 vs 0.3)
  const totalScore = archetypeSimilarity * 0.7 + buildingSimilarity * 0.3;

  return Math.min(1, Math.max(0, totalScore));
}

/**
 * Rank potential matches for a user based on compatibility
 */
export function rankMatches(
  currentUserPreferences: UserPreferences,
  candidatePreferences: UserPreferences[],
): Array<{ index: number; score: number }> {
  const scores = candidatePreferences.map((candidate, index) => ({
    index,
    score: calculateCompatibilityScore(currentUserPreferences, candidate),
  }));

  // Sort by score descending
  return scores.sort((a, b) => b.score - a.score);
}

/**
 * Extract questionnaire preferences into archetype and building scores
 * Maps questionnaire responses to preference affinities
 */
export function extractQuestionnairePreferences(questionnaire: QuestionnaireData): {
  archetypeScores: Record<string, number>;
  buildingScores: Record<string, number>;
} {
  const archetypeScores: Record<string, number> = {
    'STEM Scholar': 0,
    'Dark Academia': 0,
    'Outdoorsy Explorer': 0,
    'Creative Spirit': 0,
    'Social Butterfly': 0,
    'Coffee Shop Philosopher': 0,
    'Gym Rat / Athlete': 0,
    'Night Owl Grinder': 0,
    'Culture Enthusiast': 0,
    'Chill Minimalist': 0,
  };

  const buildingScores: Record<string, number> = {};

  // Score STEM Scholar
  const stemKeywords = ['coding', 'engineering', 'programming', 'math', 'physics', 'computer'];
  const stemCount = questionnaire.personalityTraits?.filter(t =>
    stemKeywords.some(k => t.toLowerCase().includes(k)),
  ).length || 0;
  archetypeScores['STEM Scholar'] += stemCount * 0.25;

  // Score Dark Academia
  const darkAcademiaKeywords = ['intellectual', 'scholarly', 'mysterious', 'literary', 'philosophical'];
  const darkCount = questionnaire.personalityTraits?.filter(t =>
    darkAcademiaKeywords.some(k => t.toLowerCase().includes(k)),
  ).length || 0;
  archetypeScores['Dark Academia'] += darkCount * 0.25;

  // Score Outdoorsy Explorer
  if (questionnaire.hobbies?.some(h => ['hiking', 'camping', 'sports', 'climbing'].some(s => h.toLowerCase().includes(s)))) {
    archetypeScores['Outdoorsy Explorer'] += 0.5;
  }
  if (questionnaire.idealWeekend?.toLowerCase().includes('outdoor') || 
      questionnaire.idealWeekend?.toLowerCase().includes('nature')) {
    archetypeScores['Outdoorsy Explorer'] += 0.3;
  }

  // Score Creative Spirit
  if (questionnaire.hobbies?.some(h => ['art', 'music', 'writing', 'design'].some(s => h.toLowerCase().includes(s)))) {
    archetypeScores['Creative Spirit'] += 0.5;
  }
  if (questionnaire.clubs?.some(c => ['art', 'music', 'creative'].some(s => c.toLowerCase().includes(s)))) {
    archetypeScores['Creative Spirit'] += 0.3;
  }

  // Score Social Butterfly
  if (questionnaire.goingOutFrequency === 'often' || questionnaire.goingOutFrequency === 'very often') {
    archetypeScores['Social Butterfly'] += 0.5;
  }
  if (questionnaire.hobbies?.some(h => ['party', 'event', 'social'].some(s => h.toLowerCase().includes(s)))) {
    archetypeScores['Social Butterfly'] += 0.3;
  }

  // Score Coffee Shop Philosopher
  if (questionnaire.favCampusSpots?.some(s => ['library', 'cafe', 'coffee'].some(k => s.toLowerCase().includes(k)))) {
    archetypeScores['Coffee Shop Philosopher'] += 0.4;
  }
  if (questionnaire.personalityTraits?.some(t => 
    ['thoughtful', 'introspective', 'contemplative'].some(k => t.toLowerCase().includes(k)))) {
    archetypeScores['Coffee Shop Philosopher'] += 0.3;
  }

  // Score Gym Rat / Athlete
  if (questionnaire.sportsTeams?.length && questionnaire.sportsTeams.length > 0) {
    archetypeScores['Gym Rat / Athlete'] += Math.min(0.5, questionnaire.sportsTeams.length * 0.2);
  }
  if (questionnaire.hobbies?.some(h => ['gym', 'fitness', 'workout'].some(s => h.toLowerCase().includes(s)))) {
    archetypeScores['Gym Rat / Athlete'] += 0.4;
  }

  // Score Night Owl Grinder
  if (questionnaire.studyPreference === 'late night' || questionnaire.studyPreference === 'night') {
    archetypeScores['Night Owl Grinder'] += 0.5;
  }

  // Score Culture Enthusiast
  if (questionnaire.musicGenres && questionnaire.musicGenres.length > 2) {
    archetypeScores['Culture Enthusiast'] += 0.3;
  }
  if (questionnaire.clubs?.some(c => ['culture', 'art', 'music', 'film'].some(s => c.toLowerCase().includes(s)))) {
    archetypeScores['Culture Enthusiast'] += 0.4;
  }

  // Score Chill Minimalist
  if (questionnaire.goingOutFrequency === 'rarely' || questionnaire.goingOutFrequency === 'sometimes') {
    archetypeScores['Chill Minimalist'] += 0.4;
  }
  if (questionnaire.idealWeekend?.toLowerCase().includes('chill') || 
      questionnaire.idealWeekend?.toLowerCase().includes('relax')) {
    archetypeScores['Chill Minimalist'] += 0.3;
  }

  // Normalize archetype scores to 0-1 range
  const maxScore = Math.max(...Object.values(archetypeScores), 1);
  Object.keys(archetypeScores).forEach(archetype => {
    archetypeScores[archetype] = archetypeScores[archetype] / maxScore;
  });

  return { archetypeScores, buildingScores };
}
