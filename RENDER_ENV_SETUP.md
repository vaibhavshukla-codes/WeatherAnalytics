# 🔧 Render Environment Variables Setup

## ⚠️ CRITICAL: Required Environment Variables

You MUST set these in your Render dashboard for production deployment:

### 1. Open Render Dashboard
- Go to: https://dashboard.render.com
- Click on your service: `weather-analytics-api-xsyq`
- Go to **Environment** tab

### 2. Add/Update These Variables:

```env
# CRITICAL - Set this first!
NODE_ENV=production

# OAuth Callback URL (REQUIRED)
CALLBACK_URL=https://weather-analytics-api-xsyq.onrender.com/api/auth/google/callback

# Your MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weather-analytics?retryWrites=true&w=majority

# Your API Keys
JWT_SECRET=your-jwt-secret-here
WEATHER_API_KEY=your-openweathermap-api-key
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL (when you deploy frontend)
CLIENT_URL=https://your-frontend-url.vercel.app

# Server Port (Render sets this automatically, but you can override)
PORT=10000
```

### 3. Most Important Variables:

1. **NODE_ENV=production** - Makes the app run in production mode
2. **CALLBACK_URL** - Your Render service URL + `/api/auth/google/callback`
   ```
   https://weather-analytics-api-xsyq.onrender.com/api/auth/google/callback
   ```

### 4. After Setting Variables:

1. **Save** the environment variables
2. Render will **automatically redeploy**
3. Wait for deployment to complete
4. Check logs to verify:
   - `Environment: production (Render)`
   - `Callback URL: https://weather-analytics-api-xsyq.onrender.com/api/auth/google/callback`

---

## 🗄️ MongoDB Atlas IP Whitelist (CRITICAL)

### Why This is Needed:
Render's servers need to connect to your MongoDB Atlas database. MongoDB Atlas blocks connections from IPs not on the whitelist.

### How to Fix:

1. **Go to MongoDB Atlas:**
   - Visit: https://cloud.mongodb.com
   - Sign in to your account

2. **Navigate to Network Access:**
   - Click on your cluster
   - Go to **Security** → **Network Access**
   - Or direct link: https://cloud.mongodb.com/security/network

3. **Add IP Address:**
   - Click **"Add IP Address"** button
   - Click **"Allow Access from Anywhere"** 
   - This adds `0.0.0.0/0` which allows all IPs
   - **Click "Confirm"**
   - **Wait 1-2 minutes** for changes to propagate

   ⚠️ **Note:** While `0.0.0.0/0` is less secure, it's necessary for Render deployment since Render uses dynamic IPs.

4. **Verify Connection:**
   - After whitelisting, check Render logs
   - You should see: `✅ MongoDB Connected`

---

## ✅ Verification Checklist

After setting environment variables:

- [ ] `NODE_ENV=production` is set
- [ ] `CALLBACK_URL` is set to your Render URL + `/api/auth/google/callback`
- [ ] All API keys are set (MongoDB, Weather, Google OAuth, JWT)
- [ ] MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- [ ] Render has automatically redeployed
- [ ] Server logs show correct callback URL (not localhost)
- [ ] Server logs show `Environment: production (Render)`
- [ ] MongoDB connection successful in logs

---

## 🐛 Troubleshooting

### Issue: Callback URL still shows localhost
**Fix:** Set `CALLBACK_URL` environment variable explicitly in Render

### Issue: Environment shows "development"
**Fix:** Set `NODE_ENV=production` in Render environment variables

### Issue: MongoDB connection fails
**Fix:** 
1. Whitelist IP `0.0.0.0/0` in MongoDB Atlas Network Access
2. Wait 1-2 minutes for changes to propagate
3. Check MongoDB URI is correct

### Issue: OAuth still doesn't work
**Fix:**
1. Verify `CALLBACK_URL` matches exactly what's in Google Cloud Console
2. Update Google OAuth redirect URI to match Render URL
3. Check that all environment variables are set correctly

---

**After following these steps, your Render deployment should work correctly! 🚀**

