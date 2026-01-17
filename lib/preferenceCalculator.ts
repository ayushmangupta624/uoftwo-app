// lib/preferenceCalculator.ts

import { QuestionnaireData } from '@/types';
import { PERSONALITY_FEATURES } from './aiProfileGenerator';

/**
 * Calculate implicit user preferences based on profile viewing behavior
 * Tracks 10 personality feature scores instead of archetypes
 */
export function calculateImplicitPreferences(profileViews: any[]): {
  featureScores: Record<string, number>;
  confidenceScore: number;
  viewCount: number;
} {
  const featureScores: Record<string, number> = {};
  
  // Initialize all features with 0
  PERSONALITY_FEATURES.forEach(feature => {
    featureScores[feature] = 0;
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

    // Extract features from the viewed profile
    if (view.viewedProfile?.features) {
      const viewedFeatures = Array.isArray(view.viewedProfile.features) 
        ? view.viewedProfile.features 
        : JSON.parse(view.viewedProfile.features || '[]');

      // Weight liked profiles more than passed profiles
      const likeMultiplier = view.interactionType === 'like' ? 1.0 : -0.3;

      viewedFeatures.forEach((feature: { name: string; score: number }) => {
        if (featureScores.hasOwnProperty(feature.name)) {
          featureScores[feature.name] += engagementScore * feature.score * likeMultiplier;
        }
      });
    }
  });

  // Normalize feature scores
  const maxScore = Math.max(...Object.values(featureScores), 1);
  for (const feature in featureScores) {
    featureScores[feature] = featureScores[feature] / maxScore;
  }

  // Confidence increases with number of views, caps at 5+ views
  const confidenceScore = Math.min(profileViews.length / 5, 1);

  return {
    featureScores,
    confidenceScore,
    viewCount: profileViews.length
  };
}

/**
 * Extract explicit feature preferences from questionnaire answers
 */
