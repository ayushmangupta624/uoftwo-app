# Implementation Checklist: Preference Learning System

## ✅ Completed

### Backend Infrastructure
- [x] **Prisma Schema** - ProfileView and UserPreferenceProfile models created
  - ProfileView tracks: userId, viewedProfileId, duration, scrollDepth, actionType, interacted
  - UserPreferenceProfile stores: archetypeScores, buildingScores, confidenceScore, viewCount

- [x] **Preference Calculation** (`lib/preferenceCalculator.ts`)
  - calculateImplicitPreferences() - converts viewing history to scores
  - blendPreferences() - combines 50% questionnaire + 25% implicit with confidence weighting
  - extractQuestionnairePreferences() - maps questionnaire to archetype scores

- [x] **Matching Algorithm** (`lib/matchingAlgorithm.ts`)
  - calculateCompatibilityScore() - cosine similarity based compatibility
  - rankMatches() - sorts candidates by score
  - UserPreferences interface for blended preferences

- [x] **API Endpoints**
  - POST /api/profile-views - tracks views and updates preferences
  - GET /api/preferences - retrieves blended preferences
  - GET /api/matches - returns ranked matches

- [x] **Prisma Client** (`lib/prisma.ts`)
  - Singleton instance configured for Next.js
  - Ready for use in API routes

### Documentation
- [x] PREFERENCE_SYSTEM.md - Complete system documentation
- [x] PREFERENCE_SETUP.md - Setup and testing guide
- [x] README.md - Updated with feature description

## 🔄 In Progress / TODO

### Database Migration
- [ ] Run `npx prisma generate` to generate Prisma types
- [ ] Run `npx prisma migrate dev` to create tables
- [ ] Verify tables in database

### Frontend Integration
- [ ] **ProfileModal Component**
  - [ ] Track viewStartTime on mount
  - [ ] Track viewEndTime, scrollDepth on unmount
  - [ ] Call POST /api/profile-views with tracking data
  - [ ] Handle actionType ('like', 'pass', 'bookmark')

- [ ] **Planet Page**
  - [ ] Track viewing when user clicks on profiles
  - [ ] Track interactions (likes, passes, bookmarks)
  - [ ] Send data to /api/profile-views

- [ ] **Profile Cards/Previews**
  - [ ] Optional: track if user spends >2s on preview
  - [ ] Send lightweight tracking data

### API Implementation
- [ ] Complete GET /api/preferences
  - [ ] Fetch user's questionnaire responses
  - [ ] Fetch user's implicit preferences from DB
  - [ ] Calculate blended scores
  - [ ] Return with metadata

- [ ] Complete GET /api/matches
  - [ ] Fetch current user's preferences
  - [ ] Fetch all candidate profiles
  - [ ] Calculate compatibility scores
  - [ ] Return ranked matches with explanations

### Testing & Validation
- [ ] Test profile view tracking
- [ ] Test preference calculation with multiple views
- [ ] Test confidence score increases over time
- [ ] Test compatibility scoring
- [ ] Test match ranking changes based on viewing behavior
- [ ] End-to-end flow: view → track → preference update → affect matches

### Future Enhancements
- [ ] Schedule layer (25%) - implement schedule compatibility scoring
- [ ] Analytics - track which profile types lead to matches
- [ ] Refinement - optimize engagement weights based on data
- [ ] Machine learning - predict profile preferences
- [ ] User feedback - let users rate match quality

## Quick Reference: Key Files

| File | Purpose | Status |
|------|---------|--------|
| `prisma/schema.prisma` | Data models | ✅ Complete |
| `lib/prisma.ts` | Prisma singleton | ✅ Complete |
| `lib/preferenceCalculator.ts` | Calculation logic | ✅ Complete |
| `lib/matchingAlgorithm.ts` | Matching logic | ✅ Complete |
| `app/api/profile-views/route.ts` | View tracking | ✅ Backend done, needs frontend calls |
| `app/api/preferences/route.ts` | Preference retrieval | 🔄 Needs implementation |
| `app/api/matches/route.ts` | Match ranking | 🔄 Needs implementation |
| `PREFERENCE_SYSTEM.md` | Full docs | ✅ Complete |
| `PREFERENCE_SETUP.md` | Setup guide | ✅ Complete |

## Implementation Order Recommendation

1. **Database Setup**
   - Run Prisma generate and migrate
   - Verify tables exist

2. **API Complete Implementation**
   - Finish GET /api/preferences endpoint
   - Finish GET /api/matches endpoint
   - Test with Postman/curl

3. **Frontend Integration**
   - Add tracking to ProfileModal first
   - Test tracking is being saved
   - Add tracking to Planet page
   - Test full flow

4. **Testing & Iteration**
   - Manual testing with test profiles
   - Verify preferences update correctly
   - Verify matches rank based on behavior
   - Optimize weights if needed

## Key Design Decisions

### Why Constant 50/25/25 Ratio?
- **Questionnaire remains authoritative** - user's explicit preferences are most reliable
- **Implicit influence grows with confidence** - as viewing sample grows, implicit preferences naturally get more influence
- **Schedule reserved for future** - infrastructure ready when schedule data available

### Why Confidence-Weighted Blending?
- Low confidence (few views) → questionnaire stays near 50%, implicit gets little influence
- High confidence (many views) → implicit can reach 25%, questionnaire drops to 25%
- This prevents early, unreliable viewing patterns from overriding questionnaire

### Why Cosine Similarity?
- Handles 10-dimensional archetype vectors well
- Robust to magnitude differences
- Standard for preference/recommendation systems
- Interpretable as "directional similarity"

## Success Metrics

Once implemented, track:
- **Preference stability**: How much do preferences change with new views?
- **Match quality**: Do users report better matches after viewing behavior is incorporated?
- **Confidence growth**: How quickly does confidence reach "high" level?
- **Archetype consistency**: Do viewing patterns align with questionnaire choices?

## Questions & Decisions

**Q: Should we track all profile views or only those with scroll/interaction?**
A: Track all. Even quick dismissals signal "not interested in this archetype".

**Q: How long should we keep old profile views?**
A: Currently indefinite. Could add time decay if desired (views from 6 months ago matter less).

**Q: Should different interaction types have different weights?**
A: Currently 1.5x for all. Could refine: "like" = 2x, "bookmark" = 1.5x, "pass" = 1x.

**Q: What if user profile changes (e.g., new archetype)?**
A: Keep historical views. Questionnaire can be re-answered, which resets explicit preferences. Implicit remains.

## Contact & Questions

See [PREFERENCE_SYSTEM.md](./PREFERENCE_SYSTEM.md) for more details on any of these components.
