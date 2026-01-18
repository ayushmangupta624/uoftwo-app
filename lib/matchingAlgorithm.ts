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
  // Questionnaire data for direct matching
  hobbies?: string[];
  musicGenres?: string[];
  favoriteBands?: string[];
  areasOfStudy?: string[];
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
 * Dynamic weighting based on available data to prevent low scores from missing optional fields
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

  // 2. Feature similarity using cosine similarity
  const featureSimilarity = calculateFeatureSimilarity(
    blendedAResult.blendedFeatures,
    blendedBResult.blendedFeatures
  );

  // 3. AI Summary Compatibility using word overlap
  const hasSummary = !!(userA.aiSummary && userB.aiSummary);
  const summaryCompatibility = hasSummary
    ? calculateSummaryOverlap(userA.aiSummary!, userB.aiSummary!)
    : 0;

  // 4. Schedule overlap
  const hasSchedule = !!(userA.scheduleData && userB.scheduleData);
  const scheduleScore = calculateScheduleCompatibility(userA.scheduleData, userB.scheduleData);

  // 5. Direct matches - hobbies, music, majors, classes
  const directMatchScore = calculateDirectMatches(userA, userB);

  // Dynamic weighting: redistribute weight from missing components to available ones
  let weights = {
    features: 0.35,
    summary: 0.20,
    schedule: 0.15,
    direct: 0.30
  };

  // Redistribute missing component weights proportionally
  if (!hasSummary) {
    const redistribution = weights.summary / 3;
    weights.features += redistribution;
    weights.direct += redistribution;
    weights.schedule += redistribution;
    weights.summary = 0;
  }

  if (!hasSchedule) {
    const redistribution = weights.schedule / 2;
    weights.features += redistribution;
    weights.direct += redistribution;
    weights.schedule = 0;
  }

  // Calculate final score with dynamic weights
  let finalScore = (
    featureSimilarity * weights.features +
    summaryCompatibility * weights.summary +
    scheduleScore * weights.schedule +
    directMatchScore * weights.direct
  );

  // Apply inflation curve to make scores more generous
  // This ensures better distribution across 40-95% range
  // Formula: score^0.75 gives a boost to mid-range scores
  finalScore = Math.pow(finalScore, 0.75);
  
  // Add small baseline boost (5-10%) to all matches
  const baselineBoost = 0.08;
  finalScore = Math.min(1.0, finalScore + baselineBoost);

  // Return as percentage (0-100)
  return Math.round(finalScore * 100);
}

/**
 * Calculate direct match score based on shared hobbies, music, majors, and classes
 * Returns a score from 0 to 1 with generous scoring
 */
