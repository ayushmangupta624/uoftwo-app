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

export interface BuildingMetadata {
  name: string;
  shortName: string;
  description: string;
  colorGradient: string; // Tailwind gradient classes
  primaryColor: string; // Hex color
  secondaryColor: string; // Hex color
  icon: string; // Emoji or icon identifier
  architecturalStyle: string;
  vibe: string;
  commonActivities: string[];
  aesthetic: string; // Visual aesthetic description for UI decoration
  backgroundImage?: string; // Optional background image URL (for future use)
}

export interface AIGeneratedProfile {
  summary: string;
  archetype: string;
  personalityInsights: string[];
  strengthsAsPartner: string[];
  idealMatchDescription: string;
  conversationStarters: string[];
  building: BuildingMetadata; // Added building metadata
}
