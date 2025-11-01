# 🚀 Start Your Weather Analytics Dashboard

## ✅ Everything is Configured and Ready!

Your project is **100% ready** to run. All credentials are configured:
- ✅ MongoDB Atlas connected
- ✅ OpenWeatherMap API key set
- ✅ Google OAuth configured
- ✅ All dependencies installed

## 🎯 Start the Application (2 commands)

### Option 1: Start Both Servers Together (Recommended)

```bash
npm run dev
```

This will start:
- Backend server on **http://localhost:5000**
- Frontend app on **http://localhost:3000**

### Option 2: Start Separately (2 terminals)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

## 🌐 Access the Application

Once started, open your browser to:

**http://localhost:3000**

## 🎉 First Steps

1. **You'll see the login page**
2. **Click "Sign in with Google"**
3. **Complete Google OAuth flow**
4. **You'll be redirected to the dashboard**
5. **Click the "+" button (bottom right) to add cities**
6. **Search and add your first city**
7. **Click on city cards to see detailed analytics**

## 📊 What You Can Do

- ✅ Add multiple cities to your dashboard
- ✅ View current weather conditions
- ✅ See 24-hour hourly forecasts
- ✅ View 5-day daily forecasts
- ✅ Explore interactive charts:
   - Temperature trends
   - Precipitation patterns
   - Wind speed and direction
- ✅ Toggle between Celsius/Fahrenheit
- ✅ Search cities with autocomplete
- ✅ Manage favorites

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Error
- Check MongoDB Atlas network access
- Verify connection string in `server/.env`
- Ensure your IP is whitelisted (or use 0.0.0.0/0 for dev)

### Google OAuth Not Working
- Verify redirect URI is: `http://localhost:5000/api/auth/google/callback`
- Check Client ID and Secret in `server/.env`
- Ensure Google+ API is enabled

### Weather Data Not Loading
- OpenWeatherMap keys take 2-10 minutes to activate
- Check browser console for errors
- Verify API key in `server/.env`

### Dependencies Issues
```bash
# Reinstall dependencies
rm -rf node_modules server/node_modules client/node_modules
./setup.sh
```

## 📝 Server Logs

Watch for these messages:

**Backend:**
- ✅ MongoDB Connected
- 🚀 Server running on port 5000

**Frontend:**
- Compiled successfully!
- Local: http://localhost:3000

## ✅ Success Indicators

You'll know it's working when:
- ✅ Both servers start without errors
- ✅ Can access http://localhost:3000
- ✅ Login page displays
- ✅ Google OAuth works
- ✅ Can add cities
- ✅ Weather data displays
- ✅ Charts render properly

## 🎊 You're Ready!

Everything is configured. Just run:

```bash
npm run dev
```

And open **http://localhost:3000**!

---

**Enjoy your Weather Analytics Dashboard! 🌦✨**

