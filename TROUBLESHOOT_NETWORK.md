# 🔧 Network Access Troubleshooting Guide

## ⚠️ "This site can't be reached" on Other Devices

### Step 1: Verify Servers Are Running

```bash
# Start servers
npm run dev
```

**Expected output:**
- Backend: `🚀 Server running on http://localhost:5001`
- Frontend: `Compiled successfully!` and shows localhost URL

**If servers aren't running:**
- Fix any errors shown in terminal
- Make sure ports 3001 and 5001 are not in use

---

### Step 2: Verify Your IP Address

```bash
npm run network-info
```

**Your IP should show as:** `192.168.31.223` (or similar)

**If IP changed or can't find it:**
- Your computer may have gotten a new IP from router
- Run the command again to get current IP

---

### Step 3: Use the CORRECT URL

❌ **DON'T USE:** `http://localhost:3001` (this only works on same device)

✅ **USE:** `http://192.168.31.223:3001` (your actual IP)

**On other device:**
1. Open browser
2. Type: `http://192.168.31.223:3001`
3. Should load!

---

### Step 4: Check Firewall (macOS)

**System Preferences → Security → Firewall:**

1. Click "Firewall Options"
2. Make sure "Block all incoming connections" is **OFF**
3. Allow incoming connections for `node` if listed

**Or temporarily disable firewall:**
```bash
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off
```

**Enable it back:**
```bash
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on
```

---

### Step 5: Verify Same WiFi Network

**Requirements:**
- ✅ Your computer on WiFi
- ✅ Other device on **SAME WiFi**
- ✅ Not on guest network
- ✅ Not on different network

**Check:**
- Phone WiFi name should match computer WiFi name
- Both devices should show same router IP (192.168.x.x range)

---

### Step 6: Test Backend Connection

**On other device, try accessing backend directly:**
```
http://192.168.31.223:5001/api/health
```

**Should return:**
```json
{"status":"OK","message":"Weather Analytics API is running"}
```

**If this works but frontend doesn't:**
- Frontend might not be binding correctly
- Restart frontend: `cd client && npm start`

---

### Step 7: Check Server Logs

**When you start servers, look for:**

✅ **Backend should show:**
```
🚀 Server running on http://localhost:5001
🌐 Network access: http://[YOUR_IP]:5001
```

✅ **Frontend should show:**
```
Compiled successfully!
Local:            http://localhost:3001
On Your Network:  http://192.168.31.223:3001
```

**If you see "On Your Network" URL, that's your IP!**

---

### Step 8: Common Issues

**Issue 1: "Connection Refused"**
- ✅ Servers not running → Start with `npm run dev`
- ✅ Firewall blocking → Disable or allow ports
- ✅ Wrong IP → Get current IP with `npm run network-info`

**Issue 2: "Can't connect"**
- ✅ Different WiFi → Use same WiFi network
- ✅ Guest network isolation → Use main network
- ✅ Router blocking → Check router settings

**Issue 3: Page loads but API calls fail**
- ✅ CORS issue → Should be fixed, but check backend logs
- ✅ Backend not accessible → Test backend health endpoint

---

### Step 9: Alternative: Use Vercel Deployment

If local network access doesn't work:

1. **Use your Vercel deployment:**
   ```
   https://your-app.vercel.app
   ```

2. **Works from anywhere:**
   - ✅ Any device
   - ✅ Any network
   - ✅ No firewall issues
   - ✅ No IP address needed

---

### Quick Checklist

Before asking for help, verify:

- [ ] Servers are running (`npm run dev`)
- [ ] Got current IP (`npm run network-info`)
- [ ] Using IP address, not localhost
- [ ] Other device on same WiFi
- [ ] Firewall allows ports 3001 and 5001
- [ ] Testing `http://192.168.31.223:3001` (not localhost)
- [ ] Backend health check works from other device

---

### Still Not Working?

**Run diagnostic:**
```bash
# Check if servers are listening on 0.0.0.0
lsof -i :3001
lsof -i :5001

# Should show node processes listening on *:3001 and *:5001
```

**If shows `127.0.0.1` instead of `0.0.0.0`:**
- Servers not binding correctly
- Check `server/server.js` and `client/package.json` configurations

---

### Emergency: Use Ngrok

If nothing works, use Ngrok for instant access:

```bash
# Install
brew install ngrok

# Start servers
npm run dev

# In new terminal, create tunnel
ngrok http 3001

# Copy the https:// URL and use from any device!
```

