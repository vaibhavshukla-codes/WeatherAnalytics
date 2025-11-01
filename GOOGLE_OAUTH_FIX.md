# 🔧 Fix Google OAuth Redirect URI Mismatch

## The Problem

**Error 400: redirect_uri_mismatch**

This means the redirect URI in your code doesn't match what's configured in Google Cloud Console.

## ✅ Solution

### Step 1: Check Your Current Callback URL

Your server is configured to use:
```
http://localhost:5001/api/auth/google/callback
```

### Step 2: Update Google Cloud Console

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/apis/credentials
   
2. **Click on your OAuth 2.0 Client ID:**
   - Look for "Web client 1" or your OAuth client name
   - Click on it to edit

3. **Check/Update Authorized redirect URIs:**
   - Find the section "Authorized redirect URIs"
   - Make sure this EXACT URL is listed:
   ```
   http://localhost:5001/api/auth/google/callback
   ```

4. **Important Notes:**
   - The URL must match EXACTLY (including http, localhost, port 5001, and path)
   - No trailing slashes
   - Case-sensitive
   - Must be `http://` not `https://` for localhost

5. **Save Changes:**
   - Click "Save" at the bottom
   - Wait a few seconds for changes to propagate

### Step 3: If Frontend is on Different Port

If your frontend runs on port 3001 instead of 3000, you may also need:
```
http://localhost:3001
```
in the "Authorized JavaScript origins" section (optional for development).

### Step 4: Restart Your Server

After updating Google Cloud Console:
```bash
# Stop server (Ctrl+C)
# Then restart
cd server
npm run dev
```

### Step 5: Try Sign In Again

1. Go to http://localhost:3001 (or 3000)
2. Click "Sign in with Google"
3. It should work now!

## 🔍 Verification Checklist

- [ ] Port 5001 is correct in server/.env (PORT=5001)
- [ ] Redirect URI in Google Console matches: `http://localhost:5001/api/auth/google/callback`
- [ ] No trailing slashes
- [ ] Using `http://` not `https://`
- [ ] Changes saved in Google Cloud Console
- [ ] Server restarted after changes

## 📝 Current Configuration

**Backend Port:** 5001
**Callback URL:** `http://localhost:5001/api/auth/google/callback`
**Frontend:** `http://localhost:3001` or `http://localhost:3000`

## ⚠️ Common Mistakes

1. **Wrong Port:** Using 5000 instead of 5001
2. **Trailing Slash:** `http://localhost:5001/api/auth/google/callback/` ❌
3. **HTTPS:** `https://localhost:5001/...` ❌ (use http for localhost)
4. **Wrong Path:** Missing `/api/auth/google/callback`
5. **Not Saving:** Forgetting to click "Save" in Google Console

## 🎯 Quick Fix

**The exact URL to add in Google Cloud Console:**
```
http://localhost:5001/api/auth/google/callback
```

Copy and paste this EXACTLY in "Authorized redirect URIs".

