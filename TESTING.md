# Testing the Planet Feature

## Quick Test Steps

### 1. View the Planet Page (Default)
The demo user is pre-configured with completed onboarding, so:
- Navigate to `http://localhost:3000`
- You should be automatically redirected to `/planet`
- See the interactive 3D sphere with 20 user dots

### 2. Interact with the Planet
- **Rotate**: Click and drag on the sphere
- **Zoom**: Scroll up/down
- **Hover**: Hover over dots to see name tooltips
- **Click**: Click any dot to open a profile preview modal
- **Connect/Skip**: Try the buttons in the modal

### 3. Test Landing Page (Optional)
To see the original landing page for non-completed users:

**Option A: Browser DevTools**
```javascript
// Open DevTools Console (F12)
localStorage.removeItem('uoftwo_user');
location.reload();
```

**Option B: Modify Mock User**
Edit `app/contexts/AuthContext.tsx` line 35-42:
```typescript
const mockUser: User = {
  id: '1',
  name: 'Demo User',
  email: 'demo@uoft.ca',
  scheduleSubmitted: false,  // Change to false
  questionnaireCompleted: false,  // Change to false
};
```

Then refresh the page to see the landing page.

### 4. Test Navigation
- Notice the navbar changes:
  - **Completed users**: See "Planet" instead of "Home"
  - **Incomplete users**: See "Home" instead of "Planet"

## Expected Behavior

### For Completed Users
✅ Redirected from `/` to `/planet`
✅ Navbar shows: Planet | Events | Profile
✅ Can interact with 3D sphere
✅ Can view user profiles
✅ Stats show "20" users online

### For Incomplete Users
✅ See landing page at `/`
✅ Navbar shows: Home | Events | Profile
✅ Cannot access `/planet` (redirected to `/`)
✅ Can navigate to onboarding/questionnaire

## Common Issues

### Issue: Blank screen or "Loading planet..." forever
**Solution**: Check browser console for errors. Make sure:
- Three.js dependencies installed: `npm install`
- WebGL is supported in your browser
- No ad blockers interfering with Canvas

### Issue: Navbar not updating
**Solution**: 
- Clear localStorage: `localStorage.clear()`
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Issue: Can't drag/rotate sphere
**Solution**: 
- Make sure you're clicking directly on or near the sphere
- Try scrolling to zoom first, then drag
- Check if OrbitControls loaded properly (console)

## Browser Support
✅ Chrome 90+
✅ Firefox 88+
✅ Safari 15+
✅ Edge 90+

❌ IE 11 (not supported)

## Performance Notes
- Smooth on most modern devices
- May slow down on older mobile devices
- 20 users is optimal; 50+ may need optimization
- Sphere uses ~30-60 FPS depending on device

## Next Steps
Once testing is complete:
1. Replace mock users with real API data
2. Implement actual authentication
3. Add user profile images
4. Connect "Connect" button to messaging system
5. Add filters by dorm archetype, program, etc.

