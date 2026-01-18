// __tests__/testData.ts
// Mock data for testing matching algorithm and PDF parsing

import { QuestionnaireData, ParsedCourse, AIGeneratedProfile } from '@/types';
import { UserPreferences, ScheduleData, TimeSlot } from '@/lib/matchingAlgorithm';

/**
 * Sample questionnaire data for different user archetypes
 */
export const mockQuestionnaires: Record<string, QuestionnaireData> = {
  // Computer Science student - STEM focused, introverted
  techie: {
    hobbies: ['coding', 'gaming', 'reading sci-fi', 'hackathons'],
    favoriteBands: ['Daft Punk', 'Radiohead', 'Aphex Twin'],
    musicGenres: ['electronic', 'indie', 'alternative'],
    sportsTeams: [],
    footballPreference: 'Not interested',
    clubs: ['UofT Hacks', 'Computer Science Student Union', 'Robotics Club'],
    studyPreference: 'Solo with occasional group sessions',
    favCampusSpots: ['Bahen Centre', 'Robarts Library', 'Gerstein Library'],
    personalityTraits: ['analytical', 'introverted', 'curious', 'detail-oriented'],
    values: ['honesty', 'intelligence', 'ambition', 'creativity'],
    goingOutFrequency: 'Rarely',
    idealWeekend: 'Working on personal projects, watching movies, exploring new tech',
    aboutMe: 'CS major who loves building things and solving complex problems',
    lookingFor: 'Someone who appreciates deep conversations and shares curiosity about technology',
    dealBreakers: ['dishonesty', 'lack of ambition', 'close-mindedness'],
  },

  // Arts student - creative, extroverted
  creative: {
    hobbies: ['painting', 'photography', 'writing poetry', 'going to concerts'],
    favoriteBands: ['Taylor Swift', 'The 1975', 'Arctic Monkeys', 'Lorde'],
    musicGenres: ['pop', 'indie', 'alternative', 'folk'],
    sportsTeams: [],
    footballPreference: 'Not really into sports',
    clubs: ['Hart House Art Committee', 'UofT Poetry Club', 'Film Society'],
    studyPreference: 'Coffee shops with friends',
    favCampusSpots: ['Hart House', 'Victoria College', 'Art Museum'],
    personalityTraits: ['creative', 'empathetic', 'outgoing', 'spontaneous'],
    values: ['authenticity', 'compassion', 'self-expression', 'adventure'],
    goingOutFrequency: 'Often (2-3 times per week)',
    idealWeekend: 'Visiting art galleries, brunch with friends, exploring new neighborhoods',
    aboutMe: 'English major with a passion for storytelling and connecting with people',
    lookingFor: 'Someone creative and open-minded who loves exploring the city',
    dealBreakers: ['judgmental attitudes', 'lack of empathy', 'boring conversations'],
  },

  // Business student - social, ambitious
  businessMinded: {
    hobbies: ['networking', 'gym', 'traveling', 'reading business books'],
    favoriteBands: ['Drake', 'The Weeknd', 'Travis Scott'],
    musicGenres: ['hip-hop', 'R&B', 'pop'],
    sportsTeams: ['Toronto Raptors', 'Toronto Maple Leafs'],
    footballPreference: 'NFL > CFL',
    clubs: ['Rotman Commerce Association', 'Case Competition Team', 'Finance Club'],
    studyPreference: 'Study groups and team projects',
    favCampusSpots: ['Rotman Building', 'Athletic Centre', 'Campus restaurants'],
    personalityTraits: ['ambitious', 'confident', 'social', 'competitive'],
    values: ['success', 'loyalty', 'growth', 'family'],
    goingOutFrequency: 'Very often (3+ times per week)',
    idealWeekend: 'Trying new restaurants, parties, working out, networking events',
    aboutMe: 'Commerce student focused on building my career and making lasting connections',
    lookingFor: 'Someone ambitious who enjoys social activities and has big goals',
    dealBreakers: ['laziness', 'negativity', 'lack of drive'],
  },

  // Science student - balanced, outdoorsy
  scienceOutdoorsy: {
    hobbies: ['hiking', 'rock climbing', 'birdwatching', 'yoga'],
    favoriteBands: ['Bon Iver', 'Fleet Foxes', 'Sufjan Stevens'],
    musicGenres: ['folk', 'indie', 'acoustic'],
    sportsTeams: [],
    footballPreference: 'Casual viewer',
    clubs: ['Environmental Science Society', 'Hiking Club', 'Yoga Society'],
    studyPreference: 'Flexible - depends on the topic',
    favCampusSpots: ['Earth Sciences Centre', 'Trinity College', 'Queens Park'],
    personalityTraits: ['curious', 'balanced', 'calm', 'adventurous'],
    values: ['sustainability', 'health', 'mindfulness', 'authenticity'],
    goingOutFrequency: 'Sometimes (once a week)',
    idealWeekend: 'Morning hike, afternoon reading in the park, dinner with close friends',
    aboutMe: 'Biology major who loves nature and finding balance in life',
    lookingFor: 'Someone who appreciates the outdoors and values wellness',
    dealBreakers: ['wastefulness', 'close-mindedness', 'constant negativity'],
  },
};

