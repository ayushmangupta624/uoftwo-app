# UofTwo Planet Feature - Implementation Guide

## Overview
A Soul App-inspired 3D interactive sphere where users can explore and connect with other UofT students. Each dot on the sphere represents a user profile, and clicking on dots reveals profile previews.

## Features Implemented

### 1. **3D Interactive Planet** (`/planet`)
- Interactive 3D sphere with user profiles represented as glowing dots
- Smooth rotation using mouse/trackpad drag
- Zoom in/out with scroll wheel
- Color-coded dots based on dorm archetypes:
  - 💙 Blue: New College
  - 🧡 Orange: Oak House  
  - 💜 Purple: Chestnut
  - 💚 Green: Innis

### 2. **User Profile Previews**
- Click any dot to see a modal with user details
- Displays:
  - Name, age, program, and year
  - Dorm archetype badge
  - Bio
  - Interests tags
  - Connect/Skip buttons

### 3. **Authentication & Access Control**
- Only logged-in users who have:
  - Submitted their Acorn schedule
  - Completed the questionnaire
- Automatic redirect to Planet page for completed users
- Landing page shows for new/incomplete users

### 4. **Updated Navigation**
- Added "Planet" tab to navbar with globe icon
- Accessible between Home and Events

## Technical Stack

### New Dependencies
```json
{
  "three": "^0.x.x",
  "@react-three/fiber": "^8.x.x",
  "@react-three/drei": "^9.x.x"
}
```

### Key Files Created
- `app/planet/page.tsx` - Main 3D planet page
- `app/contexts/AuthContext.tsx` - Authentication state management
- `app/components/AuthRedirect.tsx` - Redirect logic for completed users

### Key Files Modified
- `app/components/Navbar.tsx` - Added Planet navigation item
- `app/layout.tsx` - Wrapped app in AuthProvider
- `app/page.tsx` - Added AuthRedirect wrapper

## How It Works

### 3D Sphere Positioning
Users are positioned on the sphere using the Fibonacci spiral algorithm for even distribution:
```typescript
const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
// Calculate positions for each user evenly across sphere surface
```

### Authentication Flow
1. User visits site → AuthContext checks localStorage
2. If completed onboarding → Redirect to `/planet`
3. If not completed → Show landing page
4. Mock authentication creates demo user with completed status

### User Interaction
1. Drag sphere to rotate (OrbitControls)
2. Scroll to zoom in/out
3. Hover over dots → See name tooltip
4. Click dot → Modal with full profile preview
5. Connect or Skip to next profile

## Mock Data
Currently using 20 mock user profiles for testing. In production, this would fetch from your API.

## Customization Options

### Change Authentication Requirements
Edit `app/contexts/AuthContext.tsx`:
```typescript
const hasCompletedOnboarding = 
  user?.scheduleSubmitted === true && 
  user?.questionnaireCompleted === true;
```

### Adjust Sphere Size
Edit `app/planet/page.tsx`:
```typescript
const radius = 3; // Change sphere radius
minDistance={5} // Min zoom distance
maxDistance={15} // Max zoom distance
```

### Modify Dorm Colors
Edit color mappings in both `UserDot` component and `UserProfileModal`:
```typescript
const colors: { [key: string]: string } = {
  "New College": "#3b82f6", // Blue
  "Oak House": "#f97316",   // Orange
  "Chestnut": "#a855f7",    // Purple
  "Innis": "#10b981",       // Green
};
```

## Next Steps for Production

1. **Replace Mock Auth with Real API**
   - Implement actual login/logout
   - Check real user completion status
   - Store JWT tokens securely

2. **Fetch Real User Data**
   - Replace `mockUsers` with API call
   - Implement pagination/lazy loading for many users
   - Add real profile images

3. **Add More Interactions**
   - Chat functionality when "Connect" is clicked
   - Like/favorite system
   - Match algorithm integration

4. **Performance Optimization**
   - Implement virtual rendering for 100+ users
   - Optimize Three.js scene rendering
   - Add loading states

5. **Mobile Optimization**
   - Touch controls for rotation
   - Responsive 3D canvas sizing
   - Mobile-optimized modal layouts

## Testing
Navigate to `http://localhost:3000` - you should be automatically redirected to `/planet` since the demo user has completed onboarding.

To test the landing page:
1. Open browser DevTools
2. Clear localStorage: `localStorage.clear()`
3. Refresh page
4. Modify the mock user in AuthContext to set `scheduleSubmitted: false` or `questionnaireCompleted: false`

## Browser Compatibility
- Requires WebGL support (modern browsers)
- Tested on Chrome, Firefox, Safari, Edge
- May have reduced performance on older devices

