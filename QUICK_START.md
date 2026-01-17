# 🚀 Quick Start - Preference System

## 60-Second Overview

Your app now has a backend system that tracks which profiles users view and automatically adjusts their matches based on viewing behavior.

**How it works:**
1. User views profiles (time spent, scroll depth, likes/passes)
2. System learns implicit preferences from viewing patterns
3. Future matches are influenced 25% by viewing behavior
4. Questionnaire responses stay 50% influential (authoritative)

## Right Now (What's Done)

✅ Database schema created (`ProfileView`, `UserPreferenceProfile`)
✅ Preference calculation engine built (`lib/preferenceCalculator.ts`)
✅ Matching algorithm implemented (`lib/matchingAlgorithm.ts`)
✅ API endpoints coded (`/api/profile-views`, `/api/preferences`, `/api/matches`)
✅ Complete documentation written

## Three Steps to Go Live

### Step 1: Database (5 minutes)
```bash
# In your terminal:
npx prisma generate
npx prisma migrate dev --name add_profile_views_and_preferences
```

### Step 2: Frontend Tracking (20 minutes)
Add this to **ProfileModal component** (when user views a profile):

```typescript
const [viewStartTime, setViewStartTime] = useState<Date | null>(null);

useEffect(() => {
  setViewStartTime(new Date());
  
  return () => {
    // When modal closes, track the view
    if (viewStartTime) {
      fetch('/api/profile-views', {
        method: 'POST',
        body: JSON.stringify({
          userId: currentUser.id,
          viewedProfileId: viewedProfile.id,
          viewStartTime: viewStartTime.toISOString(),
          viewEndTime: new Date().toISOString(),
          scrollDepth: 0.5, // Calculate from actual scroll if possible
          actionType: userAction, // 'like', 'pass', etc.
        }),
      });
    }
  };
}, []);
```

Similar code needed for **Planet page** when clicking profiles.

### Step 3: Test (5 minutes)
```bash
# In Postman or curl:
curl -X POST http://localhost:3000/api/profile-views \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "viewedProfileId": "profile-1",
    "viewStartTime": "2025-02-20T14:30:00Z",
    "viewEndTime": "2025-02-20T14:35:00Z",
    "scrollDepth": 0.75,
    "actionType": "like"
  }'

# Should return success with preferences updated
```

## The Math (Simple Version)

```
Final Match Score = (Questionnaire 50%) + (Viewed Patterns 25%) + (Schedule 25%)
```

**What this means:**
- User fills questionnaire → they're matched 50% on that
- User views 50 Dark Academia profiles → their matches become 25% more Dark Academia focused
- Their original questionnaire preference stays at 50% (never changes unless they re-answer)

## Architecture Quick Reference

```
User Views Profile
        ↓
Frontend calls POST /api/profile-views
        ↓
Backend saves ProfileView to database
        ↓
Backend recalculates implicit preferences
        ↓
Backend updates UserPreferenceProfile with new scores
        ↓
Next time getting matches:
        ↓
Frontend calls GET /api/matches
        ↓
Backend blends questionnaire + implicit viewing behavior
        ↓
Returns ranked matches influenced by what they've been viewing
```

## Key Files

| File | What It Does |
|------|-------------|
| `lib/preferenceCalculator.ts` | Turns viewing data into preference scores |
| `lib/matchingAlgorithm.ts` | Calculates compatibility between users |
| `app/api/profile-views/route.ts` | Receives & saves view tracking |
| `app/api/preferences/route.ts` | Returns user's current blended preferences |
| `app/api/matches/route.ts` | Returns ranked matches |

## Full Documentation

- **Complete system docs:** [PREFERENCE_SYSTEM.md](./PREFERENCE_SYSTEM.md)
- **Setup & testing:** [PREFERENCE_SETUP.md](./PREFERENCE_SETUP.md)
- **What's left to do:** [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)
- **Full summary:** [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

## Common Questions

**Q: How do I test this works?**
A: After Step 1, use Postman to POST to `/api/profile-views` a few times. Then check in Prisma Studio (`npx prisma studio`) - you should see views being saved.

**Q: When do preferences update?**
A: Immediately when `/api/profile-views` is called. No delay.

**Q: What if questionnaire and viewing behavior conflict?**
A: Questionnaire wins (50% vs 25%). But over time with many views, the 25% from behavior gradually influences matches.

**Q: Do old views still matter?**
A: Yes, indefinitely. If you change your mind about a profile type, your newer views add to the score.

**Q: What about the 25% schedule part?**
A: Reserved for future. When schedule compatibility is added, it automatically slots into the remaining 25%.

## Next Steps

1. Run database migration (Step 1 above)
2. Add frontend tracking to ProfileModal and Planet page (Step 2)
3. Test with curl/Postman (Step 3)
4. Monitor that viewing behavior influences matches ✅

## Need More Details?

- Setup instructions: See [PREFERENCE_SETUP.md](./PREFERENCE_SETUP.md)
- Algorithm details: See [PREFERENCE_SYSTEM.md](./PREFERENCE_SYSTEM.md)
- Implementation roadmap: See [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)
- Full summary: See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

---

**TL;DR:** Database schema + backend logic ✅ done. Add tracking code to ProfileModal/Planet, run migration, test. You're done! 🎉