/**
 * Sample parsed courses for different programs
 */
export const mockSchedules: Record<string, ParsedCourse[]> = {
  techie: [
    { courseCode: 'CSC369H1', courseName: 'Operating Systems', building: 'BA', time: 'MO 10:00AM-12:00PM' },
    { courseCode: 'CSC373H1', courseName: 'Algorithm Design', building: 'BA', time: 'WE 2:00PM-4:00PM' },
    { courseCode: 'CSC384H1', courseName: 'Artificial Intelligence', building: 'BA', time: 'TH 10:00AM-12:00PM' },
    { courseCode: 'MAT237Y1', courseName: 'Multivariable Calculus', building: 'MP', time: 'TU 12:00PM-1:00PM' },
  ],

  creative: [
    { courseCode: 'ENG320H1', courseName: 'Contemporary Literature', building: 'UC', time: 'MO 10:00AM-12:00PM' },
    { courseCode: 'ENG250H1', courseName: 'Creative Writing', building: 'UC', time: 'WE 2:00PM-4:00PM' },
    { courseCode: 'HIS280H1', courseName: 'Art History', building: 'SS', time: 'TH 10:00AM-12:00PM' },
    { courseCode: 'PHI220H1', courseName: 'Philosophy of Art', building: 'SS', time: 'TU 2:00PM-4:00PM' },
  ],

  businessMinded: [
    { courseCode: 'RSM332H1', courseName: 'Marketing', building: 'RC', time: 'MO 2:00PM-4:00PM' },
    { courseCode: 'RSM340H1', courseName: 'Finance', building: 'RC', time: 'WE 10:00AM-12:00PM' },
    { courseCode: 'RSM430H1', courseName: 'Strategy', building: 'RC', time: 'TH 2:00PM-4:00PM' },
    { courseCode: 'ECO204Y1', courseName: 'Macroeconomics', building: 'SS', time: 'TU 10:00AM-11:00AM' },
  ],

  scienceOutdoorsy: [
    { courseCode: 'BIO230H1', courseName: 'Ecology', building: 'RW', time: 'MO 10:00AM-12:00PM' },
    { courseCode: 'BIO270H1', courseName: 'Conservation Biology', building: 'RW', time: 'WE 2:00PM-4:00PM' },
    { courseCode: 'ENV200H1', courseName: 'Environmental Science', building: 'ES', time: 'TH 10:00AM-12:00PM' },
    { courseCode: 'GGR220H1', courseName: 'Geography', building: 'ES', time: 'TU 2:00PM-4:00PM' },
  ],
};

/**
 * Mock AI-generated profiles
 */
