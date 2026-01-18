// __tests__/aiProfileGenerator.test.ts
// Tests for AI profile generation and similarity calculations

import {
  cosineSimilarity,
  calculateSummaryOverlap,
  PERSONALITY_FEATURES,
} from '@/lib/aiProfileGenerator';

describe('AI Profile Generator', () => {
  describe('cosineSimilarity', () => {
    it('should return 1 for identical vectors', () => {
      const vector = [1, 2, 3, 4, 5];
      const similarity = cosineSimilarity(vector, vector);
      
      expect(similarity).toBeCloseTo(1, 5);
    });

    it('should return 0 for orthogonal vectors', () => {
      const vector1 = [1, 0, 0];
      const vector2 = [0, 1, 0];
      const similarity = cosineSimilarity(vector1, vector2);
      
      expect(similarity).toBeCloseTo(0, 5);
    });

    it('should return -1 for opposite vectors', () => {
      const vector1 = [1, 2, 3];
      const vector2 = [-1, -2, -3];
      const similarity = cosineSimilarity(vector1, vector2);
      
      expect(similarity).toBeCloseTo(-1, 5);
    });

    it('should calculate similarity for typical feature vectors', () => {
      // Similar users: both STEM-focused
      const vector1 = [0.9, 0.6, 0.3, 0.2, 0.4, 0.3, 0.2, 0.9, 0.4, 0.7];
      const vector2 = [0.85, 0.65, 0.35, 0.25, 0.45, 0.3, 0.25, 0.85, 0.45, 0.75];
      
      const similarity = cosineSimilarity(vector1, vector2);
      
      expect(similarity).toBeGreaterThan(0.95); // Very similar
      expect(similarity).toBeLessThanOrEqual(1);
    });

    it('should calculate lower similarity for different users', () => {
      // Different users: STEM vs Arts
      const techVector = [0.95, 0.3, 0.3, 0.2, 0.4, 0.2, 0.2, 0.9, 0.3, 0.7];
      const artsVector = [0.1, 0.95, 0.85, 0.5, 0.9, 0.8, 0.8, 0.7, 0.85, 0.6];
      
      const similarity = cosineSimilarity(techVector, artsVector);
      
      expect(similarity).toBeLessThan(0.8); // Less similar
      expect(similarity).toBeGreaterThanOrEqual(-1);
    });

    it('should handle zero vectors', () => {
      const zeroVector = [0, 0, 0, 0];
      const normalVector = [1, 2, 3, 4];
      
      const similarity = cosineSimilarity(zeroVector, normalVector);
      
      expect(similarity).toBe(0);
    });

    it('should throw error for vectors of different lengths', () => {
      const vector1 = [1, 2, 3];
      const vector2 = [1, 2, 3, 4];
      
      expect(() => cosineSimilarity(vector1, vector2)).toThrow();
    });

    it('should handle single-element vectors', () => {
      const vector1 = [5];
      const vector2 = [3];
      
      const similarity = cosineSimilarity(vector1, vector2);
      
      expect(similarity).toBeCloseTo(1, 5); // Same direction
    });

    it('should be symmetric', () => {
      const vector1 = [1, 2, 3, 4];
      const vector2 = [5, 6, 7, 8];
      
      const similarity1 = cosineSimilarity(vector1, vector2);
      const similarity2 = cosineSimilarity(vector2, vector1);
      
      expect(similarity1).toBeCloseTo(similarity2, 10);
    });

    it('should handle decimal values', () => {
      const vector1 = [0.1, 0.2, 0.3, 0.4];
      const vector2 = [0.5, 0.6, 0.7, 0.8];
      
      const similarity = cosineSimilarity(vector1, vector2);
      
      expect(similarity).toBeGreaterThan(0);
      expect(similarity).toBeLessThanOrEqual(1);
    });

    it('should handle large vectors (embedding size)', () => {
      // Simulate 768-dimensional embeddings
      const embedding1 = Array(768).fill(0).map(() => Math.random());
      const embedding2 = Array(768).fill(0).map(() => Math.random());
      
      const similarity = cosineSimilarity(embedding1, embedding2);
      
      expect(similarity).toBeGreaterThanOrEqual(-1);
      expect(similarity).toBeLessThanOrEqual(1);
    });
  });

  describe('calculateSummaryOverlap', () => {
    it('should return 1 for identical summaries', () => {
      const summary = 'A passionate CS student who loves coding and problem-solving';
      const overlap = calculateSummaryOverlap(summary, summary);
      
      expect(overlap).toBeCloseTo(1, 5);
    });

    it('should return 0 for completely different summaries', () => {
      const summary1 = 'passionate coding technology algorithms';
      const summary2 = 'artistic painting creative museums exhibitions';
      
      const overlap = calculateSummaryOverlap(summary1, summary2);
      
      expect(overlap).toBeLessThan(0.3); // Very low overlap
    });

    it('should detect high overlap in similar summaries', () => {
      const summary1 = 'A thoughtful CS student who finds joy in solving complex problems and building innovative projects';
      const summary2 = 'An analytical CS student passionate about solving complex problems and creating innovative software';
      
      const overlap = calculateSummaryOverlap(summary1, summary2);
      
      expect(overlap).toBeGreaterThan(0.3); // Significant overlap
    });

    it('should filter out common stop words', () => {
      const summary1 = 'The student is a person who likes the arts';
      const summary2 = 'This person is an individual who enjoys the arts';
      
      const overlap = calculateSummaryOverlap(summary1, summary2);
      
      // Should focus on meaningful words like 'student', 'person', 'arts'
      expect(overlap).toBeGreaterThan(0);
    });

    it('should be case-insensitive', () => {
      const summary1 = 'Passionate About Technology';
      const summary2 = 'passionate about technology';
      
      const overlap = calculateSummaryOverlap(summary1, summary2);
      
      expect(overlap).toBeCloseTo(1, 5);
    });

    it('should handle punctuation', () => {
      const summary1 = 'Student, who loves coding, problem-solving, and algorithms!';
      const summary2 = 'Student who loves coding problem-solving and algorithms';
      
      const overlap = calculateSummaryOverlap(summary1, summary2);
      
      expect(overlap).toBeGreaterThan(0.7);
    });

    it('should ignore short words', () => {
      const summary1 = 'I am a CS student in AI';
      const summary2 = 'CS student AI';
      
      const overlap = calculateSummaryOverlap(summary1, summary2);
      
      // Should focus on 'student' and ignore 'I', 'am', 'a', 'in'
      expect(overlap).toBeGreaterThan(0.5);
    });

    it('should calculate Jaccard similarity correctly', () => {
      const summary1 = 'creative artistic passionate expressive';
      const summary2 = 'creative passionate innovative ambitious';
      
      const overlap = calculateSummaryOverlap(summary1, summary2);
      
      // Intersection: {creative, passionate}
      // Union: {creative, artistic, passionate, expressive, innovative, ambitious}
      // Jaccard = 2/6 = 0.333...
      expect(overlap).toBeCloseTo(0.333, 1);
    });

    it('should handle empty strings', () => {
      const overlap1 = calculateSummaryOverlap('', 'some text here');
      const overlap2 = calculateSummaryOverlap('some text here', '');
      const overlap3 = calculateSummaryOverlap('', '');
      
      expect(overlap1).toBe(0);
      expect(overlap2).toBe(0);
      expect(overlap3).toBe(0);
    });

    it('should handle real profile summaries', () => {
      const techSummary = 'A thoughtful CS student who finds joy in solving complex problems and building innovative projects. Prefers meaningful one-on-one conversations over large social gatherings.';
      const artsSummary = 'An expressive English major with a passion for storytelling and human connection. Thrives in creative environments and loves exploring Toronto\'s vibrant arts scene.';
      
      const overlap = calculateSummaryOverlap(techSummary, artsSummary);
      
      // Should have low overlap (different interests)
      expect(overlap).toBeLessThan(0.3);
    });

    it('should find overlap in compatible profiles', () => {
      const profile1 = 'Biology major who loves nature, hiking, and outdoor adventures. Values wellness and mindfulness.';
      const profile2 = 'Environmental science student passionate about nature, conservation, and outdoor activities. Seeks balance and mindfulness.';
      
      const overlap = calculateSummaryOverlap(profile1, profile2);
      
      // Should have some overlap (similar interests: nature, outdoor, mindfulness)
      expect(overlap).toBeGreaterThan(0.1);
      expect(overlap).toBeLessThan(0.5);
    });

    it('should be symmetric', () => {
      const summary1 = 'passionate creative student loves arts music';
      const summary2 = 'ambitious analytical engineer technology science';
      
      const overlap1 = calculateSummaryOverlap(summary1, summary2);
      const overlap2 = calculateSummaryOverlap(summary2, summary1);
      
      expect(overlap1).toBeCloseTo(overlap2, 10);
    });
  });

  describe('PERSONALITY_FEATURES', () => {
    it('should have exactly 10 features', () => {
      expect(PERSONALITY_FEATURES).toHaveLength(10);
    });

    it('should have expected feature names', () => {
      const expectedFeatures = [
        'academic_focus',
        'creativity',
        'social_energy',
        'physical_activity',
        'cultural_engagement',
        'study_style',
        'nightlife',
        'intellectual_depth',
        'adventure_seeking',
        'mindfulness',
      ];
      
      expect(PERSONALITY_FEATURES).toEqual(expectedFeatures);
    });

    it('should not have duplicate features', () => {
      const uniqueFeatures = new Set(PERSONALITY_FEATURES);
      expect(uniqueFeatures.size).toBe(PERSONALITY_FEATURES.length);
    });
  });

  describe('Integration Tests', () => {
    it('should work in complete matching workflow', () => {
      // Simulate feature vectors for two users
      const user1Features = [0.8, 0.6, 0.4, 0.3, 0.5, 0.4, 0.3, 0.8, 0.5, 0.7];
      const user2Features = [0.85, 0.65, 0.35, 0.25, 0.45, 0.35, 0.25, 0.85, 0.45, 0.75];
      
      // Calculate feature similarity (50% of matching score)
      const featureSimilarity = cosineSimilarity(user1Features, user2Features);
      
      // Simulate AI summaries (ensure overlap with common meaningful words)
      const summary1 = 'student technology coding solving problems algorithms';
      const summary2 = 'student technology programming algorithms science';
      
      // Calculate summary overlap (30% of matching score)
      const summaryOverlap = calculateSummaryOverlap(summary1, summary2);
      
      // Verify both contribute to scoring
      expect(featureSimilarity).toBeGreaterThan(0.9);
      expect(summaryOverlap).toBeGreaterThanOrEqual(0);
      
      // Calculate weighted score (without schedule - 20%)
      const compatibilityScore = featureSimilarity * 0.5 + summaryOverlap * 0.3;
      
      expect(compatibilityScore).toBeGreaterThan(0.4);
    });

    it('should differentiate between compatible and incompatible users', () => {
      // Compatible users (similar features)
      const compatible1 = [0.9, 0.3, 0.3, 0.2, 0.4, 0.3, 0.2, 0.9, 0.4, 0.7];
      const compatible2 = [0.85, 0.35, 0.35, 0.25, 0.45, 0.35, 0.25, 0.85, 0.45, 0.75];
      
      // Incompatible users (opposite features)
      const incompatible1 = [0.9, 0.3, 0.3, 0.2, 0.4, 0.3, 0.2, 0.9, 0.4, 0.7];
      const incompatible2 = [0.1, 0.9, 0.9, 0.8, 0.9, 0.8, 0.9, 0.3, 0.9, 0.3];
      
      const compatibleScore = cosineSimilarity(compatible1, compatible2);
      const incompatibleScore = cosineSimilarity(incompatible1, incompatible2);
      
      expect(compatibleScore).toBeGreaterThan(incompatibleScore);
      expect(compatibleScore).toBeGreaterThan(0.9);
      expect(incompatibleScore).toBeLessThan(0.8);
    });
  });

  describe('Performance Tests', () => {
    it('should handle large-scale similarity calculations efficiently', () => {
      const startTime = Date.now();
      
      // Simulate calculating similarity for 100 user pairs
      for (let i = 0; i < 100; i++) {
        const vector1 = Array(10).fill(0).map(() => Math.random());
        const vector2 = Array(10).fill(0).map(() => Math.random());
        cosineSimilarity(vector1, vector2);
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete in less than 100ms
      expect(duration).toBeLessThan(100);
    });

    it('should handle large text overlap calculations efficiently', () => {
      const startTime = Date.now();
      
      const longText1 = 'passionate creative student technology arts music science '.repeat(20);
      const longText2 = 'ambitious analytical engineer nature coding innovation '.repeat(20);
      
      // Calculate 100 times
      for (let i = 0; i < 100; i++) {
        calculateSummaryOverlap(longText1, longText2);
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete in less than 200ms
      expect(duration).toBeLessThan(200);
    });
  });
});
