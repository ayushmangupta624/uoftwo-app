# Preference System Setup Guide

This guide walks through setting up the two-layer preference matching system with viewing behavior tracking.

## What Was Implemented

### 1. Backend Infrastructure ✅

#### Prisma Schema (`prisma/schema.prisma`)
- **ProfileView** model: Tracks each profile view with duration, scroll depth, interactions
- **UserPreferenceProfile** model: Stores calculated implicit preferences (archetypes, buildings, confidence)

#### Preference Calculation (`lib/preferenceCalculator.ts`)
- `calculateImplicitPreferences()`: Converts viewing history to archetype/building scores
- `blendPreferences()`: Blends questionnaire + implicit with 50/25 ratio

#### Matching Algorithm (`lib/matchingAlgorithm.ts`)
- `calculateCompatibilityScore()`: Computes cosine-similarity based compatibility
- `rankMatches()`: Sorts candidates by compatibility
- `extractQuestionnairePreferences()`: Maps questionnaire responses to archetype preferences

#### API Endpoints
- `POST /api/profile-views`: Track profile views and update preferences
- `GET /api/preferences`: Retrieve user's blended preferences
- `GET /api/matches`: Get ranked matches with compatibility scores

### 2. Files Created/Modified

**New Files:**
- `lib/prisma.ts` - Prisma client singleton
- `lib/matchingAlgorithm.ts` - Matching logic
- `app/api/profile-views/route.ts` - Profile view tracking (updated)
- `app/api/preferences/route.ts` - Preferences retrieval
- `app/api/matches/route.ts` - Match ranking
- `PREFERENCE_SYSTEM.md` - Full documentation

**Updated Files:**
- `lib/preferenceCalculator.ts` - Fixed return type of `blendPreferences()`
- `prisma/schema.prisma` - Added ProfileView and UserPreferenceProfile models

## Setup Steps

### Step 1: Database Migration

```bash
# Generate Prisma types from schema
npx prisma generate

# Create database tables
npx prisma migrate dev --name add_profile_views_and_preferences

# Verify database connection and tables created
npx prisma studio  # Opens web UI showing your database
```

### Step 2: Environment Configuration

Ensure your `.env.local` has:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/uoftwo"
# (Or your actual database connection string)
```

### Step 3: Test the System

#### 3a. Test Profile View Tracking

```bash
# Start your dev server
npm run dev

# In another terminal, test the profile-views endpoint
curl -X POST http://localhost:3000/api/profile-views \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-1",
    "viewedProfileId": "profile-1",
    "viewStartTime": "2025-02-20T14:30:00Z",
    "viewEndTime": "2025-02-20T14:35:00Z",
    "scrollDepth": 0.75,
    "actionType": "like"
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "profileView": {
      "id": "...",
      "duration": 300,
      "interacted": true,
      "actionType": "like"
    },
    "preferences": {
      "archetypeScores": { /* calculated */ },
      "confidenceScore": 0.0,
      "viewCount": 1
    }
  }
}
```

#### 3b. Test Preferences Retrieval

```bash
curl http://localhost:3000/api/preferences?userId=test-user-1
```

Expected response showing blended preferences with 50/25 ratio.

#### 3c. Test Match Ranking

```bash
curl http://localhost:3000/api/matches?userId=test-user-1&limit=10
```

Expected response with ranked matches (will be empty if no other users exist).

### Step 4: Frontend Integration (TODO)

The frontend needs to be instrumented to track profile views. This includes:

**Components to Modify:**
1. **ProfileModal** - Track viewing duration
   - Record `viewStartTime` when modal opens
   - Record `viewEndTime` when modal closes
   - Calculate `scrollDepth` from scroll position
   - Call `/api/profile-views` on close

2. **Planet Page** - Track archetype profile views
   - Similar tracking for 3D profile interactions
   - Track UserDot interactions (viewing individual profiles)

3. **Cards/Profile Preview Components** - Track preview time
   - Light touch: track if user spends >2s on a profile preview

**Example Implementation:**

```typescript
// In a profile modal component
const [viewStartTime, setViewStartTime] = useState<Date | null>(null);

