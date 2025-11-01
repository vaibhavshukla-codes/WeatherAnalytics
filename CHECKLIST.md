# Project Setup Checklist

Use this checklist to ensure your Weather Analytics Dashboard is properly set up and ready to use.

## Prerequisites
- [ ] Node.js v16+ installed
- [ ] MongoDB installed and running
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## Installation
- [ ] Repository cloned/downloaded
- [ ] Root directory dependencies installed (`npm install`)
- [ ] Server dependencies installed (`cd server && npm install`)
- [ ] Client dependencies installed (`cd client && npm install`)

## API Setup
- [ ] OpenWeatherMap account created
- [ ] OpenWeatherMap API key obtained
- [ ] Google Cloud account created
- [ ] Google project created
- [ ] Google+ API enabled
- [ ] OAuth 2.0 credentials created
- [ ] Redirect URI configured correctly

## Configuration
- [ ] `.env` file created in server directory
- [ ] MongoDB URI configured
- [ ] JWT secret generated
- [ ] OpenWeatherMap API key added
- [ ] Google Client ID added
- [ ] Google Client Secret added
- [ ] Port numbers verified (5000 for server, 3000 for client)

## Database
- [ ] MongoDB running locally OR
- [ ] MongoDB Atlas cluster created and configured
- [ ] Connection string tested

## Testing
- [ ] Backend server starts without errors
- [ ] Frontend app starts without errors
- [ ] MongoDB connection successful
- [ ] Google OAuth login works
- [ ] City search works
- [ ] Adding favorites works
- [ ] Viewing city details works
- [ ] Charts load correctly
- [ ] Temperature unit toggle works
- [ ] Logout works

## Browser Testing
- [ ] Login page displays correctly
- [ ] Google OAuth redirect works
- [ ] Dashboard loads after login
- [ ] Empty state displays when no favorites
- [ ] Add city dialog opens and works
- [ ] City cards display weather data
- [ ] Clicking city card opens details
- [ ] All chart tabs work
- [ ] Settings toggle works
- [ ] Responsive on mobile devices
- [ ] No console errors

## API Testing
- [ ] Health check endpoint works: http://localhost:5000/api/health
- [ ] Weather data is cached (check server logs for cache hits)
- [ ] Multiple cities load without rate limiting issues
- [ ] Data refreshes after 60 seconds

## Security
- [ ] `.env` file in `.gitignore`
- [ ] No API keys in code files
- [ ] httpOnly cookies configured
- [ ] CORS properly configured
- [ ] JWT token generation working

## Documentation
- [ ] Read README.md
- [ ] Read SETUP.md for detailed instructions
- [ ] Read QUICKSTART.md for quick setup
- [ ] Read PROJECT_OVERVIEW.md for architecture
- [ ] Read ENV_SETUP.md for environment variables

## Optional Enhancements
- [ ] Custom theme colors configured
- [ ] Additional cities added as favorites
- [ ] All chart types explored
- [ ] Different weather conditions tested
- [ ] Mobile view tested

## Troubleshooting Common Issues
If anything is checked ❌, refer to:

### MongoDB Connection Issues
- [ ] MongoDB service is running
- [ ] Connection string is correct
- [ ] Database permissions are set

### API Key Issues
- [ ] Keys copied correctly (no spaces)
- [ ] Keys activated (OpenWeatherMap)
- [ ] OAuth redirect URI matches exactly

### Port Issues
- [ ] Ports 3000 and 5000 are available
- [ ] Firewall allows connections
- [ ] No other apps using these ports

### Authentication Issues
- [ ] Google+ API is enabled
- [ ] OAuth credentials are correct
- [ ] Redirect URI configured in Google Console

### Data Not Loading
- [ ] Network tab shows API calls
- [ ] Server logs show no errors
- [ ] Cache is working (check logs)
- [ ] API rate limits not exceeded

## Success Criteria
Your app is ready when:
- ✅ All critical features work
- ✅ No console errors
- ✅ User can log in
- ✅ Weather data displays correctly
- ✅ Charts are interactive
- ✅ Data caches properly
- ✅ UI is responsive

## Next Steps After Setup
1. Explore all features
2. Test with multiple cities
3. Check different weather conditions
4. Test on mobile devices
5. Consider customizations:
   - Add more charts
   - Customize theme
   - Add additional data points
   - Enhance UI components

## Getting Help
If you're stuck:
1. Check error messages carefully
2. Review server logs
3. Check browser console
4. Verify all environment variables
5. Ensure all dependencies installed
6. Check API key status
7. Review documentation files

---

**Status:** ⬜ Not Started | 🔄 In Progress | ✅ Complete | ❌ Failed

Current Status: _________________

