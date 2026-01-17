// lib/matchingAlgorithm.ts

import { cosineSimilarity, calculateSummaryOverlap } from './aiProfileGenerator';
import { blendPreferences } from './preferenceCalculator';

/**
 * User preference data structure combining questionnaire and viewing behavior
 */
export interface UserPreferences {
  questionnaireFeatureScores: Record<string, number>;
  implicitFeatureScores: Record<string, number>;
  implicitConfidenceScore: number;
  scheduleData?: ScheduleData;
  aiSummary?: string;
}

/**
 * Parsed schedule data for matching
 */
export interface ScheduleData {
  buildings: string[];
  timeSlots: TimeSlot[];
  courses: any[];
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  building?: string;
  courseCode?: string;
}

/**
 * Calculate compatibility score between two users
 * Formula: 50% Feature Similarity + 30% AI Summary Compatibility + 20% Schedule Overlap
 */
export function calculateCompatibilityScore(
  userA: UserPreferences,
  userB: UserPreferences,
): number {
  // 1. Calculate blended feature preferences (60% explicit questionnaire + 40% implicit viewing)
  const blendedAResult = blendPreferences(
    userA.questionnaireFeatureScores,
    userA.implicitFeatureScores,
    userA.implicitConfidenceScore,
  );

  const blendedBResult = blendPreferences(
    userB.questionnaireFeatureScores,
    userB.implicitFeatureScores,
    userB.implicitConfidenceScore,
  );

  // 2. Feature similarity using cosine similarity (50% weight)
  const featureSimilarity = calculateFeatureSimilarity(
    blendedAResult.blendedFeatures,
    blendedBResult.blendedFeatures
  );

  // 3. AI Summary Compatibility using word overlap (30% weight)
  const summaryCompatibility = userA.aiSummary && userB.aiSummary
    ? calculateSummaryOverlap(userA.aiSummary, userB.aiSummary)
    : 0;

  // 4. Schedule overlap (20% weight)
  const scheduleScore = calculateScheduleCompatibility(userA.scheduleData, userB.scheduleData);

  // Weighted combination: 50% + 30% + 20% = 100%
  const finalScore = (
    featureSimilarity * 0.5 +
    summaryCompatibility * 0.3 +
    scheduleScore * 0.2
  );

  // Return as percentage (0-100)
  return Math.round(finalScore * 100);
}

/**
 * Calculate feature similarity using cosine similarity
 */
function calculateFeatureSimilarity(
  featuresA: Record<string, number>,
  featuresB: Record<string, number>
): number {
  // Get all unique features
  const allFeatures = new Set([
    ...Object.keys(featuresA),
    ...Object.keys(featuresB)
  ]);

  // Build vectors
  const vectorA: number[] = [];
  const vectorB: number[] = [];

  for (const feature of allFeatures) {
    vectorA.push(featuresA[feature] || 0);
    vectorB.push(featuresB[feature] || 0);
  }

  // Calculate cosine similarity
  return cosineSimilarity(vectorA, vectorB);
}

/**
 * Calculate schedule compatibility based on free time overlap
 * Returns score 0-1
 */
export function calculateScheduleCompatibility(
  scheduleA?: ScheduleData,
  scheduleB?: ScheduleData
): number {
  if (!scheduleA || !scheduleB) {
    return 0; // No schedule data = no compatibility score
  }

  // Sub-components (equal weighting for simplicity)
  const freeTimeScore = calculateFreeTimeOverlap(scheduleA.timeSlots, scheduleB.timeSlots);
  const proximityScore = calculateProximityScore(scheduleA.buildings, scheduleB.buildings);

  // Average the two components
  return (freeTimeScore + proximityScore) / 2;
}

/**
 * Calculate free time overlap between two schedules
 */
function calculateFreeTimeOverlap(slotsA: TimeSlot[], slotsB: TimeSlot[]): number {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  let totalPossibleHours = 0;
  let overlappingFreeHours = 0;

  for (const day of daysOfWeek) {
    const busyA = slotsA.filter(s => s.day === day);
    const busyB = slotsB.filter(s => s.day === day);

    // Find free windows for each (simplified: 9am-9pm)
    const dayStart = parseTime('9:00 AM');
    const dayEnd = parseTime('9:00 PM');
    const dayHours = (dayEnd - dayStart) / (1000 * 60 * 60);
    totalPossibleHours += dayHours;

    // Calculate busy hours for each user
    const busyHoursA = busyA.reduce((sum, slot) => {
      const start = parseTime(slot.startTime);
      const end = parseTime(slot.endTime);
      return sum + (end - start) / (1000 * 60 * 60);
    }, 0);

    const busyHoursB = busyB.reduce((sum, slot) => {
      const start = parseTime(slot.startTime);
      const end = parseTime(slot.endTime);
      return sum + (end - start) / (1000 * 60 * 60);
    }, 0);

    // Estimate free hours (this is simplified; real implementation would need interval trees)
    const freeA = dayHours - busyHoursA;
    const freeB = dayHours - busyHoursB;
    
    // Approximate overlap (assumes random distribution of free time)
    const estimatedOverlap = Math.min(freeA, freeB);
    overlappingFreeHours += estimatedOverlap;
  }

  return totalPossibleHours > 0 ? overlappingFreeHours / totalPossibleHours : 0;
}

/**
 * Calculate proximity score based on shared/nearby buildings
 */
function calculateProximityScore(buildingsA: string[], buildingsB: string[]): number {
  if (buildingsA.length === 0 || buildingsB.length === 0) {
    return 0;
  }

  // Direct overlap (same buildings)
  const sharedBuildings = buildingsA.filter(b => buildingsB.includes(b));
  const overlapRatio = sharedBuildings.length / Math.max(buildingsA.length, buildingsB.length);

  // Nearby buildings (campus clusters)
  let nearbyCount = 0;
  for (const buildingA of buildingsA) {
    for (const buildingB of buildingsB) {
      if (buildingA !== buildingB && areBuildingsNearby(buildingA, buildingB)) {
        nearbyCount++;
      }
    }
  }

  const nearbyRatio = nearbyCount / (buildingsA.length * buildingsB.length);

  // Combine: 70% shared, 30% nearby
  return overlapRatio * 0.7 + nearbyRatio * 0.3;
}

/**
 * Check if two buildings are in the same campus cluster
 */
function areBuildingsNearby(building1: string, building2: string): boolean {
  const clusters: Record<string, string[]> = {
    engineering: ['BA', 'GB', 'SF', 'WB', 'MY', 'MC'],
    science: ['MS', 'MP', 'LM', 'ES'],
    arts: ['SS', 'UC', 'VC', 'IC', 'NC', 'SM'],
    libraries: ['RS', 'GE', 'KB'],
  };

  for (const cluster of Object.values(clusters)) {
    if (cluster.includes(building1) && cluster.includes(building2)) {
      return true;
    }
  }

  return false;
}

/**
 * Parse time string to Date object for comparison
 */
function parseTime(timeStr: string): number {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.getTime();
}
