# 🚀 Deployment Guide

## Quick Deployment Checklist

### ✅ Pre-Deployment Checklist

- [x] All bugs fixed
- [x] Security hardened (CORS, tokens)
- [x] Production logging configured
- [x] Environment variables documented
- [x] Build scripts verified
- [x] Database connection tested

---

## 📋 Environment Variables

### Backend (Render)

Set these in **Render Dashboard → Environment Variables**:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
WEATHER_API_KEY=your_openweathermap_api_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
CLIENT_URL=https://your-vercel-frontend.vercel.app
CALLBACK_URL=https://your-render-backend.onrender.com/api/auth/google/callback
```

### Frontend (Vercel)

Set these in **Vercel Dashboard → Settings → Environment Variables**:

```env
REACT_APP_API_URL=https://your-render-backend.onrender.com/api
```

---

## 🎯 Deploy Backend to Render

1. **Connect GitHub Repository**
   - Go to https://dashboard.render.com
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `weather-analytics-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (or `npm run production`)

3. **Set Environment Variables**
   - Add all backend env vars listed above
   - **Important**: Set `CALLBACK_URL` to: `https://[your-service-name].onrender.com/api/auth/google/callback`

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete
   - Copy the service URL (e.g., `https://weather-analytics-api-xsyq.onrender.com`)

---

## 🎯 Deploy Frontend to Vercel

1. **Connect GitHub Repository**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project**
   - **Root Directory**: `client`
   - **Framework Preset**: `Create React App`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

3. **Set Environment Variables**
   - Add: `REACT_APP_API_URL=https://[your-render-backend].onrender.com/api`
   - Replace `[your-render-backend]` with your actual Render URL

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Copy your Vercel URL

---

## 🔧 Post-Deployment Steps

### 1. Update Google OAuth Redirect URI

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Click on your OAuth 2.0 Client ID
3. Add authorized redirect URI:
   ```
   https://[your-render-backend].onrender.com/api/auth/google/callback
   ```
4. Save changes

### 2. Update Render Environment Variables

If you didn't set `CLIENT_URL` during setup:
1. Go to Render Dashboard → Your Service → Environment
2. Add: `CLIENT_URL=https://[your-vercel-frontend].vercel.app`
3. Save and redeploy

### 3. Verify MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to: **Security → Network Access**
3. Ensure `0.0.0.0/0` is whitelisted (allows Render access)
4. If not, click "Add IP Address" → "Allow Access from Anywhere"

---

## 🧪 Testing Deployment

### Test Backend
```bash
curl https://[your-render-backend].onrender.com/api/health
```
Should return: `{"status":"OK",...}`

### Test Frontend
1. Visit your Vercel URL
2. Click "Sign in with Google"
3. Complete OAuth flow
4. Should redirect to dashboard ✅

### Common Issues

**Issue**: `CORS blocked origin`
- **Fix**: Ensure `CLIENT_URL` in Render matches your Vercel URL exactly

**Issue**: `OAuth redirect_uri_mismatch`
- **Fix**: Add exact callback URL to Google Cloud Console

**Issue**: `MongoDB connection timeout`
- **Fix**: Whitelist `0.0.0.0/0` in MongoDB Atlas

---

## 📊 Monitoring

### Render Logs
- View logs: Render Dashboard → Your Service → Logs
- Check for errors: Look for red error messages

### Vercel Logs
- View logs: Vercel Dashboard → Your Project → Deployments → [Deployment] → Logs

---

## 🔄 Redeploy

### Backend (Render)
- Automatic on git push to main branch
- Or manually: Render Dashboard → Manual Deploy

### Frontend (Vercel)
- Automatic on git push to main branch
- Or manually: Vercel Dashboard → Deployments → Redeploy

---

## ✅ Deployment Complete!

Once deployed:
- ✅ Backend: `https://[your-backend].onrender.com`
- ✅ Frontend: `https://[your-frontend].vercel.app`
- ✅ OAuth: Configured
- ✅ Database: Connected
- ✅ API: Working

Your Weather Analytics Dashboard is now live! 🎉

