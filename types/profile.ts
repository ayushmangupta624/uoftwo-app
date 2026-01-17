export type Gender = "male" | "female" | "other" | "non-binary";

export type Ethnicity = "ASIAN" | "BLACK" | "HISPANIC" | "WHITE" | "NATIVE" | "MIDDLE_EASTERN" | "OTHER";

export interface UserProfile {
  id: string;
  user_id: string;
  email?: string;
  gender: Gender;
  gender_preference: Gender[];
  fname?: string;
  lname?: string;
  areas_of_study?: string[];
  ethnicity?: Ethnicity;
  images?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface MatchingUser {
  id: string;
  user_id: string;
  email: string;
  gender: Gender;
  gender_preference: Gender[];
  fname?: string;
  lname?: string;
  areas_of_study?: string[];
  ethnicity?: Ethnicity;
  images?: string[];
}