export const mockAIProfiles: Record<string, AIGeneratedProfile> = {
  techie: {
    features: [
      { name: 'academic_focus', score: 0.95 }, // Strong STEM
      { name: 'creativity', score: 0.6 },
      { name: 'social_energy', score: 0.3 }, // Introverted
      { name: 'physical_activity', score: 0.2 },
      { name: 'cultural_engagement', score: 0.4 },
      { name: 'study_style', score: 0.3 }, // Prefers solo
      { name: 'nightlife', score: 0.2 }, // Rarely goes out
      { name: 'intellectual_depth', score: 0.9 }, // Loves deep discussions
      { name: 'adventure_seeking', score: 0.4 },
      { name: 'mindfulness', score: 0.7 }, // Calm and focused
    ],
    summary: 'A thoughtful CS student who finds joy in solving complex problems and building innovative projects. Prefers meaningful one-on-one conversations over large social gatherings.',
    personalityInsights: [
      'Passionate about technology and its potential to change the world',
      'Enjoys deep dives into sci-fi literature and philosophical discussions',
      'Values intellectual curiosity and continuous learning',
      'Appreciates quiet evenings working on personal projects',
    ],
    strengthsAsPartner: [
      'Great listener who values deep conversations',
      'Loyal and thoughtful in relationships',
      'Brings analytical thinking to problem-solving',
    ],
    idealMatchDescription: 'Someone who appreciates quiet quality time, shares intellectual curiosity, and understands the passion for building and creating.',
    conversationStarters: [
      'What\'s the most interesting project you\'ve worked on recently?',
      'Do you have a favorite sci-fi book or movie?',
      'What technology do you think will change the world in the next 10 years?',
      'What\'s your ideal way to spend a Saturday night?',
      'If you could learn any skill instantly, what would it be?',
    ],
  },

  creative: {
    features: [
      { name: 'academic_focus', score: 0.1 }, // Strong Arts
      { name: 'creativity', score: 0.95 },
      { name: 'social_energy', score: 0.85 }, // Extroverted
      { name: 'physical_activity', score: 0.5 },
      { name: 'cultural_engagement', score: 0.9 },
      { name: 'study_style', score: 0.8 }, // Collaborative
      { name: 'nightlife', score: 0.8 }, // Loves going out
      { name: 'intellectual_depth', score: 0.7 },
      { name: 'adventure_seeking', score: 0.85 },
      { name: 'mindfulness', score: 0.6 },
    ],
    summary: 'An expressive English major with a passion for storytelling and human connection. Thrives in creative environments and loves exploring Toronto\'s vibrant arts scene.',
    personalityInsights: [
      'Finds beauty in everyday moments through photography and writing',
      'Energized by meaningful conversations and new experiences',
      'Values authenticity and emotional intelligence',
      'Always seeking inspiration in art galleries, concerts, and bookstores',
    ],
    strengthsAsPartner: [
      'Empathetic and emotionally available',
      'Brings spontaneity and adventure to relationships',
      'Excellent communicator who values openness',
    ],
    idealMatchDescription: 'Someone creative and open-hearted who loves exploring the city, appreciates the arts, and isn\'t afraid to be vulnerable.',
    conversationStarters: [
      'What\'s the last book that made you feel something deeply?',
      'Do you have a favorite spot in Toronto for inspiration?',
      'What form of art speaks to you the most?',
      'What\'s your go-to Sunday activity?',
      'If you could have coffee with any author, who would it be?',
    ],
  },

  businessMinded: {
    features: [
      { name: 'academic_focus', score: 0.5 }, // Balanced business/practical
      { name: 'creativity', score: 0.5 },
      { name: 'social_energy', score: 0.9 }, // Very extroverted
      { name: 'physical_activity', score: 0.7 },
      { name: 'cultural_engagement', score: 0.6 },
      { name: 'study_style', score: 0.9 }, // Collaborative
      { name: 'nightlife', score: 0.9 }, // Very social
      { name: 'intellectual_depth', score: 0.6 },
      { name: 'adventure_seeking', score: 0.7 },
      { name: 'mindfulness', score: 0.4 }, // High-energy
    ],
    summary: 'An ambitious Commerce student focused on building a successful career and making lasting connections. Thrives in social settings and competitive environments.',
    personalityInsights: [
      'Driven by goals and passionate about entrepreneurship',
      'Natural networker who builds strong professional relationships',
      'Enjoys staying active through fitness and sports',
      'Values loyalty and believes in working hard and playing hard',
    ],
    strengthsAsPartner: [
      'Motivating and supportive of partner\'s ambitions',
      'Brings energy and excitement to relationships',
      'Great at planning activities and social events',
    ],
    idealMatchDescription: 'Someone ambitious and social who enjoys an active lifestyle and shares big goals for the future.',
    conversationStarters: [
      'What are your career goals for the next 5 years?',
      'Do you have a favorite restaurant or spot in Toronto?',
      'What sports or activities do you enjoy?',
      'If you could start any business, what would it be?',
      'What\'s your ideal Friday night?',
    ],
  },

  scienceOutdoorsy: {
    features: [
      { name: 'academic_focus', score: 0.7 }, // STEM-leaning
      { name: 'creativity', score: 0.6 },
      { name: 'social_energy', score: 0.5 }, // Balanced
      { name: 'physical_activity', score: 0.9 }, // Very active
      { name: 'cultural_engagement', score: 0.7 },
      { name: 'study_style', score: 0.5 }, // Flexible
      { name: 'nightlife', score: 0.4 }, // Occasional
      { name: 'intellectual_depth', score: 0.8 },
      { name: 'adventure_seeking', score: 0.95 }, // Very adventurous
      { name: 'mindfulness', score: 0.9 }, // Very calm/zen
    ],
    summary: 'A balanced Biology major who loves nature and finding harmony between academic pursuits and outdoor adventures. Values wellness and environmental consciousness.',
    personalityInsights: [
      'Passionate about conservation and sustainability',
      'Finds peace in nature through hiking and outdoor activities',
      'Values mindfulness and maintaining work-life balance',
      'Curious about the natural world and its complexities',
    ],
    strengthsAsPartner: [
      'Brings calm and balanced perspective to relationships',
      'Encourages healthy lifestyle and outdoor activities',
      'Thoughtful and environmentally conscious',
    ],
    idealMatchDescription: 'Someone who appreciates nature, values wellness, and enjoys exploring the outdoors while maintaining intellectual curiosity.',
    conversationStarters: [
      'What\'s your favorite outdoor spot around Toronto?',
      'Do you have any sustainability practices you\'re passionate about?',
      'What\'s the best hike you\'ve ever done?',
      'How do you like to unwind after a busy week?',
      'What natural phenomenon fascinates you the most?',
    ],
  },
};

