# Testing Documentation

## Overview

This testing suite validates the UofTwo matching algorithm and PDF parsing functionality. The tests ensure that the core features work correctly and provide expected results.

## Test Structure

### 1. Unit Tests (Jest)

- **PDF Parser Tests** ([\_\_tests\_\_/pdfParser.test.ts](\_\_tests\_\_/pdfParser.test.ts))
  - Course code extraction
  - Building code parsing
  - Time information extraction
  - Edge cases and error handling

- **Matching Algorithm Tests** ([\_\_tests\_\_/matchingAlgorithm.test.ts](\_\_tests\_\_/matchingAlgorithm.test.ts))
  - Compatibility score calculations
  - Feature similarity comparisons
  - Schedule compatibility analysis
  - Real-world matching scenarios

- **AI Profile Generator Tests** ([\_\_tests\_\_/aiProfileGenerator.test.ts](\_\_tests\_\_/aiProfileGenerator.test.ts))
  - Cosine similarity calculations
  - Summary overlap detection
  - Personality feature extraction

### 2. Integration Tests

- **Matching Test Script** ([scripts/testMatching.ts](scripts/testMatching.ts))
  - End-to-end matching workflow
  - Compatibility matrix generation
  - Feature comparisons across user archetypes

- **PDF Parsing Test Script** ([scripts/testPdfParsing.ts](scripts/testPdfParsing.ts))
  - Schedule parsing validation
  - Building proximity analysis
  - Time slot extraction

## Running Tests

### Run all unit tests:
```bash
npm test
```

### Run tests in watch mode:
```bash
npm run test:watch
```

### Generate coverage report:
```bash
npm run test:coverage
```

### Run matching algorithm integration test:
```bash
npm run test:matching
```

### Run PDF parsing integration test:
```bash
npm run test:pdf
```

## Test Data

Mock data is defined in [\_\_tests\_\_/testData.ts](\_\_tests\_\_/testData.ts) and includes:

- **4 User Archetypes:**
  - `techie` - Computer Science student (STEM-focused, introverted)
  - `creative` - Arts student (creative, extroverted)
  - `businessMinded` - Commerce student (social, ambitious)
  - `scienceOutdoorsy` - Biology student (balanced, outdoorsy)

- **Sample Schedules:** Course schedules for each archetype
- **AI Profiles:** Mock AI-generated personality profiles
- **PDF Text:** Sample ACORN schedule format

## Key Metrics Tested

### 1. Compatibility Scoring
- **Formula:** 50% Feature Similarity + 30% AI Summary + 20% Schedule Overlap
- **Expected Ranges:**
  - High compatibility (same archetype): >70%
  - Moderate compatibility: 40-70%
  - Low compatibility: <40%

### 2. Feature Similarity
- Uses cosine similarity on 10 personality features
- Scale: -1 to 1 (typically 0-1 for personality vectors)
- Similar users should score >0.9

### 3. Schedule Compatibility
- Combines free time overlap and building proximity
- Scale: 0-1
- Same campus clusters score higher

### 4. AI Summary Overlap
- Jaccard similarity on meaningful words
- Filters stop words and short words (<4 chars)
- Scale: 0-1

## Expected Test Results

### PDF Parser
- ✅ Correctly extracts course codes (CSC369H1, etc.)
- ✅ Parses building codes (BA, MP, SS, etc.)
- ✅ Extracts time information (MO 10:00AM-12:00PM)
- ✅ Handles edge cases (empty PDF, missing rooms)
- ✅ Removes duplicate courses

### Matching Algorithm
- ✅ Same archetype pairs score >70%
- ✅ Different archetype pairs score <70%
- ✅ Scores are symmetric (A-B = B-A)
- ✅ All scores are 0-100
- ✅ Schedule data influences score appropriately

### AI Profile Generator
- ✅ Cosine similarity = 1 for identical vectors
- ✅ Cosine similarity ≈ 0 for orthogonal vectors
- ✅ Summary overlap detects common interests
- ✅ Stop words are filtered correctly
- ✅ Case-insensitive comparison

## Debugging Tests

### View detailed test output:
```bash
npm test -- --verbose
```

### Run specific test file:
```bash
npm test pdfParser.test.ts
npm test matchingAlgorithm.test.ts
npm test aiProfileGenerator.test.ts
```

### Run specific test case:
```bash
npm test -- -t "should calculate compatibility between similar users"
```

## Coverage Goals

Target coverage (run `npm run test:coverage`):
- **Statements:** >80%
- **Branches:** >75%
- **Functions:** >80%
- **Lines:** >80%

## Troubleshooting

### Common Issues

1. **Module not found errors:**
   - Run `npm install` to ensure all dependencies are installed
   - Check that `@/` path alias is configured in jest.config.js

2. **PDF parser tests failing:**
   - Verify pdf-parse is mocked correctly
   - Check that mock data matches expected format

3. **Floating point precision issues:**
   - Use `toBeCloseTo()` matcher instead of `toBe()` for decimals
   - Example: `expect(score).toBeCloseTo(0.95, 2)`

4. **TypeScript errors:**
   - Run `npm run db:generate` to regenerate Prisma types
   - Ensure tsconfig.json includes test files

## Adding New Tests

1. Create test file in `__tests__/` directory
2. Import functions to test and mock data
3. Structure tests with `describe()` blocks
4. Use descriptive test names with `it()` or `test()`
5. Follow AAA pattern: Arrange, Act, Assert

Example:
```typescript
describe('MyFunction', () => {
  it('should return expected result for valid input', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = myFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

## Performance Benchmarks

Integration tests include performance checks:
- 100 similarity calculations should complete in <100ms
- 100 text overlap calculations should complete in <200ms

## Next Steps

To further improve testing:
1. Add tests for API endpoints
2. Add database integration tests
3. Add E2E tests with Playwright/Cypress
4. Set up CI/CD pipeline with automated testing
5. Add mutation testing to verify test quality
