# Preference Learning & Matching System

This document describes how the uoftwo app implements a two-layer preference system that combines explicit questionnaire responses with implicit preference signals from viewing behavior.

## Overview

The matching system uses a **constant blending ratio**:
- **50%** - Questionnaire/explicit preferences (authoritative)
- **25%** - Viewing behavior/implicit preferences (refined preferences)
- **25%** - Schedule compatibility (reserved for future implementation)

This constant ratio ensures questionnaire responses remain authoritative while gradually incorporating behavioral signals as users view more profiles.

## Architecture

### 1. Data Models (Prisma Schema)

#### ProfileView
Tracks each time a user views another user's profile:
```prisma
model ProfileView {
  id              String @id @default(cuid())
  userId          String                    // User doing the viewing
  viewedProfileId String                    // Profile being viewed
  
  viewStartTime   DateTime                  // When user opened profile
  viewEndTime     DateTime?                 // When user closed profile
  duration        Int?                      // Calculated seconds
  scrollDepth     Float?                    // 0-1 (% of profile viewed)
  
  interacted      Boolean @default(false)   // Did they like/pass/bookmark?
  actionType      String?                   // 'like', 'pass', 'bookmark'
  
  createdAt       DateTime @default(now())
  
  user            User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### UserPreferenceProfile
Stores the calculated implicit preferences for each user:
```prisma
model UserPreferenceProfile {
  id              String @id @default(cuid())
  userId          String @unique
  
  archetypeScores Record<string, number>   // Archetype affinities (0-1)
  buildingScores  Record<string, number>   // Building affinities (0-1)
  confidenceScore Float @default(0)        // 0-1 confidence in these scores
  viewCount       Int @default(0)          // How many views calculated this
  
  lastUpdated     DateTime @updatedAt
  
  user            User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### 2. Preference Calculation (`lib/preferenceCalculator.ts`)

#### calculateImplicitPreferences()
Converts profile view history into archetype/building preference scores.

**Engagement Scoring:**
- Duration weight: 0 at <5s, peaks at 30s (1.0)
- Scroll depth: How far user scrolled (0-1)
- Interaction bonus: 1.5x multiplier if user liked/passed/bookmarked

**Confidence Score:**
- Based on sample size (minimum 5 views needed)
- Weighted by interaction rate (more interactions = more confidence)
- Range: 0-1

**Output:**
```typescript
{
  archetypeScores: {
    'STEM Scholar': 0.75,
    'Dark Academia': 0.45,
    // ... all 10 archetypes
  },
  buildingScores: {
    'Bahen Centre': 0.6,
    'Robarts Library': 0.5,
  },
  confidenceScore: 0.42,  // Low confidence with few views
  viewCount: 8
}
```

#### blendPreferences()
Combines questionnaire (explicit) with viewing behavior (implicit) using constant ratio.

**Formula:**
```
adjustedImplicitWeight = IMPLICIT_WEIGHT × implicitConfidence
adjustedQuestionnaireWeight = QUESTIONNAIRE_WEIGHT + (IMPLICIT_WEIGHT × (1 - implicitConfidence))

blendedScore = (qScore × adjustedQuestionnaireWeight) + (iScore × adjustedImplicitWeight)
```

This ensures:
- Low confidence implicit preferences (few views) → questionnaire remains dominant
- High confidence implicit preferences (many engaged views) → implicit gets more influence, up to 75% max (50% + 25%)

**Output:**
```typescript
{
  archetypeScores: {
    'STEM Scholar': 0.62,  // 50% of questionnaire + 25% of implicit, weighted by confidence
    'Dark Academia': 0.48,
  },
  buildingScores: { /* ... */ }
}
```

### 3. Matching Algorithm (`lib/matchingAlgorithm.ts`)

#### calculateCompatibilityScore()
Calculates how compatible two users are based on their blended preferences.

**Process:**
1. Blend both users' questionnaire + implicit preferences
2. Calculate archetype similarity using cosine similarity
3. Calculate building similarity using cosine similarity
4. Weight: 70% archetype, 30% building
5. Return final score 0-1

**Cosine Similarity Example:**
```
User A archetypes: { 'STEM': 0.8, 'Dark Academia': 0.2 }
User B archetypes: { 'STEM': 0.6, 'Dark Academia': 0.5 }

Dot product: (0.8 × 0.6) + (0.2 × 0.5) = 0.58
Magnitude A: √(0.8² + 0.2²) = 0.82
Magnitude B: √(0.6² + 0.5²) = 0.78

Similarity = 0.58 / (0.82 × 0.78) = 0.91
```

#### rankMatches()
Sorts candidates by compatibility score descending.

```typescript
const ranked = rankMatches(currentUserPrefs, candidatePrefs);
// Returns: [{ index: 2, score: 0.92 }, { index: 0, score: 0.78 }, ...]
```

### 4. API Endpoints

#### POST /api/profile-views
**Purpose:** Track a profile view and update user preferences

**Request:**
```json
{
  "userId": "user123",
  "viewedProfileId": "profile456",
  "viewStartTime": "2025-02-20T14:30:00Z",
  "viewEndTime": "2025-02-20T14:45:00Z",
  "scrollDepth": 0.7,
  "actionType": "like"
}
```

**Side effects:**
1. Creates ProfileView record
2. Fetches all user's previous views
3. Recalculates implicit preferences
4. Updates/creates UserPreferenceProfile with new scores and confidence

**Response:**
```json
{
  "success": true,
  "data": {
    "profileView": {
      "id": "view123",
      "duration": 900,
      "interacted": true,
      "actionType": "like"
    },
    "preferences": {
      "archetypeScores": { /* updated */ },
      "confidenceScore": 0.52,
      "viewCount": 9
    }
  }
}
```

#### GET /api/preferences?userId=...
**Purpose:** Retrieve user's blended preferences (questionnaire + implicit)

**Response:**
```json
{
  "userId": "user123",
  "archetypeScores": { /* blended scores */ },
  "buildingScores": { /* blended scores */ },
  "confidenceScore": 0.52,
  "blendingRatio": {
    "questionnaire": 0.5,
    "implicitBehavior": 0.25,
    "schedule": 0.25
  }
}
```

#### GET /api/matches?userId=...&limit=10
**Purpose:** Get ranked matches for a user

**Response:**
```json
{
  "userId": "user123",
  "matches": [
    {
      "candidateId": "user456",
      "score": 0.92,
      "archetypeMatch": 0.95,
      "buildingMatch": 0.85,
      "reasons": [
        "Both like STEM and Dark Academia",
        "Similar schedule preferences"
      ]
    },
    // ... more matches
  ],
  "blendingRatio": {
    "questionnaire": 0.5,
    "implicitBehavior": 0.25,
    "schedule": 0.25
  }
}
```

## Frontend Integration

### Profile View Tracking

When a user views a profile (e.g., on the planet or in a modal), track the view:

```typescript
// On profile open
const viewStartTime = new Date();

// On profile close
const viewEndTime = new Date();
const duration = Math.floor((viewEndTime - viewStartTime) / 1000);

// Track the view
const response = await fetch('/api/profile-views', {
  method: 'POST',
  body: JSON.stringify({
    userId: currentUser.id,
    viewedProfileId: viewedProfile.id,
    viewStartTime: viewStartTime.toISOString(),
    viewEndTime: viewEndTime.toISOString(),
    scrollDepth: calculateScrollDepth(), // 0-1
    actionType: userAction, // 'like', 'pass', 'bookmark', or undefined
  }),
});
```

### Preference Influence

When showing next matches, use the blended preferences:

```typescript
// Fetch user's current blended preferences
const prefs = await fetch(`/api/preferences?userId=${userId}`).then(r => r.json());

// Get ranked matches
const matches = await fetch(`/api/matches?userId=${userId}&limit=20`).then(r => r.json());

// Display matches in order of compatibility score
matches.forEach(match => {
  console.log(`${match.candidateId}: ${match.score * 100}% compatible`);
});
```

## Data Flow

```
User views Profile A
        ↓
POST /api/profile-views
        ↓
ProfileView created in DB
        ↓
All user's ProfileViews fetched
        ↓
calculateImplicitPreferences()
        ↓
UserPreferenceProfile updated/created
        ↓
Next time matching happens:
        ↓
Questionnaire + UserPreferenceProfile loaded
        ↓
blendPreferences() combines them
        ↓
calculateCompatibilityScore() against all users
        ↓
Ranked matches returned with scores
```

## Constants & Weights

### Blending Ratio
- Questionnaire: 0.5 (50%)
- Implicit behavior: 0.25 (25%)
- Schedule: 0.25 (25%)

These are **constant** - the ratio doesn't change based on confidence or sample size. Instead, low-confidence implicit preferences naturally have less impact.

### Engagement Scoring
- Duration: Linear from 0 at <5s to 1.0 at 30s (higher capped at 1.0)
- Scroll depth: 0-1 multiplied directly
- Interaction bonus: 1.5x if user liked/passed/bookmarked

### Confidence Calculation
- Minimum views for any confidence: 5
- Linear growth from 5 to 55 views
- Interaction rate bonus: 0.5 to 1.0 based on % of views with actions

### Compatibility Weighting
- Archetypes: 70%
- Buildings: 30%

## Future Enhancements

### Schedule Compatibility (25%)
The third layer (currently reserved) could include:
- Shared free time slots
- Similar class schedules
- Compatible availability for hangouts

### Dynamic Weighting
Instead of constant 50/25/25, could adjust based on:
- How old the questionnaire responses are
- Consistency of viewing behavior
- User's stated preference for matching criteria

### Machine Learning
Could train a model to predict:
- Which profile attributes predict "likes"
- Optimal engagement duration thresholds
- Better archetype similarity functions

## Migration & Setup

```bash
# 1. Run Prisma migration to create tables
npx prisma migrate dev --name add_profile_views_and_preferences

# 2. The schema automatically creates:
# - ProfileView table with indexes on userId, viewedProfileId, createdAt
# - UserPreferenceProfile table with userId unique constraint
# - Foreign key relationships to User

# 3. API endpoints are automatically available at:
# POST   /api/profile-views
# GET    /api/preferences
# GET    /api/matches
```

## Testing the System

```bash
# 1. Create a test user with questionnaire
POST /api/questionnaire/submit
{
  "userId": "test-user",
  "data": { /* questionnaire */ }
}

# 2. Create several test profiles with different archetypes
# (These should be created in your profile setup flow)

# 3. Simulate viewing profiles
for i in 1..10; do
  POST /api/profile-views {
    "userId": "test-user",
    "viewedProfileId": "profile-$i",
    "viewStartTime": "...",
    "viewEndTime": "...",
    "scrollDepth": 0.5,
    "actionType": (random: "like", "pass", "bookmark")
  }
done

# 4. Check calculated preferences
GET /api/preferences?userId=test-user
# Should show blended archetypeScores with higher confidence

# 5. Get matches
GET /api/matches?userId=test-user&limit=10
# Should return ranked matches influenced by viewing behavior
```