export function extractQuestionnairePreferences(questionnaire: QuestionnaireData): Record<string, number> {
  const featureScores: Record<string, number> = {};

  // Initialize all features
  PERSONALITY_FEATURES.forEach(feature => {
    featureScores[feature] = 0.5; // Start neutral
  });

  // academic_focus: STEM vs Arts
  const stemKeywords = ['computer', 'engineering', 'math', 'science', 'physics', 'chem', 'bio'];
  const artsKeywords = ['literature', 'history', 'philosophy', 'art', 'music', 'drama'];
  const program = questionnaire.aboutMe?.toLowerCase() || '';
  const stemMatch = stemKeywords.some(k => program.includes(k));
  const artsMatch = artsKeywords.some(k => program.includes(k));
  featureScores.academic_focus = stemMatch ? 0.8 : artsMatch ? 0.2 : 0.5;

  // creativity: artistic hobbies
  const creativeHobbies = ['art', 'paint', 'draw', 'music', 'write', 'creative', 'design', 'photo'];
  const hasCreative = questionnaire.hobbies.some(h => 
    creativeHobbies.some(k => h.toLowerCase().includes(k))
  );
  featureScores.creativity = hasCreative ? 0.8 : 0.3;

  // social_energy: going out frequency
  const goingOutMap: Record<string, number> = {
    'Never': 0.1,
    'Rarely': 0.3,
    'Sometimes': 0.5,
    'Often': 0.7,
    'Always': 0.9
  };
  featureScores.social_energy = goingOutMap[questionnaire.goingOutFrequency || 'Sometimes'] || 0.5;

  // physical_activity: sports mentioned
  const sportsCount = questionnaire.sportsTeams?.length || 0;
  const hasAthletics = questionnaire.hobbies.some(h => 
    ['gym', 'sport', 'run', 'swim', 'bike', 'athletic'].some(k => h.toLowerCase().includes(k))
  );
  featureScores.physical_activity = sportsCount > 0 || hasAthletics ? 0.8 : 0.2;

  // cultural_engagement: museums, arts, culture
  const culturalInterests = ['museum', 'culture', 'theater', 'concert', 'gallery', 'opera'];
  const hasCultural = questionnaire.hobbies.some(h => 
    culturalInterests.some(k => h.toLowerCase().includes(k))
  );
  featureScores.cultural_engagement = hasCultural ? 0.8 : 0.3;

  // study_style: collaborative vs solo
  const studyMap: Record<string, number> = {
    'Solo': 0.2,
    'Group': 0.8,
    'Flexible': 0.5,
    'Collaborative': 0.8
  };
  featureScores.study_style = studyMap[questionnaire.studyPreference || 'Flexible'] || 0.5;

  // nightlife: already handled in social_energy, add party keywords
  const partyKeywords = ['party', 'club', 'bar', 'nightlife'];
  const hasParty = questionnaire.hobbies.some(h => 
    partyKeywords.some(k => h.toLowerCase().includes(k))
  );
  featureScores.nightlife = hasParty ? 0.9 : featureScores.social_energy;

  // intellectual_depth: philosophy, deep discussions
  const intellectualKeywords = ['philosophy', 'debate', 'discuss', 'read', 'book', 'intellectual'];
  const hasIntellectual = questionnaire.hobbies.some(h => 
    intellectualKeywords.some(k => h.toLowerCase().includes(k))
  );
  featureScores.intellectual_depth = hasIntellectual ? 0.8 : 0.4;

  // adventure_seeking: outdoor/travel activities
  const adventureKeywords = ['travel', 'hike', 'explore', 'adventure', 'outdoor', 'camp'];
  const hasAdventure = questionnaire.hobbies.some(h => 
    adventureKeywords.some(k => h.toLowerCase().includes(k))
  );
  featureScores.adventure_seeking = hasAdventure ? 0.8 : 0.3;

  // mindfulness: yoga, meditation, chill activities
  const mindfulKeywords = ['yoga', 'meditate', 'zen', 'mindful', 'calm', 'peaceful', 'chill'];
  const hasMindful = questionnaire.hobbies.some(h => 
    mindfulKeywords.some(k => h.toLowerCase().includes(k))
  );
  const stressedKeywords = ['grind', 'hustle', 'competitive', 'intense'];
  const hasStressed = questionnaire.personalityTraits.some(t => 
    stressedKeywords.some(k => t.toLowerCase().includes(k))
  );
  featureScores.mindfulness = hasMindful ? 0.8 : hasStressed ? 0.2 : 0.5;

  return featureScores;
}

/**
 * Blend explicit questionnaire preferences with implicit viewing behavior
 * Formula: 60% questionnaire + 40% viewing behavior
 */
export function blendPreferences(
  questionnaireFeatures: Record<string, number>,
  implicitFeatures: Record<string, number>,
  implicitConfidence: number
): {
  blendedFeatures: Record<string, number>;
  questionnaireWeight: number;
  implicitWeight: number;
} {
  const blendedFeatures: Record<string, number> = {};

  // Adjust weights based on implicit confidence
  // If confidence is low (< 5 views), rely more on questionnaire
  const baseImplicitWeight = 0.4;
  const adjustedImplicitWeight = baseImplicitWeight * implicitConfidence;
  const adjustedQuestionnaireWeight = 1 - adjustedImplicitWeight;

  // Blend each feature
  for (const feature of PERSONALITY_FEATURES) {
    const questionnaireScore = questionnaireFeatures[feature] || 0;
    const implicitScore = implicitFeatures[feature] || 0;

    blendedFeatures[feature] = 
      questionnaireScore * adjustedQuestionnaireWeight +
      implicitScore * adjustedImplicitWeight;
  }

  return {
    blendedFeatures,
    questionnaireWeight: adjustedQuestionnaireWeight,
    implicitWeight: adjustedImplicitWeight
  };
}
