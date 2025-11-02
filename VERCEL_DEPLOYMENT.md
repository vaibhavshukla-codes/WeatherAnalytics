# 🚀 Complete Vercel Deployment Guide

## Your Backend URL
**Render Backend:** `https://weather-analytics-api-xsyq.onrender.com`

---

## 📋 Step-by-Step Deployment

### Step 1: Go to Vercel

1. Go to: https://vercel.com
2. Sign in with GitHub
3. Click **"Add New"** → **"Project"**
4. Import your `WeatherAnalytics` repository

### Step 2: Configure Project Settings

In the configuration page, set:

✅ **Project Name:** `weather-analytics` (already set)

✅ **Framework Preset:** `Create React App` (already set)

✅ **Root Directory:** `client` (already set)
   - This tells Vercel to look in the `client/` folder

✅ **Build Command:** `npm run build` (ENABLED)
   - Toggle should be ON (blue)

✅ **Output Directory:** `build` (ENABLED)
   - Toggle should be ON (blue)

✅ **Install Command:** Leave as default (auto-detected)

### Step 3: Add Environment Variable (CRITICAL!)

This connects your frontend to your Render backend:

1. Scroll to **"Environment Variables"** section
2. Click **"+ Add More"**
3. Add this exact variable:

   **Key:** `REACT_APP_API_URL`
   
   **Value:** `https://weather-analytics-api-xsyq.onrender.com/api`

4. Make sure it's enabled for:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

### Step 4: Deploy!

1. Scroll to bottom
2. Click **"Deploy"** button
3. Wait 2-3 minutes for build

You'll see build logs and get a URL like:
```
https://weather-analytics-xyz.vercel.app
```

### Step 5: Update Google OAuth

After deployment, add your Vercel URL to Google OAuth:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth Client ID
3. Under **"Authorized redirect URIs"**, click **"+ Add URI"**
4. Add: `https://YOUR-VERCEL-URL.vercel.app/api/auth/google/callback`
5. Under **"Authorized JavaScript origins"**, click **"+ Add URI"**
6. Add: `https://YOUR-VERCEL-URL.vercel.app`
7. Click **"SAVE"**

---

## ✅ Verification

After deployment:

1. **Visit your Vercel URL** in browser
2. **Click "Sign in with Google"**
3. **Test adding a city** to verify API connection

If login works and weather data loads → Success! 🎉

---

## 🔧 Troubleshooting

### Build Fails

**Error:** "Module not found"
- ✅ Make sure Root Directory is `client`
- ✅ Make sure Build Command is `npm run build`

**Error:** "Environment variable not found"
- ✅ Double-check `REACT_APP_API_URL` is set exactly as shown
- ✅ Make sure it's enabled for Production environment

### OAuth Doesn't Work

**Error:** "redirect_uri_mismatch"
- ✅ Make sure you added the Vercel URL to Google Cloud Console
- ✅ URL must match exactly (including `/api/auth/google/callback`)
- ✅ Wait 2-3 minutes after saving for changes to propagate

### API Calls Fail

**Error:** CORS or connection errors
- ✅ Verify backend URL in environment variable is correct
- ✅ Make sure backend is running on Render
- ✅ Check Render logs to ensure backend is healthy

---

## 📋 Quick Checklist

Before deploying:
- [ ] Root Directory: `client`
- [ ] Build Command: `npm run build` (enabled)
- [ ] Output Directory: `build` (enabled)
- [ ] Environment Variable: `REACT_APP_API_URL` = `https://weather-analytics-api-xsyq.onrender.com/api`

After deploying:
- [ ] Note your Vercel URL
- [ ] Add Vercel URL to Google OAuth redirect URIs
- [ ] Test login
- [ ] Test weather data loading

---

## 🎉 Success!

Once deployed, your app will be accessible from:
- ✅ Any device
- ✅ Any network
- ✅ Anywhere in the world

**Permanent URL:** `https://weather-analytics-xyz.vercel.app`

---

## 📞 Need Help?

If deployment fails:
1. Check build logs in Vercel dashboard
2. Verify all settings match this guide
3. Make sure code is pushed to GitHub
4. Check backend is running on Render

