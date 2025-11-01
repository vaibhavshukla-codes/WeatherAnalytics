# 🚀 Render Deployment Guide - Weather Analytics Dashboard

This guide will help you fix the deployment issues on Render.

## 🔧 Issues Fixed

1. ✅ **OAuth Callback URL** - Now auto-detects production URL
2. ✅ **MongoDB Connection** - Better error handling and IP whitelist instructions
3. ✅ **Proxy Settings** - Enabled for Render's reverse proxy
4. ✅ **TLS/SSL** - Removed insecure settings in production

---

## 📋 Step 1: MongoDB Atlas IP Whitelisting (CRITICAL)

The main error you're seeing is MongoDB connection failure due to IP whitelisting.

### Fix MongoDB Atlas IP Whitelist:

1. **Go to MongoDB Atlas:**
   - Visit: https://cloud.mongodb.com
   - Sign in to your account

2. **Navigate to Network Access:**
   - Click on your cluster
   - Go to **Security** → **Network Access**
   - Or direct link: https://cloud.mongodb.com/security/network

3. **Add IP Address:**
   - Click **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** 
   - This adds `0.0.0.0/0` which allows all IPs
   - **Click "Confirm"**
   - Wait 1-2 minutes for changes to propagate

   ⚠️ **Note:** For production, you can be more specific, but `0.0.0.0/0` works for Render.

---

## 📋 Step 2: Set Environment Variables in Render

1. **Go to your Render Dashboard:**
   - Visit: https://dashboard.render.com
   - Click on your service (e.g., `weather-analytics-api`)

2. **Navigate to Environment:**
   - Click **"Environment"** in the left sidebar
   - Or go to: Settings → Environment

3. **Add/Update these variables:**

```env
# Required - Replace with your actual values
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weather-analytics?retryWrites=true&w=majority
JWT_SECRET=your-jwt-secret-key-here
WEATHER_API_KEY=your-openweathermap-api-key-here
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# New - Production Settings
NODE_ENV=production
PORT=10000

# Frontend URL (update when you deploy frontend)
CLIENT_URL=https://your-frontend-url.vercel.app

# OAuth Callback URL (optional - will auto-detect if not set)
CALLBACK_URL=https://your-backend-service.onrender.com/api/auth/google/callback
```

4. **Save Changes** - Render will automatically redeploy

---

## 📋 Step 3: Update Google OAuth Redirect URI

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/apis/credentials
   - Select your project

2. **Edit OAuth 2.0 Client:**
   - Click on your OAuth 2.0 Client ID
   - Scroll to **"Authorized redirect URIs"**

3. **Add Production Callback URL:**
   ```
   https://your-backend-service.onrender.com/api/auth/google/callback
   ```

4. **Also add to Authorized JavaScript origins:**
   ```
   https://your-backend-service.onrender.com
   ```

5. **Save** and wait 1-2 minutes

---

## 📋 Step 4: Verify Deployment

After saving environment variables, Render will automatically redeploy.

### Check Logs:
1. Go to your Render service dashboard
2. Click **"Logs"** tab
3. Look for:
   - ✅ `MongoDB Connected`
   - ✅ `Server running on port 10000`
   - ✅ `OAuth Configuration: Callback URL: https://your-backend-service.onrender.com/...`

### Test the API:
```bash
# Test if server is running (replace with your actual Render URL)
curl https://your-backend-service.onrender.com/api/auth/me

# Should return 401 (unauthorized) which means server is working!
```

---

## 🔍 Troubleshooting

### Issue: MongoDB Still Not Connecting

**Check:**
1. ✅ IP whitelist includes `0.0.0.0/0` or Render's IP ranges
2. ✅ MongoDB URI is correct in Render environment variables
3. ✅ Username/password in URI are correct
4. ✅ Database name exists: `weather-analytics`

**Test MongoDB URI locally:**
```bash
# Try connecting from your local machine
# Replace with your actual MongoDB connection string
mongosh "mongodb+srv://username:password@cluster.mongodb.net/weather-analytics"
```

### Issue: OAuth Still Failing

**Check:**
1. ✅ `CALLBACK_URL` environment variable is set correctly
2. ✅ Google Cloud Console has the exact callback URL
3. ✅ `proxy: true` is enabled in passport strategy (code updated)
4. ✅ Server logs show correct callback URL

### Issue: TLS/SSL Warnings

The code now only disables TLS rejection in development. In production (`NODE_ENV=production`), TLS is properly validated.

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] MongoDB connects successfully (check logs)
- [ ] Server starts without errors
- [ ] OAuth callback URL is correct in logs
- [ ] Google OAuth redirect URI added to Google Cloud Console
- [ ] All environment variables are set in Render
- [ ] API responds to requests (even if 401)
- [ ] No TLS/SSL warnings in production logs

---

## 🚀 Next Steps (Frontend Deployment)

Once backend is working:

1. **Deploy Frontend to Vercel:**
   - Push code to GitHub
   - Import to Vercel
   - Set `REACT_APP_API_URL=https://your-backend-service.onrender.com/api`
   - Deploy!

2. **Update Environment Variables:**
   - In Render, set `CLIENT_URL` to your Vercel frontend URL
   - This enables proper redirects after OAuth

3. **Update Google OAuth:**
   - Add Vercel frontend URL to Authorized JavaScript origins

---

## 📞 Still Having Issues?

If MongoDB still won't connect:

1. **Check MongoDB Atlas Logs:**
   - Go to: https://cloud.mongodb.com
   - Click **"Logs"** in left sidebar
   - Look for connection attempts

2. **Verify Database User:**
   - Go to: Security → Database Access
   - Ensure user has read/write permissions
   - Password is correct

3. **Test Connection String:**
   - Try connecting with MongoDB Compass
   - Or use `mongosh` command line
   - This verifies the connection string works

---

**After following these steps, your backend should be fully functional! 🎉**