useEffect(() => {
  setViewStartTime(new Date());
  
  return () => {
    // On unmount (modal close)
    if (viewStartTime) {
      const duration = Math.floor((Date.now() - viewStartTime.getTime()) / 1000);
      
      fetch('/api/profile-views', {
        method: 'POST',
        body: JSON.stringify({
          userId: currentUser.id,
          viewedProfileId: viewedProfile.id,
          viewStartTime: viewStartTime.toISOString(),
          viewEndTime: new Date().toISOString(),
          scrollDepth: calculateScrollDepth(),
          actionType: userAction, // 'like', 'pass', or undefined
        }),
      });
    }
  };
}, []);
```

### Step 5: Verify the Data Flow

1. **Create multiple test profiles** with different archetypes
2. **Simulate user viewing** various profiles with different engagement levels
3. **Check database**:
   ```bash
   npx prisma studio
   # View ProfileView records
   # View UserPreferenceProfile records showing updated confidence
   ```
4. **Verify preference updates** - confidence should increase with more views
5. **Test matching** - users with similar viewing patterns should rank higher

## Blending Ratio Explanation

The system uses a **constant 50/25/25 ratio**:

```
Final Score = (Questionnaire × 0.5) + (Implicit × 0.25 × Confidence) + (Schedule × 0.25)
```

### Why Constant?
- **Questionnaire remains authoritative** - explicit responses are reliable
- **Implicit preferences gradually influence** - as confidence grows with more views
- **Schedule is reserved** - for future schedule-based compatibility

### Confidence Score
- **0** = No views yet (questionnaire only)
- **0-0.5** = Few views (1-20) with low interaction rate
- **0.5-0.8** = Moderate views (20-40) with some interactions
- **0.8-1.0** = Many views (40+) with high interaction rate

### Impact Over Time

| Views | Confidence | Implicit Weight | Questionnaire Weight | Schedule |
|-------|-----------|-----------------|----------------------|----------|
| 0     | 0.0       | 0%              | 50%                  | 50%*     |
| 5     | 0.05      | 1.25%           | 48.75%               | 50%*     |
| 20    | 0.3       | 7.5%            | 42.5%                | 50%*     |
| 50    | 0.9       | 22.5%           | 27.5%                | 50%*     |

*Schedule (50%) is reserved for when schedule compatibility is implemented

## Debugging

### Check Profile Views
```bash
npx prisma studio
# Navigate to ProfileView table
# Filter by userId to see all views for a user
```

### Check Calculated Preferences
```bash
npx prisma studio
# Navigate to UserPreferenceProfile table
# View archetypeScores JSON to see calculated implicit preferences
# Check confidenceScore (should increase with views)
```

### Test Preference Calculation Directly
```typescript
// In your app code
import { calculateImplicitPreferences } from '@/lib/preferenceCalculator';

const views = [
  { duration: 45, scrollDepth: 0.8, interacted: true },
  { duration: 20, scrollDepth: 0.5, interacted: false },
  { duration: 120, scrollDepth: 1.0, interacted: true },
];

const result = calculateImplicitPreferences(views);
console.log('Implicit preferences:', result);
```

### Verify Blending
```typescript
import { blendPreferences } from '@/lib/preferenceCalculator';

const q = { 'STEM Scholar': 0.8, 'Dark Academia': 0.2 };
const i = { 'STEM Scholar': 0.5, 'Dark Academia': 0.8 };
const conf = 0.6;

const result = blendPreferences(q, i, conf);
console.log('Blended:', result.archetypeScores);
// Should show STEM Scholar > Dark Academia when confidence is high
```

## Common Issues

### "Property 'profileView' does not exist"
**Cause:** Prisma types not generated yet
**Fix:** Run `npx prisma generate`

### Database migration fails
**Cause:** PostgreSQL not running or invalid connection string
**Fix:**
- Verify DATABASE_URL in .env.local
- Check PostgreSQL is running: `pg_isready`

### Profile views not being tracked
**Cause:** Frontend not calling `/api/profile-views`
**Fix:** Add tracking code to ProfileModal and Planet page (Step 4)

### Confidence score not increasing
**Cause:** Views might not be with interactions
**Fix:** Ensure `actionType` is provided when tracking important views

## Next Steps

1. **Implement frontend tracking** (ProfileModal, Planet page)
2. **Test the full flow** (view → API → database → preference update)
3. **Monitor matching quality** - verify that repeated viewing of certain archetypes affects matches
4. **Optimize engagement weights** - adjust duration, scroll, and interaction multipliers based on real user behavior
5. **Add schedule layer** - implement the 25% schedule compatibility when schedule data is available

## Architecture Diagram

```
User Views Profile
       ↓
   [Frontend]
   Tracks: duration, scrollDepth, actionType
       ↓
POST /api/profile-views
       ↓
   [Backend API]
   Creates ProfileView record
       ↓
Fetch all user's ProfileViews
       ↓
calculateImplicitPreferences()
   (Engagement scoring)
       ↓
Update UserPreferenceProfile
   (Confidence increases)
       ↓
Next Match Request
       ↓
blendPreferences()
   (50% questionnaire + 25% implicit)
       ↓
calculateCompatibilityScore()
   (Cosine similarity)
       ↓
rankMatches()
   (Sort by score)
       ↓
Return ranked matches to frontend
```

## Reference Documentation

- Full system docs: [PREFERENCE_SYSTEM.md](./PREFERENCE_SYSTEM.md)
- Prisma docs: https://www.prisma.io/docs/
- Algorithm explanation: See [matchingAlgorithm.ts](lib/matchingAlgorithm.ts) for detailed comments
