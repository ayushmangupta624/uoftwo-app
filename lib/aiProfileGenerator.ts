// lib/aiProfileGenerator.ts

import { GoogleGenerativeAI } from '@google/generative-ai';
import { QuestionnaireData, ParsedCourse, AIGeneratedProfile, BuildingMetadata } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Map archetype to UofT building with creative associations
 */
export function getBuildingForArchetype(archetype: string): BuildingMetadata {
  const buildingMap: Record<string, BuildingMetadata> = {
    'STEM Scholar': {
      name: 'Bahen Centre for Information Technology',
      shortName: 'Bahen Centre',
      description: 'The modern hub of innovation where code meets creativity. Home to computer science, engineering, and tech enthusiasts who thrive in collaborative spaces.',
      colorGradient: 'from-indigo-500 to-purple-600',
      primaryColor: '#6366f1',
      secondaryColor: '#9333ea',
      icon: '💻',
      architecturalStyle: 'Modern Tech Hub',
      vibe: 'Innovative, Collaborative, Cutting-edge',
      commonActivities: ['Coding sessions', 'Study groups', 'Tech talks', 'Problem solving'],
      aesthetic: 'Clean tech, blueprints, coffee-stained notes'
    },
    'Dark Academia': {
      name: 'Robarts Library',
      shortName: 'Robarts Library',
      description: 'The iconic brutalist fortress of knowledge. Where late-night study sessions meet deep intellectual conversations. A sanctuary for those who find beauty in the pursuit of wisdom.',
      colorGradient: 'from-slate-700 to-gray-900',
      primaryColor: '#475569',
      secondaryColor: '#1e293b',
      icon: '📚',
      architecturalStyle: 'Brutalist Monument',
      vibe: 'Scholarly, Mysterious, Timeless',
      commonActivities: ['Late-night studying', 'Philosophical discussions', 'Research sessions', 'Reading marathons'],
      aesthetic: 'Gothic libraries, vintage books, candlelight'
    },
    'Outdoorsy Explorer': {
      name: "King's College Circle",
      shortName: "King's College Circle",
      description: 'The heart of campus where paths converge. Surrounded by historic buildings and green spaces, perfect for those who love fresh air, walks, and outdoor adventures.',
      colorGradient: 'from-green-500 to-emerald-600',
      primaryColor: '#22c55e',
      secondaryColor: '#059669',
      icon: '🌳',
      architecturalStyle: 'Historic Campus Green',
      vibe: 'Fresh, Open, Energetic',
      commonActivities: ['Campus walks', 'Outdoor study sessions', 'Frisbee', 'People watching'],
      aesthetic: 'Hiking boots, campus trails, sunset photos'
    },
    'Creative Spirit': {
      name: 'Hart House',
      shortName: 'Hart House',
      description: 'The cultural soul of UofT. Where art, music, theater, and creativity flourish. A place for those who express themselves through various mediums and appreciate the arts.',
      colorGradient: 'from-rose-500 to-pink-600',
      primaryColor: '#f43f5e',
      secondaryColor: '#db2777',
      icon: '🎨',
      architecturalStyle: 'Gothic Revival',
      vibe: 'Artistic, Expressive, Vibrant',
      commonActivities: ['Art exhibitions', 'Music performances', 'Theater shows', 'Creative workshops'],
      aesthetic: 'Art supplies, indie playlists, film cameras'
    },
    'Social Butterfly': {
      name: 'Sidney Smith Hall',
      shortName: 'Sidney Smith',
      description: 'The UTSU hub where social connections flourish. Perfect for those who love group activities, events, and building community.',
      colorGradient: 'from-amber-500 to-orange-600',
      primaryColor: '#f59e0b',
      secondaryColor: '#ea580c',
      icon: '🦋',
      architecturalStyle: 'Modern Community',
      vibe: 'Welcoming, Social, Energetic',
      commonActivities: ['Social events', 'Game nights', 'Community gatherings', 'Networking'],
      aesthetic: 'Group photos, event tickets, club badges'
    },
    'Coffee Shop Philosopher': {
      name: 'University College',
      shortName: 'University College',
      description: 'Where deep conversations happen over coffee. A historic building perfect for those who love to discuss ideas, philosophy, and life over a good brew.',
      colorGradient: 'from-amber-700 to-amber-900',
      primaryColor: '#b45309',
      secondaryColor: '#78350f',
      icon: '☕',
      architecturalStyle: 'Historic Academic',
      vibe: 'Thoughtful, Warm, Conversational',
      commonActivities: ['Coffee chats', 'Philosophical discussions', 'Study sessions', 'Debates'],
      aesthetic: 'Latte art, worn journals, cozy corner tables'
    },
    'Gym Rat / Athlete': {
      name: 'Athletic Centre',
      shortName: 'Athletic Centre',
      description: 'Where strength meets determination. The epicenter of fitness, sports, and physical activity for those who live an active lifestyle and push their limits.',
      colorGradient: 'from-red-600 to-red-800',
      primaryColor: '#dc2626',
      secondaryColor: '#991b1b',
      icon: '💪',
      architecturalStyle: 'Modern Athletic',
      vibe: 'Energetic, Competitive, Motivated',
      commonActivities: ['Workouts', 'Sports', 'Training sessions', 'Fitness classes'],
      aesthetic: 'Athletic gear, protein shakers, Varsity Blues'
    },
    'Night Owl Grinder': {
      name: 'Knox College Library',
      shortName: 'Knox College Library',
      description: 'The 24/7 sanctuary for night owls. Where late-night study sessions, research, and academic dedication meet. Open all night for those who work best when the world sleeps.',
      colorGradient: 'from-blue-600 to-indigo-800',
      primaryColor: '#2563eb',
      secondaryColor: '#3730a3',
      icon: '🦉',
      architecturalStyle: 'Modern Academic',
      vibe: 'Focused, Dedicated, Nocturnal',
      commonActivities: ['All-night study sessions', 'Research', 'Late-night coding', 'Academic grind'],
      aesthetic: 'Energy drinks, neon lights, 3AM study vibes'
    },
    'Culture Enthusiast': {
      name: 'Multi-Faith Centre',
      shortName: 'Multi-Faith Centre',
      description: 'Where diverse cultures, traditions, and perspectives converge. A space for those who appreciate cultural exchange, interfaith dialogue, and global understanding.',
      colorGradient: 'from-purple-600 to-violet-800',
      primaryColor: '#9333ea',
      secondaryColor: '#6b21a8',
      icon: '🏛️',
      architecturalStyle: 'Modern Cultural',
      vibe: 'Cultured, Curious, Refined',
      commonActivities: ['Cultural events', 'Interfaith dialogue', 'Cultural appreciation', 'Community gatherings'],
      aesthetic: 'Concert tickets, cultural society flags, food spots'
    },
    'Chill Minimalist': {
      name: 'Victoria College',
      shortName: 'Victoria College',
      description: 'Simple, elegant, and balanced. A place for those who appreciate clean aesthetics, minimalism, and finding peace in simplicity. Where less is more.',
      colorGradient: 'from-cyan-500 to-blue-600',
      primaryColor: '#06b6d4',
      secondaryColor: '#2563eb',
      icon: '🧘',
      architecturalStyle: 'Modern Minimalist',
      vibe: 'Calm, Balanced, Zen',
      commonActivities: ['Meditation', 'Quiet study', 'Mindful walks', 'Simple pleasures'],
      aesthetic: 'Clean aesthetic, plants, lo-fi playlists'
    }
  };

  return buildingMap[archetype] || {
    name: 'University College',
    shortName: 'UC',
    description: 'The historic heart of UofT, where tradition meets innovation.',
    colorGradient: 'from-gray-500 to-gray-700',
    primaryColor: '#6b7280',
    secondaryColor: '#374151',
    icon: '🏛️',
    architecturalStyle: 'Historic',
    vibe: 'Classic, Timeless, Welcoming',
    commonActivities: ['Study', 'Socialize', 'Explore'],
    aesthetic: 'Classic architecture, timeless elegance'
  };
}

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
2. ARCHETYPE: Choose EXACTLY ONE from this list that best matches their personality:
   - STEM Scholar
   - Dark Academia
   - Outdoorsy Explorer
   - Creative Spirit
   - Social Butterfly
   - Coffee Shop Philosopher
   - Gym Rat / Athlete
   - Night Owl Grinder
   - Culture Enthusiast
   - Chill Minimalist
