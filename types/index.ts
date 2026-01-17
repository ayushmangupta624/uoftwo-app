// types/index.ts

export interface QuestionnaireData {
  hobbies: string[];
  favoriteBands: string[];
  musicGenres: string[];
  sportsTeams: string[];
  footballPreference?: string;
  clubs: string[];
  studyPreference?: string;
  favCampusSpots: string[];
  personalityTraits: string[];
  values: string[];
  goingOutFrequency?: string;
  idealWeekend?: string;
  aboutMe?: string;
  lookingFor?: string;
  dealBreakers: string[];
}

export interface ParsedCourse {
  courseCode: string;
  courseName?: string;
  building?: string;
  time?: string;
}

export interface PersonalityFeature {
  name: string;
  score: number; // 0.0 - 1.0
}

export interface AIGeneratedProfile {
  features: PersonalityFeature[]; // 10 personality/lifestyle features
  summary: string;
  personalityInsights: string[];
  strengthsAsPartner: string[];
  idealMatchDescription: string;
  conversationStarters: string[];
}
