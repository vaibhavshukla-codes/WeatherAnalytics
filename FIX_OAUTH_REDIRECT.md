# 🔧 Fix: OAuth redirect_uri_mismatch Error

## Problem
You're seeing this error after clicking "Sign in with Google":
```
Error 400: redirect_uri_mismatch
Access blocked: WeatherAnalytics's request is invalid
```

## Cause
The callback URL your application is sending to Google doesn't match any of the URLs authorized in Google Cloud Console.

## Solution

### Step 1: Get Your Callback URL

Your Render backend URL is: `https://weather-analytics-api-xsyq.onrender.com`

So your callback URL is:
```
https://weather-analytics-api-xsyq.onrender.com/api/auth/google/callback
```

### Step 2: Add to Google Cloud Console

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/apis/credentials
   - Make sure you're in the correct project

2. **Open Your OAuth 2.0 Client**
   - Click on your OAuth 2.0 Client ID
   - Your Client ID starts with: `288586260737-...`

3. **Add Redirect URIs**
   - Scroll down to **"Authorized redirect URIs"**
   - Click **"+ ADD URI"**
   - Add **BOTH** of these URLs:

   **For Production (Render):**
   ```
   https://weather-analytics-api-xsyq.onrender.com/api/auth/google/callback
   ```

   **For Local Development (optional, if you test locally):**
   ```
   http://localhost:5001/api/auth/google/callback
   ```

4. **Save Changes**
   - Click **"SAVE"** at the bottom
   - Wait 1-2 minutes for changes to propagate

### Step 3: Verify Render Environment Variable

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Open your service: `weather-analytics-api-xsyq`

2. **Check Environment Variables**
   - Go to: **Environment** tab
   - Look for `CALLBACK_URL`

3. **Add/Update CALLBACK_URL**
   - If missing, add it:
     - **Key**: `CALLBACK_URL`
     - **Value**: `https://weather-analytics-api-xsyq.onrender.com/api/auth/google/callback`
   - Click **Save Changes**

4. **Redeploy** (if you added/updated the variable)
   - Go to **Manual Deploy** → **Deploy latest commit**

### Step 4: Test Again

1. Wait 1-2 minutes after saving Google Console changes
2. Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
3. Try signing in again
4. Should work now! ✅

## Important Notes

⚠️ **URL Must Match Exactly:**
- Case-sensitive
- Must include the full path: `/api/auth/google/callback`
- Must use HTTPS for production (not HTTP)
- No trailing slashes

⚠️ **Wait Time:**
- Google Console changes can take 1-2 minutes to propagate
- Be patient and wait before testing again

⚠️ **Both URLs Needed:**
- Production URL (Render)
- Local development URL (if testing locally)

## Verification

After adding the URL, verify it's listed in Google Cloud Console:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth 2.0 Client ID
3. Check "Authorized redirect URIs" section
4. You should see:
   - ✅ `https://weather-analytics-api-xsyq.onrender.com/api/auth/google/callback`
   - ✅ `http://localhost:5001/api/auth/google/callback` (if added)

## Still Not Working?

If you still get the error:

1. **Double-check the URL spelling** - Must be exact
2. **Check Render logs** - View logs in Render dashboard for the exact callback URL being used
3. **Verify environment variables** - Make sure `CALLBACK_URL` is set correctly in Render
4. **Wait longer** - Sometimes Google takes 3-5 minutes to update

## Quick Checklist

- [ ] Added callback URL to Google Cloud Console
- [ ] Set `CALLBACK_URL` in Render environment variables
- [ ] Saved changes in both places
- [ ] Waited 1-2 minutes
- [ ] Cleared browser cache
- [ ] Tried signing in again

