import { QuestionnaireData } from '@/types';

const ARCHETYPES = [
  'STEM Scholar',
  'Dark Academia',
  'Outdoorsy Explorer',
  'Creative Spirit',
  'Social Butterfly',
  'Coffee Shop Philosopher',
  'Gym Rat / Athlete',
  'Night Owl Grinder',
  'Culture Enthusiast',
  'Chill Minimalist',
] as const;

/**
 * Calculate implicit user preferences based on their profile viewing behavior
 * Returns archetype and building preference scores
 */
export function calculateImplicitPreferences(profileViews: any[]): {
  archetypeScores: Record<string, number>;
  buildingScores: Record<string, number>;
  confidenceScore: number;
  viewCount: number;
} {
  const archetypeScores: Record<string, number> = {};
  const buildingScores: Record<string, number> = {};
  
  // Initialize all archetypes with 0
  ARCHETYPES.forEach(archetype => {
    archetypeScores[archetype] = 0;
  });

  let totalEngagementScore = 0;
  let interactedCount = 0;

  // Process each profile view
  profileViews.forEach(view => {
    // Weight by duration: views under 5 seconds are less meaningful
    // Views over 30 seconds are very high engagement
    let durationWeight = Math.max(0, Math.min((view.duration || 0) / 30, 1));
    
    // Interaction multiplier: if they liked/passed, it's explicit signal
    const interactionBonus = view.interacted ? 1.5 : 1;
    
    // Scroll depth matters: more scrolling = more interest
    const scrollWeight = (view.scrollDepth || 0.5);
    
    const engagementScore = durationWeight * interactionBonus * scrollWeight;
    totalEngagementScore += engagementScore;
    
    if (view.interacted) {
      interactedCount++;
    }

    // Assuming the viewed profile has archetype and building info
    // This would come from the actual profile data
    if (view.viewedProfile?.archetype) {
      archetypeScores[view.viewedProfile.archetype] += engagementScore;
    }
    
    if (view.viewedProfile?.building?.name) {
      buildingScores[view.viewedProfile.building.name] = 
        (buildingScores[view.viewedProfile.building.name] || 0) + engagementScore;
    }
  });

  // Normalize scores to 0-1 range
  if (totalEngagementScore > 0) {
    ARCHETYPES.forEach(archetype => {
      archetypeScores[archetype] = Math.min(1, archetypeScores[archetype] / totalEngagementScore);
    });
    
    Object.keys(buildingScores).forEach(building => {
      buildingScores[building] = Math.min(1, buildingScores[building] / totalEngagementScore);
    });
  }

  // Confidence score: 0-1 based on sample size and interaction rate
  // Need at least 5 views for any confidence
  // Interaction rate also factors in (people who interact are more engaged)
  const interactionRate = profileViews.length > 0 ? interactedCount / profileViews.length : 0;
  const confidenceScore = Math.min(
    1,
    Math.max(0, (profileViews.length - 5) / 50) * (0.5 + interactionRate * 0.5)
  );

  return {
    archetypeScores,
    buildingScores,
    confidenceScore,
    viewCount: profileViews.length,
  };
}

/**
 * Blend explicit (questionnaire) and implicit (viewing behavior) preferences
 * With constant ratio: 50% questionnaire, 25% viewing behavior (25% reserved for schedule)
 * Returns both archetype and building scores after blending
 */
export function blendPreferences(
  questionnairePreferences: Record<string, number>,
  implicitPreferences: Record<string, number>,
  implicitConfidence: number
): {
  archetypeScores: Record<string, number>;
  buildingScores: Record<string, number>;
} {
  const QUESTIONNAIRE_WEIGHT = 0.5;
  const IMPLICIT_WEIGHT = 0.25;

  // Adjust implicit weight by confidence - low confidence views get less weight
  const adjustedImplicitWeight = IMPLICIT_WEIGHT * implicitConfidence;
  const adjustedQuestionnaireWeight = QUESTIONNAIRE_WEIGHT + (IMPLICIT_WEIGHT * (1 - implicitConfidence));

  // Blend the preferences
  const blended: Record<string, number> = {};
  Object.keys(questionnairePreferences).forEach(key => {
    const qScore = questionnairePreferences[key] || 0;
    const iScore = implicitPreferences[key] || 0;
    
    blended[key] = (qScore * adjustedQuestionnaireWeight) + (iScore * adjustedImplicitWeight);
  });

  return {
    archetypeScores: blended,
    buildingScores: {}, // Building scores handled similarly if needed
  };
}

/**
 * Extract archetype preferences from questionnaire data
 */
export function extractQuestionnairePreferences(
  questionnaire: QuestionnaireData
): Record<string, number> {
  const preferences: Record<string, number> = {};

  // Initialize all archetypes
  ARCHETYPES.forEach(archetype => {
    preferences[archetype] = 0;
  });

  // Map questionnaire data to archetypes
  // This is a simplified example - you'd want to build this out more
  
  if (questionnaire.studyPreference === 'alone') {
    preferences['Dark Academia'] += 0.3;
    preferences['Night Owl Grinder'] += 0.3;
  } else if (questionnaire.studyPreference === 'groups') {
    preferences['Social Butterfly'] += 0.3;
    preferences['STEM Scholar'] += 0.2;
  }

  if (questionnaire.goingOutFrequency === 'very_often' || questionnaire.goingOutFrequency === 'often') {
    preferences['Social Butterfly'] += 0.3;
    preferences['Outdoorsy Explorer'] += 0.2;
  }

  if (questionnaire.hobbies.includes('reading') || questionnaire.hobbies.includes('writing')) {
    preferences['Dark Academia'] += 0.2;
    preferences['Coffee Shop Philosopher'] += 0.2;
  }

  if (questionnaire.hobbies.includes('fitness') || questionnaire.hobbies.includes('sports')) {
    preferences['Gym Rat / Athlete'] += 0.3;
    preferences['Outdoorsy Explorer'] += 0.2;
  }

  if (questionnaire.hobbies.includes('art') || questionnaire.hobbies.includes('music') || questionnaire.hobbies.includes('theater')) {
    preferences['Creative Spirit'] += 0.3;
    preferences['Culture Enthusiast'] += 0.2;
  }

  if (questionnaire.personalityTraits.includes('introverted')) {
    preferences['Dark Academia'] += 0.15;
    preferences['Chill Minimalist'] += 0.15;
  }

  if (questionnaire.personalityTraits.includes('extroverted')) {
    preferences['Social Butterfly'] += 0.25;
    preferences['Culture Enthusiast'] += 0.15;
  }

  // Normalize to 0-1 range
  const maxScore = Math.max(...Object.values(preferences));
  if (maxScore > 0) {
    Object.keys(preferences).forEach(key => {
      preferences[key] = Math.min(1, preferences[key] / maxScore);
    });
  }

  return preferences;
}
