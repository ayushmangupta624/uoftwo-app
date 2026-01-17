import { GoogleGenerativeAI } from '@google/generative-ai';
import { QuestionnaireData, ParsedCourse, AIGeneratedProfile } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Generate a comprehensive user profile using Gemini
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
      temperature: 0.8,
      responseMimeType: 'application/json',
    }
  });

  const systemPrompt = 'You are an expert matchmaker and profile writer. Create engaging, authentic profiles that highlight unique qualities while being honest and grounded.';

  const prompt = `${systemPrompt}

You are creating a dating profile for a University of Toronto student. Based on the information below, create a comprehensive, authentic, and engaging profile.

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

Please create a profile with the following sections:

1. SUMMARY: A 3-4 sentence engaging bio that captures their personality and interests
2. PERSONALITY_INSIGHTS: 4-5 bullet points about their personality, interests, and what makes them unique
3. STRENGTHS_AS_PARTNER: 3-4 qualities that would make them a great partner/match
4. IDEAL_MATCH: 2-3 sentences describing who would be compatible with them
5. CONVERSATION_STARTERS: 5 personalized questions or topics that would make great icebreakers based on their interests

Return the response in the following JSON format:
{
  "summary": "string",
  "personalityInsights": ["string"],
  "strengthsAsPartner": ["string"],
  "idealMatchDescription": "string",
  "conversationStarters": ["string"]
}`;

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
 * Generate profile embedding for semantic matching
 */
export async function generateProfileEmbedding(
  profile: AIGeneratedProfile,
  questionnaire: QuestionnaireData
): Promise<number[]> {
  const embeddingText = `
Profile: ${profile.summary}
Personality: ${profile.personalityInsights.join('. ')}
Hobbies: ${questionnaire.hobbies.join(', ')}
Music: ${questionnaire.favoriteBands.join(', ')}, ${questionnaire.musicGenres.join(', ')}
Sports: ${questionnaire.sportsTeams.join(', ')}
Clubs: ${questionnaire.clubs.join(', ')}
Values: ${questionnaire.values.join(', ')}
Looking for: ${questionnaire.lookingFor}
  `.trim();

  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(embeddingText);

  return result.embedding.values || [];
}

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

  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

/**
 * Generate icebreaker questions for a match
 */
export async function generateIcebreakers(
  user1Profile: AIGeneratedProfile,
  user2Profile: AIGeneratedProfile,
  sharedInterests: string[]
): Promise<string[]> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
    generationConfig: {
      temperature: 0.9,
      responseMimeType: 'application/json',
    }
  });

  const systemPrompt = 'You are a dating coach helping people have great first conversations. Create questions that feel natural and engaging.';

  const prompt = `${systemPrompt}

Generate 5 personalized conversation starters for two UofT students who just matched on a dating app.

Person 1: ${user1Profile.summary}
Personality: ${user1Profile.personalityInsights.join(', ')}
Strengths: ${user1Profile.strengthsAsPartner.join(', ')}

Person 2: ${user2Profile.summary}
Personality: ${user2Profile.personalityInsights.join(', ')}
Strengths: ${user2Profile.strengthsAsPartner.join(', ')}

Shared Interests: ${sharedInterests.join(', ')}

Create engaging, specific questions that:
1. Reference their shared interests naturally
2. Are open-ended and encourage storytelling
3. Feel authentic, not generic
4. Help them discover more about each other

Return as a JSON object with an "icebreakers" array of strings.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  if (!text) {
    throw new Error('Failed to generate icebreakers');
  }

  const data = JSON.parse(text);
  return data.icebreakers || [];
}

/**
 * Generate activity suggestions for a matched pair
 */
export async function generateActivitySuggestions(
  user1: {
    profile: AIGeneratedProfile;
    questionnaire: QuestionnaireData;
  },
  user2: {
    profile: AIGeneratedProfile;
    questionnaire: QuestionnaireData;
  },
  scheduleCompatibility?: {
    freeTimeOverlap: string[];
  }
): Promise<{
  title: string;
  description: string;
  category: string;
  location?: string;
  estimatedCost?: string;
  timePreference?: string;
  reason: string;
}[]> {
  const prompt = `Generate 6 diverse date/activity suggestions for two UofT students who matched.

Person 1:
${user1.profile.summary}
Personality: ${user1.profile.personalityInsights.join(', ')}
Strengths: ${user1.profile.strengthsAsPartner.join(', ')}
Interests: ${user1.questionnaire.hobbies.join(', ')}
Music: ${user1.questionnaire.musicGenres.join(', ')}
Going out: ${user1.questionnaire.goingOutFrequency}

Person 2:
${user2.profile.summary}
Personality: ${user2.profile.personalityInsights.join(', ')}
Strengths: ${user2.profile.strengthsAsPartner.join(', ')}
Interests: ${user2.questionnaire.hobbies.join(', ')}
Music: ${user2.questionnaire.musicGenres.join(', ')}
Going out: ${user2.questionnaire.goingOutFrequency}

${scheduleCompatibility?.freeTimeOverlap ? `
Common Free Time: ${scheduleCompatibility.freeTimeOverlap.join(', ')}
` : ''}

Create 6 activity suggestions with variety:
- 2 casual/low-key activities (coffee, study date, campus walk)
- 2 date ideas (dinner, event, activity)
- 2 based on shared interests

For each activity, specify:
1. title: Short, catchy name
2. description: 2-3 sentences about the activity
3. category: 'casual', 'date', 'study', 'sports', 'cultural', 'event'
4. location: Specific UofT/Toronto location
5. estimatedCost: 'free', '$', '$$', '$$$'
6. timePreference: 'morning', 'afternoon', 'evening', 'flexible'
7. reason: Why this suits them (reference their interests)

Return as JSON object with an "activities" array of activity objects.`;

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
    generationConfig: {
      temperature: 0.8,
      responseMimeType: 'application/json',
    }
  });

  const systemPrompt = 'You are a local Toronto/UofT expert creating personalized date ideas. Be specific about locations and activities.';

  const fullPrompt = `${systemPrompt}

${prompt}`;

  const result = await model.generateContent(fullPrompt);
  const response = result.response;
  const text = response.text();

  if (!text) {
    throw new Error('Failed to generate activity suggestions');
  }

  const data = JSON.parse(text);
  return data.activities || [];
}
