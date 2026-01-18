// scripts/testMatching.ts
/**
 * Integration test script for the complete matching workflow
 * 
 * This script demonstrates the end-to-end matching process:
 * 1. Load user profiles with questionnaire data
 * 2. Calculate compatibility scores between users
 * 3. Generate a matching report
 * 
 * Run with: npm run test:matching
 */

import { calculateCompatibilityScore } from '../lib/matchingAlgorithm';
import { cosineSimilarity, calculateSummaryOverlap } from '../lib/aiProfileGenerator';
import { buildUserPreferences, mockQuestionnaires, mockAIProfiles } from '../__tests__/testData';

console.log('🎯 UofTwo Matching Algorithm Test\n');
console.log('=' .repeat(60));

// Test archetypes
const archetypes = ['techie', 'creative', 'businessMinded', 'scienceOutdoorsy'];

console.log('\n📊 Testing Compatibility Scores\n');

// Create compatibility matrix
const compatibilityMatrix: Record<string, Record<string, number>> = {};

for (const archetypeA of archetypes) {
  compatibilityMatrix[archetypeA] = {};
  
  for (const archetypeB of archetypes) {
    const userA = buildUserPreferences(archetypeA);
    const userB = buildUserPreferences(archetypeB);
    
    const score = calculateCompatibilityScore(userA, userB);
    compatibilityMatrix[archetypeA][archetypeB] = score;
  }
}

// Display compatibility matrix
console.log('Compatibility Matrix (0-100):');
console.log('-'.repeat(60));

// Header
const header = 'User Type'.padEnd(20) + archetypes.map(a => a.substring(0, 10).padStart(12)).join('');
console.log(header);
console.log('-'.repeat(60));

// Rows
for (const archetypeA of archetypes) {
  const row = archetypeA.padEnd(20) + 
    archetypes.map(archetypeB => {
      const score = compatibilityMatrix[archetypeA][archetypeB];
      return score.toString().padStart(12);
    }).join('');
  console.log(row);
}

console.log('\n');

// Find best matches
console.log('🔍 Best Matches:\n');

for (const archetype of archetypes) {
  const scores = compatibilityMatrix[archetype];
  const sortedMatches = Object.entries(scores)
    .filter(([match]) => match !== archetype) // Exclude self
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
  
  console.log(`${archetype}:`);
  sortedMatches.forEach(([match, score]) => {
    const emoji = score > 60 ? '✅' : score > 40 ? '⚠️' : '❌';
    console.log(`  ${emoji} ${match}: ${score}%`);
  });
  console.log('');
}

// Test feature similarity
console.log('\n🧬 Testing Feature Similarity\n');
console.log('-'.repeat(60));

const techProfile = mockAIProfiles.techie;
const creativeProfile = mockAIProfiles.creative;

const techFeatures = techProfile.features.map(f => f.score);
const creativeFeatures = creativeProfile.features.map(f => f.score);

const featureSimilarity = cosineSimilarity(techFeatures, creativeFeatures);
console.log(`Techie vs Creative feature similarity: ${(featureSimilarity * 100).toFixed(2)}%`);

// Test AI summary overlap
console.log('\n📝 Testing AI Summary Overlap\n');
console.log('-'.repeat(60));

const summaryOverlap = calculateSummaryOverlap(
  techProfile.summary,
  creativeProfile.summary
);
console.log(`Techie vs Creative summary overlap: ${(summaryOverlap * 100).toFixed(2)}%`);

// Detailed breakdown for a sample match
console.log('\n📋 Detailed Match Breakdown (Techie vs Creative)\n');
console.log('-'.repeat(60));

const userTechie = buildUserPreferences('techie');
const userCreative = buildUserPreferences('creative');

// Calculate components
const techFeaturesVector = techProfile.features.map(f => f.score);
const creativeFeaturesVector = creativeProfile.features.map(f => f.score);
const featureScore = cosineSimilarity(techFeaturesVector, creativeFeaturesVector);
const summaryScore = calculateSummaryOverlap(
  userTechie.aiSummary || '',
  userCreative.aiSummary || ''
);

console.log(`Feature Similarity (50% weight):      ${(featureScore * 100).toFixed(2)}%`);
console.log(`AI Summary Overlap (30% weight):      ${(summaryScore * 100).toFixed(2)}%`);
console.log(`Schedule Compatibility (20% weight):  Calculated in full score`);
console.log('');

const finalScore = calculateCompatibilityScore(userTechie, userCreative);
console.log(`Final Compatibility Score:            ${finalScore}%`);

// Feature-by-feature comparison
console.log('\n🎨 Feature-by-Feature Comparison\n');
console.log('-'.repeat(60));
console.log('Feature'.padEnd(25) + 'Techie'.padStart(10) + 'Creative'.padStart(12) + 'Diff'.padStart(10));
console.log('-'.repeat(60));

for (let i = 0; i < techProfile.features.length; i++) {
  const techFeature = techProfile.features[i];
  const creativeFeature = creativeProfile.features[i];
  
  const diff = Math.abs(techFeature.score - creativeFeature.score);
  const diffStr = diff.toFixed(2);
  
  console.log(
    techFeature.name.padEnd(25) +
    techFeature.score.toFixed(2).padStart(10) +
    creativeFeature.score.toFixed(2).padStart(12) +
    diffStr.padStart(10)
  );
}

// Recommendations
console.log('\n💡 Matching Recommendations\n');
console.log('-'.repeat(60));

console.log('High Compatibility (>70%):');
archetypes.forEach(archetype => {
  const highMatches = Object.entries(compatibilityMatrix[archetype])
    .filter(([match, score]) => match !== archetype && score > 70)
    .map(([match, score]) => `${match} (${score}%)`);
  
  if (highMatches.length > 0) {
    console.log(`  ${archetype}: ${highMatches.join(', ')}`);
  }
});

console.log('\nModerate Compatibility (40-70%):');
archetypes.forEach(archetype => {
  const moderateMatches = Object.entries(compatibilityMatrix[archetype])
    .filter(([match, score]) => match !== archetype && score >= 40 && score <= 70)
    .map(([match, score]) => `${match} (${score}%)`);
  
  if (moderateMatches.length > 0) {
    console.log(`  ${archetype}: ${moderateMatches.join(', ')}`);
  }
});

console.log('\nLow Compatibility (<40%):');
archetypes.forEach(archetype => {
  const lowMatches = Object.entries(compatibilityMatrix[archetype])
    .filter(([match, score]) => match !== archetype && score < 40)
    .map(([match, score]) => `${match} (${score}%)`);
  
  if (lowMatches.length > 0) {
    console.log(`  ${archetype}: ${lowMatches.join(', ')}`);
  }
});

// Statistical summary
console.log('\n📈 Statistical Summary\n');
console.log('-'.repeat(60));

const allScores = archetypes.flatMap(a => 
  archetypes
    .filter(b => a !== b)
    .map(b => compatibilityMatrix[a][b])
);

const avgScore = allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
const maxScore = Math.max(...allScores);
const minScore = Math.min(...allScores);

console.log(`Average Compatibility Score: ${avgScore.toFixed(2)}%`);
console.log(`Highest Score: ${maxScore}%`);
console.log(`Lowest Score: ${minScore}%`);
console.log(`Score Range: ${(maxScore - minScore).toFixed(2)}%`);
console.log(`Total Pairs Tested: ${allScores.length}`);

console.log('\n✅ Matching algorithm test complete!\n');
console.log('=' .repeat(60));