function calculateDirectMatches(userA: UserPreferences, userB: UserPreferences): number {
  let totalPoints = 0;
  let maxPossiblePoints = 0;

  // 1. Shared Hobbies (40% of direct match score) - More generous
  const hobbiesA = userA.hobbies || [];
  const hobbiesB = userB.hobbies || [];
  if (hobbiesA.length > 0 && hobbiesB.length > 0) {
    const sharedHobbies = hobbiesA.filter(h => hobbiesB.includes(h)).length;
    const maxHobbies = Math.min(hobbiesA.length, hobbiesB.length);
    // Give partial credit for having hobbies even if not shared
    const baseCredit = 15; // 15 points just for having hobbies
    const matchBonus = (sharedHobbies / maxHobbies) * 25; // 25 points for matches
    totalPoints += baseCredit + matchBonus;
  } else if (hobbiesA.length > 0 || hobbiesB.length > 0) {
    // At least one has hobbies - give 10 points
    totalPoints += 10;
  }
  maxPossiblePoints += 40;

  // 2. Shared Music (25% of direct match score) - More generous
  const musicGenresA = userA.musicGenres || [];
  const musicGenresB = userB.musicGenres || [];
  const bandsA = userA.favoriteBands || [];
  const bandsB = userB.favoriteBands || [];
  
  let musicScore = 0;
  if (musicGenresA.length > 0 && musicGenresB.length > 0) {
    const sharedGenres = musicGenresA.filter(g => musicGenresB.includes(g)).length;
    // Boost: any shared genre gives good points
    const genreRatio = sharedGenres / Math.max(musicGenresA.length, musicGenresB.length);
    musicScore += (genreRatio * 12) + (sharedGenres > 0 ? 5 : 0); // Bonus for any match
  } else if (musicGenresA.length > 0 || musicGenresB.length > 0) {
    musicScore += 3; // Base credit for having music taste
  }
  
  if (bandsA.length > 0 && bandsB.length > 0) {
    const sharedBands = bandsA.filter(b => bandsB.includes(b)).length;
    // Shared bands are strong signals - boost heavily
    musicScore += (sharedBands > 0 ? 10 : 3); // Big bonus for any shared band
  }
  totalPoints += Math.min(musicScore, 25); // Cap at 25
  maxPossiblePoints += 25;

  // 3. Shared Major/Areas of Study (20% of direct match score) - More generous
  const majorsA = userA.areasOfStudy || [];
  const majorsB = userB.areasOfStudy || [];
  if (majorsA.length > 0 && majorsB.length > 0) {
    const sharedMajors = majorsA.filter(m => majorsB.includes(m)).length;
    if (sharedMajors > 0) {
      // Full points if they share any major
      totalPoints += 20;
    } else {
      // Give partial credit for being students with declared interests
      totalPoints += 8;
    }
  } else if (majorsA.length > 0 || majorsB.length > 0) {
    totalPoints += 5; // At least one has academic interests
  }
  maxPossiblePoints += 20;

  // 4. Same Classes (15% of direct match score) - More generous
  const coursesA = userA.scheduleData?.courses || [];
  const coursesB = userB.scheduleData?.courses || [];
  if (coursesA.length > 0 && coursesB.length > 0) {
    const courseCodesA = coursesA.map((c: any) => c.courseCode).filter(Boolean);
    const courseCodesB = coursesB.map((c: any) => c.courseCode).filter(Boolean);
    const sharedCourses = courseCodesA.filter((code: string) => courseCodesB.includes(code)).length;
    if (sharedCourses > 0) {
      // Shared courses are huge - give big boost
      totalPoints += Math.min(sharedCourses * 8, 15); // Increased from 5 to 8 per course
    } else {
      // Both have schedules - give base credit
      totalPoints += 3;
    }
  } else if (coursesA.length > 0 || coursesB.length > 0) {
    totalPoints += 2; // One has a schedule
  }
  maxPossiblePoints += 15;

  // Return normalized score with boost (0-1)
  const rawScore = maxPossiblePoints > 0 ? totalPoints / maxPossiblePoints : 0;
  
  // Apply gentle boost to lift scores: x^0.85 makes 0.6→0.65, 0.8→0.84
  return Math.pow(rawScore, 0.85);
}

/**
 * Calculate feature similarity using cosine similarity
 * Returns a baseline of 0.5 if both users have no features (neutral compatibility)
 * Applies generous scoring to boost compatibility
 */
function calculateFeatureSimilarity(
  featuresA: Record<string, number>,
  featuresB: Record<string, number>
): number {
  // Get all unique features (convert Set to Array for compatibility)
  const allFeaturesSet = new Set([
    ...Object.keys(featuresA),
    ...Object.keys(featuresB)
  ]);
  const allFeatures = Array.from(allFeaturesSet);

  // If both users have no features, return good neutral compatibility
  if (allFeatures.length === 0) {
    return 0.65; // Boosted from 0.5 to be more generous
  }

  // Build vectors
  const vectorA: number[] = [];
  const vectorB: number[] = [];

  for (const feature of allFeatures) {
    vectorA.push(featuresA[feature] || 0);
    vectorB.push(featuresB[feature] || 0);
  }

  // Calculate cosine similarity
  let similarity = cosineSimilarity(vectorA, vectorB);
  
  // Apply generous boost: sqrt transformation to lift mid-range scores
  // This makes 0.5 → 0.71, 0.7 → 0.84, 0.9 → 0.95
  similarity = Math.sqrt(similarity);
  
  return similarity;
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
