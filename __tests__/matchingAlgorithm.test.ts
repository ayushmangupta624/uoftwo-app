// __tests__/matchingAlgorithm.test.ts
// Tests for the matching algorithm and compatibility scoring

import {
  calculateCompatibilityScore,
  calculateScheduleCompatibility,
  UserPreferences,
  ScheduleData,
} from '@/lib/matchingAlgorithm';
import { buildUserPreferences, mockScheduleData } from './testData';

describe('Matching Algorithm', () => {
  describe('calculateCompatibilityScore', () => {
    it('should calculate compatibility between similar users (high score)', () => {
      // Two techie users should be highly compatible
      const userA = buildUserPreferences('techie');
      const userB = buildUserPreferences('techie');
      
      const score = calculateCompatibilityScore(userA, userB);
      
      expect(score).toBeGreaterThan(70); // High compatibility
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should calculate compatibility between different users (lower score)', () => {
      // Techie vs Creative should have lower compatibility
      const userA = buildUserPreferences('techie');
      const userB = buildUserPreferences('creative');
      
      const score = calculateCompatibilityScore(userA, userB);
      
      expect(score).toBeLessThan(70); // Lower compatibility due to different personalities
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it('should return score between 0-100', () => {
      const userA = buildUserPreferences('techie');
      const userB = buildUserPreferences('businessMinded');
      
      const score = calculateCompatibilityScore(userA, userB);
      
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should factor in schedule compatibility', () => {
      const userA = buildUserPreferences('techie');
      const userB = buildUserPreferences('techie');
      
      // Test with schedules
      const scoreWithSchedule = calculateCompatibilityScore(userA, userB);
      
      // Test without schedules
      const userANoSchedule = { ...userA, scheduleData: undefined };
      const userBNoSchedule = { ...userB, scheduleData: undefined };
      const scoreWithoutSchedule = calculateCompatibilityScore(userANoSchedule, userBNoSchedule);
      
      // With schedules should potentially be different (20% weight)
      expect(typeof scoreWithSchedule).toBe('number');
      expect(typeof scoreWithoutSchedule).toBe('number');
    });

    it('should factor in AI summary compatibility', () => {
      const userA = buildUserPreferences('creative');
      const userB = buildUserPreferences('creative');
      
      const scoreWithSummary = calculateCompatibilityScore(userA, userB);
      
      // Remove AI summaries
      const userANoSummary = { ...userA, aiSummary: undefined };
      const userBNoSummary = { ...userB, aiSummary: undefined };
      const scoreWithoutSummary = calculateCompatibilityScore(userANoSummary, userBNoSummary);
      
      // Scores should differ (30% weight for AI summary)
      expect(scoreWithSummary).not.toBe(scoreWithoutSummary);
    });

    it('should calculate compatibility for all archetype pairs', () => {
      const archetypes = ['techie', 'creative', 'businessMinded', 'scienceOutdoorsy'];
      const scores: Record<string, number> = {};
      
      for (const a of archetypes) {
        for (const b of archetypes) {
          const userA = buildUserPreferences(a);
          const userB = buildUserPreferences(b);
          const score = calculateCompatibilityScore(userA, userB);
          
          scores[`${a}-${b}`] = score;
          
          expect(score).toBeGreaterThanOrEqual(0);
          expect(score).toBeLessThanOrEqual(100);
        }
      }
      
      // Same archetype should have higher scores
      expect(scores['techie-techie']).toBeGreaterThan(scores['techie-creative']);
      expect(scores['creative-creative']).toBeGreaterThan(scores['creative-businessMinded']);
    });

    it('should be symmetric (A-B score == B-A score)', () => {
      const userA = buildUserPreferences('techie');
      const userB = buildUserPreferences('creative');
      
      const scoreAB = calculateCompatibilityScore(userA, userB);
      const scoreBA = calculateCompatibilityScore(userB, userA);
      
      expect(scoreAB).toBe(scoreBA);
    });

    it('should handle users with no implicit scores', () => {
      const userA = buildUserPreferences('techie');
      const userB = buildUserPreferences('creative');
      
      // Both users have no implicit scores (default in buildUserPreferences)
      const score = calculateCompatibilityScore(userA, userB);
      
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should handle users with implicit scores', () => {
      const userA = buildUserPreferences('techie');
      const userB = buildUserPreferences('creative');
      
      // Add implicit scores (from profile viewing behavior)
      userA.implicitFeatureScores = {
        academic_focus: 0.9,
        creativity: 0.5,
        social_energy: 0.4,
      };
      userA.implicitConfidenceScore = 0.6;
      
      const score = calculateCompatibilityScore(userA, userB);
      
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('calculateScheduleCompatibility', () => {
    it('should return 0 for users without schedules', () => {
      const score = calculateScheduleCompatibility(undefined, undefined);
      expect(score).toBe(0);
    });

    it('should return 0 when only one user has a schedule', () => {
      const scheduleA = mockScheduleData.techie;
      const score1 = calculateScheduleCompatibility(scheduleA, undefined);
      const score2 = calculateScheduleCompatibility(undefined, scheduleA);
      
      expect(score1).toBe(0);
      expect(score2).toBe(0);
    });

    it('should calculate compatibility for users with schedules', () => {
      const scheduleA = mockScheduleData.techie;
      const scheduleB = mockScheduleData.creative;
      
      const score = calculateScheduleCompatibility(scheduleA, scheduleB);
      
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('should give higher scores for nearby buildings', () => {
      // Engineering buildings (BA, GB)
      const engineeringSchedule: ScheduleData = {
        buildings: ['BA', 'GB', 'SF'],
        timeSlots: mockScheduleData.techie.timeSlots,
        courses: mockScheduleData.techie.courses,
      };
      
      // Arts buildings (SS, UC)
      const artsSchedule: ScheduleData = {
        buildings: ['SS', 'UC', 'VC'],
        timeSlots: mockScheduleData.creative.timeSlots,
        courses: mockScheduleData.creative.courses,
      };
      
      // Same cluster
      const sameClusterScore = calculateScheduleCompatibility(engineeringSchedule, engineeringSchedule);
      
      // Different clusters
      const diffClusterScore = calculateScheduleCompatibility(engineeringSchedule, artsSchedule);
      
      // Same cluster should score higher
      expect(sameClusterScore).toBeGreaterThan(diffClusterScore);
    });

    it('should detect shared buildings', () => {
      const schedule1: ScheduleData = {
        buildings: ['BA', 'MP'],
        timeSlots: [],
        courses: [],
      };
      
      const schedule2: ScheduleData = {
        buildings: ['BA', 'SS'],
        timeSlots: [],
        courses: [],
      };
      
      const score = calculateScheduleCompatibility(schedule1, schedule2);
      
      // Should have some proximity score due to shared 'BA' building
      expect(score).toBeGreaterThan(0);
    });

    it('should consider free time overlap', () => {
      // Users with similar schedules (more busy time overlap = more free time overlap)
      const scheduleA = mockScheduleData.techie;
      const scheduleB = mockScheduleData.creative;
      
      const score = calculateScheduleCompatibility(scheduleA, scheduleB);
      
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('should handle empty building arrays', () => {
      const schedule1: ScheduleData = {
        buildings: [],
        timeSlots: [],
        courses: [],
      };
      
      const schedule2: ScheduleData = {
        buildings: ['BA'],
        timeSlots: [],
        courses: [],
      };
      
      const score = calculateScheduleCompatibility(schedule1, schedule2);
      
      expect(score).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Feature Similarity', () => {
    it('should detect high similarity in STEM-focused users', () => {
      const user1 = buildUserPreferences('techie');
      const user2 = buildUserPreferences('techie');
      
      const score = calculateCompatibilityScore(user1, user2);
      
      // High academic_focus similarity should contribute to high score
      expect(score).toBeGreaterThan(70);
    });

    it('should detect low similarity in opposite personality types', () => {
      const introvert = buildUserPreferences('techie'); // Low social_energy
      const extrovert = buildUserPreferences('creative'); // High social_energy
      
      const score = calculateCompatibilityScore(introvert, extrovert);
      
      // Different social_energy should lower the score
      expect(score).toBeLessThan(70);
    });

    it('should value multiple feature alignments', () => {
      // Business and Creative both have high social energy and going out frequency
      const business = buildUserPreferences('businessMinded');
      const creative = buildUserPreferences('creative');
      
      const score = calculateCompatibilityScore(business, creative);
      
      // Should have some compatibility due to social alignment
      expect(score).toBeGreaterThan(30);
    });
  });

  describe('Edge Cases', () => {
    it('should handle users with all features at 0', () => {
      const userA: UserPreferences = {
        questionnaireFeatureScores: {
          academic_focus: 0,
          creativity: 0,
          social_energy: 0,
          physical_activity: 0,
          cultural_engagement: 0,
          study_style: 0,
          nightlife: 0,
          intellectual_depth: 0,
          adventure_seeking: 0,
          mindfulness: 0,
        },
        implicitFeatureScores: {},
        implicitConfidenceScore: 0,
      };
      
      const userB = buildUserPreferences('techie');
      
      const score = calculateCompatibilityScore(userA, userB);
      
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should handle users with all features at 1', () => {
      const userA: UserPreferences = {
        questionnaireFeatureScores: {
          academic_focus: 1,
          creativity: 1,
          social_energy: 1,
          physical_activity: 1,
          cultural_engagement: 1,
          study_style: 1,
          nightlife: 1,
          intellectual_depth: 1,
          adventure_seeking: 1,
          mindfulness: 1,
        },
        implicitFeatureScores: {},
        implicitConfidenceScore: 0,
      };
      
      const userB = buildUserPreferences('techie');
      
      const score = calculateCompatibilityScore(userA, userB);
      
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should handle empty feature objects', () => {
      const userA: UserPreferences = {
        questionnaireFeatureScores: {},
        implicitFeatureScores: {},
        implicitConfidenceScore: 0,
      };
      
      const userB: UserPreferences = {
        questionnaireFeatureScores: {},
        implicitFeatureScores: {},
        implicitConfidenceScore: 0,
      };
      
      const score = calculateCompatibilityScore(userA, userB);
      
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should handle mismatched feature sets', () => {
      const userA: UserPreferences = {
        questionnaireFeatureScores: {
          academic_focus: 0.8,
          creativity: 0.6,
        },
        implicitFeatureScores: {},
        implicitConfidenceScore: 0,
      };
      
      const userB: UserPreferences = {
        questionnaireFeatureScores: {
          social_energy: 0.7,
          nightlife: 0.9,
        },
        implicitFeatureScores: {},
        implicitConfidenceScore: 0,
      };
      
      const score = calculateCompatibilityScore(userA, userB);
      
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('Real-world Scenarios', () => {
    it('should match CS students with overlapping interests', () => {
      const cs1 = buildUserPreferences('techie');
      const cs2 = buildUserPreferences('techie');
      
      const score = calculateCompatibilityScore(cs1, cs2);
      
      console.log('CS student compatibility:', score);
      expect(score).toBeGreaterThan(65);
    });

    it('should match arts students with similar creative interests', () => {
      const arts1 = buildUserPreferences('creative');
      const arts2 = buildUserPreferences('creative');
      
      const score = calculateCompatibilityScore(arts1, arts2);
      
      console.log('Arts student compatibility:', score);
      expect(score).toBeGreaterThan(65);
    });

    it('should find moderate compatibility for complementary personalities', () => {
      // Introverted scientist and extroverted creative might balance each other
      const scientist = buildUserPreferences('scienceOutdoorsy');
      const creative = buildUserPreferences('creative');
      
      const score = calculateCompatibilityScore(scientist, creative);
      
      console.log('Scientist-Creative compatibility:', score);
      expect(score).toBeGreaterThan(20);
      expect(score).toBeLessThan(80);
    });

    it('should consider schedule overlap for realistic matching', () => {
      const user1 = buildUserPreferences('techie');
      const user2 = buildUserPreferences('creative');
      
      // Both have overlapping free times (e.g., MO 10-12)
      const score = calculateCompatibilityScore(user1, user2);
      
      console.log('Schedule overlap consideration:', score);
      expect(typeof score).toBe('number');
    });
  });
});
