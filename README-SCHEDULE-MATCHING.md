# Schedule Matching & Continual Feedback System

## Overview

This implementation adds two major features to the matching system:

1. **PDF Schedule Parser** - Parses UofT ACORN schedule PDFs to extract course information
2. **Continual Feedback System** - Tracks user viewing behavior to improve match recommendations

## Database Schema

### Schedule Model
Stores parsed schedule data for each user:

```typescript
{
  userId: string;
  pdfUrl?: string;              // Optional URL to stored PDF
  courses: ParsedCourse[];      // Extracted course data
  buildings: string[];          // Unique buildings user visits
  timeSlots: TimeSlot[];        // Structured time data for matching
}
```

### ProfileView Model
Tracks user viewing behavior for continual learning:

```typescript
{
  viewerId: string;
  viewedProfileId: string;
  duration: number;             // Time spent viewing (seconds)
  scrollDepth: number;          // How much they scrolled (0-1)
  interacted: boolean;          // Did they like/pass
  interactionType?: string;     // "like" or "pass"
}
```

## API Endpoints

### Schedule Management

**POST /api/schedule**
- Upload and parse a schedule PDF
- Body: FormData with 'file' (PDF) or 'pdfUrl' (string)
- Returns: Parsed schedule with course count and buildings

**GET /api/schedule**
- Retrieve current user's schedule
- Returns: Full schedule object with courses and time slots

### Profile View Tracking

**POST /api/profile-view**
- Track a profile view event
- Body: `{ viewedProfileId, duration, scrollDepth, interacted, interactionType }`
- Returns: Created profile view record

**GET /api/profile-view?type=viewer|viewed**
- Get viewing history or who viewed your profile
- Returns: List of profile views with user data

## Matching Algorithm

### Compatibility Score Calculation

The algorithm now uses a weighted combination of three factors:

1. **Archetype Compatibility** (35%) - Personality and interest alignment
2. **Building Preferences** (15%) - Shared campus locations and vibes
3. **Schedule Compatibility** (50%) - Overlapping free time and proximity

### Schedule Compatibility Components

**Shared Buildings** (30% of schedule score)
- Rewards users who have classes in the same buildings
- Maximum score at 3+ shared buildings

**Free Time Overlap** (50% of schedule score)
- Calculates when both users are likely to be free
- Considers schedule density per day
- Perfect match when both completely free on same day

**Proximity Score** (20% of schedule score)
- Rewards users in same/nearby buildings at the same time
- Uses building clusters (e.g., Engineering quad, Science buildings)
- Higher score for same building, partial score for nearby buildings

### Continual Learning

The system learns from user behavior:

1. **Explicit Preferences** (50% weight) - From questionnaire responses
2. **Implicit Preferences** (25% weight) - From viewing patterns
   - Long viewing duration = higher interest
   - Deep scrolling = higher engagement
   - Interactions (like/pass) = strongest signal
3. **Schedule Compatibility** (25% weight) - From parsed schedules

Confidence in implicit preferences increases with:
- More profile views (minimum 5 for any confidence)
- Higher interaction rate (likes/passes vs passive views)

## PDF Parser Implementation

### Supported Format

The parser handles standard UofT ACORN schedule PDFs with format:
```
CSC108H1 F LEC0101 TH 10:00AM-12:00PM BA1170
```

### Extracted Data

- **Course Code**: e.g., CSC108H1
- **Course Name**: Extracted from nearby text
- **Building**: e.g., BA (Bahen Centre)
- **Time**: Day and time range (e.g., "TH 10:00AM-12:00PM")

### Building Mapping

The parser includes a comprehensive mapping of UofT building codes to full names:
- BA → Bahen Centre
- GB → Galbraith Building
- SS → Sidney Smith Hall
- RS → Robarts Library
- And 20+ more buildings

## Integration Example

### Uploading a Schedule

```typescript
const formData = new FormData();
formData.append('file', pdfFile);

const response = await fetch('/api/schedule', {
  method: 'POST',
  body: formData,
});

const { schedule } = await response.json();
```

### Tracking Profile Views

```typescript
// Track when user views a profile
await fetch('/api/profile-view', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    viewedProfileId: profileUserId,
    duration: 45, // seconds
    scrollDepth: 0.8, // 80% scrolled
    interacted: true,
    interactionType: 'like',
  }),
});
```

### Getting Smart Matches

```typescript
// GET /api/matching-users now returns ranked matches
// considering schedule compatibility and viewing behavior
const response = await fetch('/api/matching-users');
const { matches } = await response.json();

// Matches are sorted by compatibilityScore (0-1)
matches.forEach(match => {
  console.log(`${match.fname}: ${match.compatibilityScore * 100}% compatible`);
});
```

## Future Enhancements

1. **Real-time Schedule Updates** - Detect mid-semester schedule changes
2. **Course Recommendation** - Suggest courses to take together
3. **Study Group Formation** - Auto-create study groups for shared courses
4. **Campus Event Matching** - Suggest events based on free time overlap
5. **Advanced Feedback** - Track message response rates, date outcomes
6. **Machine Learning** - Train models on successful matches

## Migration

To apply the schema changes:

```bash
npx prisma migrate dev --name add_schedule_and_profile_views
npx prisma generate
```

## Notes

- Schedule parsing requires `pdf-parse` package (already included in `lib/pdfParser.ts`)
- Profile views are tracked client-side and sent to the API
- Schedule compatibility calculation handles missing schedule data gracefully
- All new endpoints require authentication via `getAuthenticatedUserId()`