/**
 * Mock schedule data with time slots
 */
export const mockScheduleData: Record<string, ScheduleData> = {
  techie: {
    buildings: ['BA', 'MP', 'GB'],
    timeSlots: [
      { day: 'Monday', startTime: '10:00 AM', endTime: '12:00 PM', building: 'BA', courseCode: 'CSC369H1' },
      { day: 'Tuesday', startTime: '12:00 PM', endTime: '1:00 PM', building: 'MP', courseCode: 'MAT237Y1' },
      { day: 'Wednesday', startTime: '2:00 PM', endTime: '4:00 PM', building: 'BA', courseCode: 'CSC373H1' },
      { day: 'Thursday', startTime: '10:00 AM', endTime: '12:00 PM', building: 'BA', courseCode: 'CSC384H1' },
    ],
    courses: mockSchedules.techie,
  },

  creative: {
    buildings: ['UC', 'SS', 'VC'],
    timeSlots: [
      { day: 'Monday', startTime: '10:00 AM', endTime: '12:00 PM', building: 'UC', courseCode: 'ENG320H1' },
      { day: 'Tuesday', startTime: '2:00 PM', endTime: '4:00 PM', building: 'SS', courseCode: 'PHI220H1' },
      { day: 'Wednesday', startTime: '2:00 PM', endTime: '4:00 PM', building: 'UC', courseCode: 'ENG250H1' },
      { day: 'Thursday', startTime: '10:00 AM', endTime: '12:00 PM', building: 'SS', courseCode: 'HIS280H1' },
    ],
    courses: mockSchedules.creative,
  },

  businessMinded: {
    buildings: ['RC', 'SS'],
    timeSlots: [
      { day: 'Monday', startTime: '2:00 PM', endTime: '4:00 PM', building: 'RC', courseCode: 'RSM332H1' },
      { day: 'Tuesday', startTime: '10:00 AM', endTime: '11:00 AM', building: 'SS', courseCode: 'ECO204Y1' },
      { day: 'Wednesday', startTime: '10:00 AM', endTime: '12:00 PM', building: 'RC', courseCode: 'RSM340H1' },
      { day: 'Thursday', startTime: '2:00 PM', endTime: '4:00 PM', building: 'RC', courseCode: 'RSM430H1' },
    ],
    courses: mockSchedules.businessMinded,
  },

  scienceOutdoorsy: {
    buildings: ['RW', 'ES', 'MP'],
    timeSlots: [
      { day: 'Monday', startTime: '10:00 AM', endTime: '12:00 PM', building: 'RW', courseCode: 'BIO230H1' },
      { day: 'Tuesday', startTime: '2:00 PM', endTime: '4:00 PM', building: 'ES', courseCode: 'GGR220H1' },
      { day: 'Wednesday', startTime: '2:00 PM', endTime: '4:00 PM', building: 'RW', courseCode: 'BIO270H1' },
      { day: 'Thursday', startTime: '10:00 AM', endTime: '12:00 PM', building: 'ES', courseCode: 'ENV200H1' },
    ],
    courses: mockSchedules.scienceOutdoorsy,
  },
};

/**
 * Build complete UserPreferences for testing
 */
export function buildUserPreferences(archetype: string): UserPreferences {
  const profile = mockAIProfiles[archetype];
  if (!profile) throw new Error(`Unknown archetype: ${archetype}`);

  const questionnaireScores: Record<string, number> = {};
  profile.features.forEach(f => {
    questionnaireScores[f.name] = f.score;
  });

  return {
    questionnaireFeatureScores: questionnaireScores,
    implicitFeatureScores: {}, // Empty for initial tests
    implicitConfidenceScore: 0,
    scheduleData: mockScheduleData[archetype],
    aiSummary: profile.summary,
  };
}

/**
 * Sample PDF text content (mimicking ACORN format)
 */
export const mockPDFText = `
UNIVERSITY OF TORONTO
ACORN Student Schedule
Fall/Winter 2024-2025

Student Name: John Doe
Student Number: 1234567890

CSC369H1 F LEC0101 MO 10:00AM-12:00PM BA1170
Introduction to Operating Systems
Instructor: Prof. Smith

CSC373H1 F LEC0101 WE 2:00PM-4:00PM BA1180
Algorithm Design and Analysis
Instructor: Prof. Johnson

CSC384H1 F LEC0101 TH 10:00AM-12:00PM BA1190
Introduction to Artificial Intelligence
Instructor: Prof. Williams

MAT237Y1 Y LEC0101 TU 12:00PM-1:00PM MP102
Multivariable Calculus
Instructor: Prof. Brown
`;
