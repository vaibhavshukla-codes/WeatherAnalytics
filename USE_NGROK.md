# 🌍 Use Ngrok for Internet Access (Any Network)

## Why Ngrok?

**Problem:** `localhost` only works on the same device. To access from ANY network, you need a public URL.

**Solution:** Ngrok creates a public HTTPS URL that tunnels to your localhost.

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Ngrok

**macOS:**
```bash
brew install ngrok
```

**Or download:**
- Visit: https://ngrok.com/download
- Download for your OS
- Unzip and add to PATH

**Windows/Linux:**
```bash
# Download from https://ngrok.com/download
# Extract and run
```

### Step 2: Sign Up (Free)

1. Go to: https://dashboard.ngrok.com/signup
2. Create free account
3. Get your auth token

### Step 3: Authenticate

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### Step 4: Start Your App

```bash
npm run dev
```

### Step 5: Create Tunnel

**In a NEW terminal:**
```bash
ngrok http 3001
```

You'll see:
```
Forwarding: https://abc123def456.ngrok.io -> http://localhost:3001
```

### Step 6: Access from Anywhere!

**Copy the https:// URL** and share with anyone:
- From any phone: https://abc123def456.ngrok.io
- From any computer: https://abc123def456.ngrok.io
- From any network: https://abc123def456.ngrok.io

---

## ⚠️ Important: Update Google OAuth

Since your URL will be different, add it to Google Cloud Console:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth Client ID
3. Add to **Authorized redirect URIs**:
   ```
   https://abc123def456.ngrok.io/api/auth/google/callback
   ```
4. Add to **Authorized JavaScript origins**:
   ```
   https://abc123def456.ngrok.io
   ```
5. Click **SAVE**

---

## 🎯 Pro Tips

### Keep Same URL (Paid)

Free Ngrok URLs change each restart. For permanent URL:
- Upgrade to paid plan ($8/month)
- Or use free alternatives: Cloudflare Tunnel, LocalTunnel

### Use Custom Domain (Free Alternatives)

**LocalTunnel (Free, no signup):**
```bash
npm install -g localtunnel
lt --port 3001 --subdomain weather-analytics
```

**Cloudflare Tunnel (Free):**
```bash
brew install cloudflare/cloudflare/cloudflared
cloudflared tunnel --url http://localhost:3001
```

---

## 📋 Quick Start Command

```bash
# Terminal 1: Start servers
npm run dev

# Terminal 2: Start Ngrok
ngrok http 3001

# Copy the https:// URL and use it anywhere!
```

---

## ✅ Summary

**For Same Network (Free):**
- Use: http://192.168.31.223:3001

**For Any Network (Free):**
- Use: Ngrok → https://abc123.ngrok.io

**For Production (Permanent):**
- Deploy to Vercel/Netlify

