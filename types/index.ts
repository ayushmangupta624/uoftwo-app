// types/index.ts

export interface ScheduleUpload {
  file: File;
  fileType: 'pdf' | 'image';
}

export interface ParsedCourse {
  courseCode: string;
  courseName?: string;
  semester: string;
  timeSlots: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    location?: string;
  }[];
}

export interface QuestionnaireData {
  // Hobbies
  hobbies: string[];
  
  // Music
  favoriteBands: string[];
  musicGenres: string[];
  
  // Sports
  sportsTeams: string[];
  footballPreference?: 'real_madrid' | 'barca' | 'neither' | 'dont_follow';
  
  // UofT Specific
  clubs: string[];
  studyPreference?: 'alone' | 'groups' | 'flexible';
  favCampusSpots: string[];
  
  // Personality
  personalityTraits: string[];
  values: string[];
  
  // Lifestyle
  goingOutFrequency?: 'rarely' | 'sometimes' | 'often' | 'very_often';
  idealWeekend?: string;
  
  // Free text
  aboutMe?: string;
  lookingFor?: string;
  dealBreakers: string[];
}

export interface AIGeneratedProfile {
  summary: string;
  archetype: string;
  personalityInsights: string[];
  strengthsAsPartner: string[];
  idealMatchDescription: string;
  conversationStarters: string[];
}

export interface MatchScore {
  overall: number; // 0-100
  breakdown: {
    profileSimilarity: number;
    scheduleCompatibility: number;
    sharedInterestsScore: number;
    personalityCompatibility: number;
  };
  sharedInterests: string[];
  commonClubs: string[];
  scheduleOverlap: {
    freeTimeSlots: string[];
    commonCourses: string[];
  };
}

export interface MatchResult {
  matchId: string;
  user: {
    id: string;
    name: string;
    profilePicture?: string;
    year?: number;
    program?: string;
    archetype?: string;
    bio?: string;
  };
  score: MatchScore;
  suggestedActivities: ActivitySuggestion[];
}

export interface ActivitySuggestion {
  id?: string;
  title: string;
  description: string;
  category: 'date' | 'study' | 'event' | 'casual' | 'sports' | 'cultural';
  location?: string;
  estimatedCost?: 'free' | '$' | '$$' | '$$$';
  timePreference?: 'morning' | 'afternoon' | 'evening' | 'flexible';
  reason: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  year?: number;
  program?: string;
  bio?: string;
  profilePicture?: string;
  aiProfile?: string;
  archetype?: string;
  profileCompleted: boolean;
  schedule?: {
    courses: ParsedCourse[];
  };
  questionnaire?: QuestionnaireData;
}

export interface ConversationStarter {
  category: string;
  question: string;
  context: string; // Why this question is relevant
}
