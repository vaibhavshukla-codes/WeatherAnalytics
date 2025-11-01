# Quick Start Guide

Get your Weather Analytics Dashboard up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
# Run the setup script
chmod +x setup.sh
./setup.sh
```

This will install all dependencies for both frontend and backend.

## Step 2: Get Your API Keys

### OpenWeatherMap (Required)
1. Go to https://openweathermap.org/api
2. Click "Sign Up" (it's free!)
3. Once logged in, go to API keys
4. Copy your default API key

### Google OAuth (Required for Login)
1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable Google+ API in the API Library
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Choose "Web application"
6. Add Authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
7. Copy the Client ID and Client Secret

## Step 3: Configure Environment

```bash
cp server/.env.example server/.env
```

Then edit `server/.env` and add your keys:

```env
MONGODB_URI=mongodb://localhost:27017/weather-analytics
JWT_SECRET=your-random-secret-string-here
WEATHER_API_KEY=paste-your-openweather-key-here
GOOGLE_CLIENT_ID=paste-your-google-client-id-here
GOOGLE_CLIENT_SECRET=paste-your-google-client-secret-here
PORT=5000
CLIENT_URL=http://localhost:3000
```

**Tip:** Generate a random JWT_SECRET using: `openssl rand -hex 32`

## Step 4: Start MongoDB

Choose one option:

### Option A: Local MongoDB
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows (in PowerShell as Admin)
net start MongoDB
```

### Option B: MongoDB Atlas (Cloud)
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Replace MONGODB_URI in .env with your Atlas connection string

## Step 5: Run the App

```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 3000).

## Step 6: Open Your Browser

Go to: http://localhost:3000

You should see the login page. Click "Sign in with Google" to continue!

## What's Next?

1. ✅ Sign in with your Google account
2. ✅ Click the "+" button to add cities
3. ✅ Search and add your first city
4. ✅ Click on the city card to see detailed analytics
5. ✅ Explore the charts and forecasts!

## Troubleshooting

### "MongoDB connection error"
- Make sure MongoDB is running: `brew services list` (macOS)
- Check your MONGODB_URI in .env
- Try connecting with MongoDB Compass

### "Invalid API key"
- Verify your OpenWeatherMap API key is activated
- Check you copied it correctly (no spaces)
- Wait a few minutes after creating the key

### "Google OAuth error"
- Check redirect URI matches exactly
- Verify Google+ API is enabled
- Double-check Client ID and Secret

### Port already in use
```bash
# Kill the process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change the port in .env
PORT=5001
```

## Need Help?

Check out the detailed [SETUP.md](SETUP.md) file for more information.

## API Rate Limits

OpenWeatherMap free tier:
- 60 calls/minute
- 1,000,000 calls/month

The app includes 60-second caching to help stay within limits!

