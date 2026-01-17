import { AIGeneratedProfile } from '@/types';

/**
 * Calculate user preferences based on questionnaire data, schedule, and AI summary
 * No longer uses archetypes - focuses on raw profile characteristics
 */
export function extractUserProfileFeatures(
  aiProfile: AIGeneratedProfile
): Record<string, number> {
  const features: Record<string, number> = {};

  const summary = aiProfile.summary.toLowerCase();
  const insights = aiProfile.personalityInsights.map(i => i.toLowerCase()).join(' ');
  const strengths = aiProfile.strengthsAsPartner.map(s => s.toLowerCase()).join(' ');
  const fullText = `${summary} ${insights} ${strengths}`;

  // Extract personality and lifestyle features
  const featureKeywords: Record<string, string[]> = {
    'academic_focused': ['academic', 'school', 'study', 'learning', 'grades', 'intellectual', 'research'],
    'creative': ['art', 'music', 'creative', 'design', 'imagination', 'artistic', 'theater'],
    'social': ['social', 'outgoing', 'friendly', 'people', 'networking', 'community', 'events'],
    'athletic': ['fitness', 'athletic', 'gym', 'sport', 'exercise', 'active', 'competitive'],
    'outdoors': ['hiking', 'outdoor', 'nature', 'adventure', 'exploration', 'trail', 'fresh air'],
    'intellectual': ['philosophy', 'ideas', 'discussion', 'debate', 'thinking', 'thoughtful', 'reflective'],
    'ambitious': ['dedicated', 'hardworking', 'ambitious', 'passionate', 'determined', 'persistent'],
    'cultural': ['cultural', 'diverse', 'global', 'appreciation', 'worldly', 'perspectives'],
    'introverted': ['introverted', 'quiet', 'private', 'alone', 'contemplative', 'peaceful'],
    'extroverted': ['extroverted', 'outgoing', 'social', 'energetic', 'spontaneous', 'adventurous'],
  };

  // Score each feature based on keyword matches
  Object.entries(featureKeywords).forEach(([feature, keywords]) => {
    let score = 0;
    keywords.forEach(keyword => {
      const count = (fullText.match(new RegExp(keyword, 'g')) || []).length;
      score += count * 0.1;
    });
    features[feature] = score;
  });

  // Normalize to 0-1 range
  const maxScore = Math.max(...Object.values(features));
  if (maxScore > 0) {
    Object.keys(features).forEach(key => {
      features[key] = Math.min(1, features[key] / maxScore);
    });
  }

  return features;
}

/**
 * Calculate compatibility between two users based on profile features
 * Uses cosine similarity on feature vectors
 */
export function calculateFeatureSimilarity(
  features1: Record<string, number>,
  features2: Record<string, number>
): number {
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  const allFeatures = new Set([...Object.keys(features1), ...Object.keys(features2)]);

  allFeatures.forEach(feature => {
    const f1 = features1[feature] || 0;
    const f2 = features2[feature] || 0;

    dotProduct += f1 * f2;
    magnitude1 += f1 * f1;
    magnitude2 += f2 * f2;
  });

  if (magnitude1 > 0 && magnitude2 > 0) {
    return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
  }

  return 0;
}

/**
 * Blend explicit (questionnaire + AI) and implicit (viewing behavior) preferences
 * With constant ratio: 60% explicit, 20% implicit (20% reserved for schedule)
 * Returns blended feature scores
 */
export function blendPreferences(
  explicitFeatures: Record<string, number>,
  implicitFeatures: Record<string, number>,
  implicitConfidence: number
): {
  features: Record<string, number>;
} {
  const EXPLICIT_WEIGHT = 0.6;
  const IMPLICIT_WEIGHT = 0.2;

  // Adjust implicit weight by confidence - low confidence views get less weight
  const adjustedImplicitWeight = IMPLICIT_WEIGHT * implicitConfidence;
  const adjustedExplicitWeight = EXPLICIT_WEIGHT + (IMPLICIT_WEIGHT * (1 - implicitConfidence));

  // Blend the features
  const blended: Record<string, number> = {};
  
  const allFeatures = new Set([...Object.keys(explicitFeatures), ...Object.keys(implicitFeatures)]);
  
  allFeatures.forEach(feature => {
    const eScore = explicitFeatures[feature] || 0;
    const iScore = implicitFeatures[feature] || 0;
    
    blended[feature] = (eScore * adjustedExplicitWeight) + (iScore * adjustedImplicitWeight);
  });

  return {
    features: blended,
  };
}
