# 🚀 Complete Setup Guide - Everything You Need

## Quick Answer: What's Needed?

The **code is 100% complete**. You just need:

1. **Install dependencies** (5 min)
2. **Set up MongoDB** (10 min) 
3. **Get API keys** (15 min)
4. **Configure environment** (5 min)
5. **Run the app** (1 min)

**Total time: ~35 minutes**

---

## 📦 1. Dependencies Installation

```bash
./setup.sh
```

Or manually:
```bash
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

---

## 🗄️ 2. MongoDB Setup

**Easy Option: MongoDB Atlas (Cloud)**
1. Sign up: https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Done!

**Local Option:**
```bash
brew services start mongodb-community  # macOS
# OR download from mongodb.com
```

---

## 🔑 3. API Keys (Required)

### OpenWeatherMap (Free)
1. Sign up: https://openweathermap.org/api
2. Get API key from dashboard
3. Wait 2-10 min for activation

### Google OAuth (Free)
1. Go to: https://console.cloud.google.com
2. Create project
3. Enable Google+ API
4. Create OAuth credentials
5. Set redirect: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID & Secret

---

## ⚙️ 4. Environment Configuration

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/weather-analytics
JWT_SECRET=generate-random-string-here
WEATHER_API_KEY=your-openweather-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
PORT=5000
CLIENT_URL=http://localhost:3000
```

---

## ▶️ 5. Run!

```bash
npm run dev
```

Open: http://localhost:3000

---

## ✅ Verification Checklist

- [ ] Dependencies installed
- [ ] MongoDB running/accessible
- [ ] OpenWeatherMap API key obtained
- [ ] Google OAuth configured
- [ ] `.env` file created and filled
- [ ] Servers start successfully
- [ ] Can log in
- [ ] Weather data loads

---

**That's it! Everything else is ready!** 🎉

