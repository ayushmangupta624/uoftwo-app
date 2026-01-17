// lib/aiProfileGenerator.ts

import { GoogleGenerativeAI } from '@google/generative-ai';
import { QuestionnaireData, ParsedCourse, AIGeneratedProfile } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * 10 personality/lifestyle features extracted from questionnaires
 */
export const PERSONALITY_FEATURES = [
  'academic_focus',      // STEM vs Arts vs balanced
  'creativity',          // artistic/creative pursuits
  'social_energy',       // introvert vs extrovert
  'physical_activity',   // sports/fitness preference
  'cultural_engagement', // arts, culture, museums
  'study_style',         // collaborative vs solo
  'nightlife',           // going out frequency
  'intellectual_depth',  // philosophical discussions
  'adventure_seeking',   // outdoorsy/exploration
  'mindfulness'          // chill/minimalist/wellness
] as const;

/**
 * Generate a comprehensive user profile using Gemini AI
 * Extracts 10 personality/lifestyle features and creates semantic embeddings
 */
export async function generateUserProfile(
  userData: {
    name: string;
    year?: number;
    program?: string;
    questionnaire: QuestionnaireData;
    schedule?: ParsedCourse[];
  }
): Promise<AIGeneratedProfile> {
  
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-pro',
    generationConfig: {
      temperature: 0.7,
      responseMimeType: 'application/json',
    }
  });

  const systemPrompt = 'You are an expert matchmaker and personality analyst. Extract personality/lifestyle features from questionnaire data and create authentic dating profiles.';
  
  const prompt = `${systemPrompt}

Analyze this University of Toronto student's questionnaire responses and extract 10 personality/lifestyle features.

Student Information:
- Name: ${userData.name}
- Year: ${userData.year ? `Year ${userData.year}` : 'Not specified'}
- Program: ${userData.program || 'Not specified'}

Questionnaire Responses:
Hobbies: ${userData.questionnaire.hobbies.join(', ')}
Favorite Bands/Artists: ${userData.questionnaire.favoriteBands.join(', ')}
Music Genres: ${userData.questionnaire.musicGenres.join(', ')}
Sports Teams: ${userData.questionnaire.sportsTeams.join(', ')}
Football Preference: ${userData.questionnaire.footballPreference || 'Not specified'}
UofT Clubs: ${userData.questionnaire.clubs.join(', ')}
Study Preference: ${userData.questionnaire.studyPreference || 'Flexible'}
Favorite Campus Spots: ${userData.questionnaire.favCampusSpots.join(', ')}
Personality Traits: ${userData.questionnaire.personalityTraits.join(', ')}
Core Values: ${userData.questionnaire.values.join(', ')}
Going Out Frequency: ${userData.questionnaire.goingOutFrequency || 'Sometimes'}
Ideal Weekend: ${userData.questionnaire.idealWeekend || 'Not specified'}
About Me: ${userData.questionnaire.aboutMe || 'Not specified'}
Looking For: ${userData.questionnaire.lookingFor || 'Not specified'}
Deal Breakers: ${userData.questionnaire.dealBreakers.join(', ')}

${userData.schedule ? `Current Courses: ${userData.schedule.map(c => c.courseCode).join(', ')}` : ''}

TASK 1: Extract 10 feature scores (0.0-1.0) for these personality/lifestyle dimensions:
- academic_focus: STEM (1.0) vs Arts (0.0) vs balanced (0.5)
- creativity: artistic/creative pursuits (0.0-1.0)
- social_energy: introvert (0.0) vs extrovert (1.0)
- physical_activity: sports/fitness preference (0.0-1.0)
- cultural_engagement: arts, culture, museums (0.0-1.0)
- study_style: solo (0.0) vs collaborative (1.0)
- nightlife: staying in (0.0) vs going out (1.0)
- intellectual_depth: practical (0.0) vs philosophical (1.0)
- adventure_seeking: homebody (0.0) vs explorer (1.0)
- mindfulness: high-energy (0.0) vs calm/zen (1.0)

Use keyword analysis to extract features from their responses.

TASK 2: Create an engaging profile with:
1. SUMMARY: 3-4 sentences capturing their personality
2. PERSONALITY_INSIGHTS: 4-5 bullet points about interests and uniqueness
3. STRENGTHS_AS_PARTNER: 3-4 qualities that make them a great match
4. IDEAL_MATCH: 2-3 sentences describing compatible partners
5. CONVERSATION_STARTERS: 5 personalized icebreaker questions

Return in this JSON format:
{
  "features": [
    {"name": "academic_focus", "score": 0.8},
    {"name": "creativity", "score": 0.6},
    ... (all 10 features)
  ],
  "summary": "string",
  "personalityInsights": ["string"],
  "strengthsAsPartner": ["string"],
  "idealMatchDescription": "string",
  "conversationStarters": ["string"]
}

Be authentic and avoid generic clichés.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  if (!text) {
    throw new Error('Failed to generate profile');
  }

  const profileData = JSON.parse(text);
  
  return profileData as AIGeneratedProfile;
}

/**
 * Generate 768-dimensional semantic embedding using Google's text-embedding-004
 */
export async function generateProfileEmbedding(
  profile: AIGeneratedProfile,
  questionnaire: QuestionnaireData
): Promise<string[]> {
  
  // Combine all relevant information for semantic embedding
  const embeddingText = `
Profile Summary: ${profile.summary}
Personality Insights: ${profile.personalityInsights.join('. ')}
Partner Strengths: ${profile.strengthsAsPartner.join('. ')}
Ideal Match: ${profile.idealMatchDescription}
Hobbies: ${questionnaire.hobbies.join(', ')}
Music: ${questionnaire.favoriteBands.join(', ')}, ${questionnaire.musicGenres.join(', ')}
Sports: ${questionnaire.sportsTeams.join(', ')}
Clubs: ${questionnaire.clubs.join(', ')}
Traits: ${questionnaire.personalityTraits.join(', ')}
Values: ${questionnaire.values.join(', ')}
Looking for: ${questionnaire.lookingFor}
Ideal Weekend: ${questionnaire.idealWeekend}
  `.trim();

  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(embeddingText);
  
  // Convert 768-dim embedding to string array for database storage
  const values = result.embedding.values || [];
  return values.map(v => v.toString());
}

/**
 * Calculate cosine similarity between two embeddings
 */
export function cosineSimilarity(embedding1: number[], embedding2: number[]): number {
  if (embedding1.length !== embedding2.length) {
    throw new Error('Embeddings must have the same length');
  }

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    norm1 += embedding1[i] * embedding1[i];
    norm2 += embedding2[i] * embedding2[i];
  }

  const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

/**
 * Calculate word overlap between two AI summaries
 * Used for 30% AI Summary Compatibility scoring
 */
export function calculateSummaryOverlap(summary1: string, summary2: string): number {
  // Extract meaningful words (filter out common stop words)
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being']);
  
  const extractWords = (text: string): Set<string> => {
    return new Set(
      text.toLowerCase()
        .replace(/[^\w\s]/g, '') // remove punctuation
        .split(/\s+/)
        .filter(word => word.length > 3 && !stopWords.has(word))
    );
  };

  const words1 = extractWords(summary1);
  const words2 = extractWords(summary2);
  
  // Calculate Jaccard similarity
  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);
  
  return union.size === 0 ? 0 : intersection.size / union.size;
}