3. PERSONALITY_INSIGHTS: 4-5 bullet points about their personality, interests, and what makes them unique
4. STRENGTHS_AS_PARTNER: 3-4 qualities that would make them a great partner/match
5. IDEAL_MATCH: 2-3 sentences describing who would be compatible with them
6. CONVERSATION_STARTERS: 5 personalized questions or topics that would make great icebreakers based on their interests

Return the response in the following JSON format:
{
  "summary": "string",
  "archetype": "string - MUST be exactly one of the 10 options listed above",
  "personalityInsights": ["string"],
  "strengthsAsPartner": ["string"],
  "idealMatchDescription": "string",
  "conversationStarters": ["string"]
}

IMPORTANT: The archetype MUST be exactly one of the 10 options provided. Do not create variations or combinations.

Be authentic, specific, and avoid generic dating profile clichés. Make it personal and relatable.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  if (!text) {
    throw new Error('Failed to generate profile');
  }

  const profileData = JSON.parse(text);
  
  // Get building metadata based on archetype
  const building = getBuildingForArchetype(profileData.archetype);
  
  const profile: AIGeneratedProfile = {
    ...profileData,
    building
  };
  
  return profile;
}

/**
 * Generate profile embedding for semantic matching
 */
export async function generateProfileEmbedding(
  profile: AIGeneratedProfile,
  questionnaire: QuestionnaireData
): Promise<number[]> {
  
  // Combine all relevant information into a text representation
  const embeddingText = `
Profile: ${profile.summary}
Archetype: ${profile.archetype}
Building: ${profile.building.name}
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
  
  // Gemini returns embedding in result.embedding.values
  return result.embedding.values || [];
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

  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

/**
 * Get building compatibility info for matched profiles
 */
export function getBuildingCompatibility(
  building1: BuildingMetadata,
  building2: BuildingMetadata
): {
  compatibility: 'high' | 'medium' | 'low';
  reason: string;
  sharedVibe: string;
} {
  // Buildings that naturally complement each other
  const complementaryBuildings: Record<string, string[]> = {
    'Bahen Centre': ['Knox College Library', 'Sidney Smith'],
    'Robarts Library': ['Sidney Smith', 'New College'],
    "King's College Circle": ['Hart House', 'New College'],
    'Hart House': ["King's College Circle", 'ROM Area'],
    'Innis College': ['Hart House', "King's College Circle"],
    'Sidney Smith': ['Robarts Library', 'Bahen Centre'],
    'Athletic Centre': ["King's College Circle", 'Innis College'],
    'Knox College Library': ['Bahen Centre', 'Robarts Library'],
    'ROM Area': ['Hart House', 'New College'],
    'New College': ['ROM Area', "King's College Circle"]
  };

  const shared = complementaryBuildings[building1.name]?.includes(building2.name) ||
                 complementaryBuildings[building2.name]?.includes(building1.name);

  if (building1.name === building2.name) {
    return {
      compatibility: 'high',
      reason: `Both share the ${building1.shortName} vibe - perfect match!`,
      sharedVibe: building1.vibe
    };
  }

  if (shared) {
    return {
      compatibility: 'high',
      reason: `${building1.shortName} and ${building2.shortName} complement each other beautifully`,
      sharedVibe: `${building1.vibe} meets ${building2.vibe}`
    };
  }

  // Check for similar vibes
  const vibe1 = building1.vibe.toLowerCase();
  const vibe2 = building2.vibe.toLowerCase();
  const similarVibes = vibe1.split(', ').some(v => vibe2.includes(v));

  if (similarVibes) {
    return {
      compatibility: 'medium',
      reason: `Different buildings but similar energy - ${building1.shortName} and ${building2.shortName}`,
      sharedVibe: 'Complementary energies'
    };
  }

  return {
    compatibility: 'low',
    reason: `Opposites attract! ${building1.shortName} and ${building2.shortName} bring different perspectives`,
    sharedVibe: 'Diverse vibes'
  };
}

/**
 * Generate icebreaker questions for a match
 */
export async function generateIcebreakers(
  user1Profile: AIGeneratedProfile,
  user2Profile: AIGeneratedProfile,
  sharedInterests: string[]
): Promise<string[]> {
  
  const buildingCompat = getBuildingCompatibility(user1Profile.building, user2Profile.building);
  
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-pro',
    generationConfig: {
      temperature: 0.9,
      responseMimeType: 'application/json',
    }
  });

  const systemPrompt = 'You are a dating coach helping people have great first conversations. Create questions that feel natural and engaging, and incorporate UofT campus culture and building references when appropriate.';
  
  const prompt = `${systemPrompt}

Generate 5 personalized conversation starters for two UofT students who just matched on a dating app.

Person 1: ${user1Profile.summary}
Archetype: ${user1Profile.archetype}
Building: ${user1Profile.building.name} (${user1Profile.building.vibe})

Person 2: ${user2Profile.summary}
Archetype: ${user2Profile.archetype}
Building: ${user2Profile.building.name} (${user2Profile.building.vibe})

Building Compatibility: ${buildingCompat.reason}
Shared Interests: ${sharedInterests.join(', ')}

Create engaging, specific questions that:
1. Reference their shared interests naturally
2. Mention their building vibes or campus locations when relevant
3. Are open-ended and encourage storytelling
4. Feel authentic, not generic
5. Help them discover more about each other
6. Could lead to planning an activity together (maybe at one of their buildings!)

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
  building?: string;
}[]> {
  
  const buildingCompat = getBuildingCompatibility(user1.profile.building, user2.profile.building);
  
  const prompt = `Generate 6 diverse date/activity suggestions for two UofT students who matched.

Person 1:
${user1.profile.summary}
Archetype: ${user1.profile.archetype}
Building: ${user1.profile.building.name} (${user1.profile.building.description})
Interests: ${user1.questionnaire.hobbies.join(', ')}
Music: ${user1.questionnaire.musicGenres.join(', ')}
Going out: ${user1.questionnaire.goingOutFrequency}

Person 2:
${user2.profile.summary}
Archetype: ${user2.profile.archetype}
Building: ${user2.profile.building.name} (${user2.profile.building.description})
Interests: ${user2.questionnaire.hobbies.join(', ')}
Music: ${user2.questionnaire.musicGenres.join(', ')}
Going out: ${user2.questionnaire.goingOutFrequency}

Building Compatibility: ${buildingCompat.reason}
${scheduleCompatibility?.freeTimeOverlap ? `
Common Free Time: ${scheduleCompatibility.freeTimeOverlap.join(', ')}
` : ''}

Create 6 activity suggestions with variety:
- 2 casual/low-key activities (coffee, study date, campus walk) - consider their buildings
- 2 date ideas (dinner, event, activity) - could be at or near their buildings
- 2 based on shared interests and building vibes

For each activity, specify:
1. title: Short, catchy name
2. description: 2-3 sentences about the activity
3. category: 'casual', 'date', 'study', 'sports', 'cultural', 'event'
4. location: Specific UofT/Toronto location - consider their buildings: ${user1.profile.building.shortName} and ${user2.profile.building.shortName}
5. estimatedCost: 'free', '$', '$$', '$$$'
6. timePreference: 'morning', 'afternoon', 'evening', 'flexible'
7. reason: Why this suits them (reference their interests and building vibes)
8. building: Which building this activity relates to (${user1.profile.building.shortName}, ${user2.profile.building.shortName}, or both)

Return as JSON object with an "activities" array of activity objects.`;

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-pro',
    generationConfig: {
      temperature: 0.8,
      responseMimeType: 'application/json',
    }
  });

  const systemPrompt = 'You are a local Toronto/UofT expert creating personalized date ideas. Be specific about locations and activities, and incorporate the buildings and their vibes into suggestions.';
  
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
