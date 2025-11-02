# 🌐 Network Access Guide - Access from Other Devices

This guide shows how to access your Weather Analytics Dashboard from other devices on your local network (mobile phones, tablets, other computers).

## ✅ What's Fixed

1. **Removed Docker** - Pure MERN stack only
2. **Network Binding** - Servers now bind to `0.0.0.0` (accessible from network)
3. **CORS Updated** - Allows requests from local network IPs
4. **Frontend Network Access** - React dev server accessible on network

---

## 🚀 Quick Start

### Step 1: Start the Application

```bash
npm run dev
```

This will start:
- Backend on `http://0.0.0.0:5001` (accessible from network)
- Frontend on `http://0.0.0.0:3001` (accessible from network)

### Step 2: Find Your IP Address

Run this command:
```bash
npm run network-info
```

Or manually:

**macOS/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```bash
ipconfig
```

Look for your local network IP (usually starts with `192.168.` or `10.`)

### Step 3: Access from Other Devices

**On the same machine:**
- Frontend: `http://localhost:3001`
- Backend: `http://localhost:5001`

**On other devices (same network):**
- Frontend: `http://[YOUR_IP]:3001` (e.g., `http://192.168.1.100:3001`)
- Backend: `http://[YOUR_IP]:5001` (e.g., `http://192.168.1.100:5001`)

---

## 📱 Mobile Device Access

### From Your Phone/Tablet:

1. **Make sure your phone is on the same WiFi network** as your computer
2. **Find your computer's IP address** (use `npm run network-info`)
3. **Open your phone's browser**
4. **Navigate to:** `http://[YOUR_IP]:3001`
   - Example: `http://192.168.1.100:3001`

### Example:
If your computer's IP is `192.168.1.100`:
- Access app: `http://192.168.1.100:3001`

---

## 🔧 Configuration Details

### Backend Server
- **Binds to:** `0.0.0.0` (all network interfaces)
- **Port:** `5001`
- **CORS:** Allows local network IPs in development

### Frontend Server
- **Binds to:** `0.0.0.0` (all network interfaces)
- **Port:** `3001`
- **Proxy:** Points to backend on same network

---

## ⚠️ Important Notes

### Security
- Network access is **ONLY enabled in development mode**
- In production, only specific origins are allowed
- Don't expose ports to the internet in development

### Firewall
If other devices can't connect:
1. **macOS:** Check System Preferences → Security → Firewall
2. **Windows:** Check Windows Firewall settings
3. **Linux:** Check `ufw` or `iptables` rules

### Same Network Required
- All devices must be on the **same WiFi/network**
- Can't access from different networks without port forwarding

---

## 🐛 Troubleshooting

### Can't Access from Phone
1. ✅ Verify both servers are running
2. ✅ Check devices are on same WiFi
3. ✅ Verify IP address is correct
4. ✅ Check firewall settings
5. ✅ Try accessing from another computer first

### CORS Errors
- Should be automatically handled
- If issues persist, check server logs
- Make sure you're using the correct IP address

### Connection Refused
- Make sure servers are binding to `0.0.0.0` not `localhost`
- Check that ports 3001 and 5001 aren't blocked by firewall
- Verify servers are actually running

---

## 📋 Testing Network Access

### Test from Another Computer:
```bash
# From another computer on same network
curl http://[YOUR_IP]:5001/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Weather Analytics API is running"
}
```

### Test Frontend:
Open `http://[YOUR_IP]:3001` in a browser on another device.

---

## ✅ Verification Checklist

- [ ] Backend server shows: `Server running on http://localhost:5001`
- [ ] Frontend server shows it's listening on `0.0.0.0:3001`
- [ ] Can access from `http://localhost:3001` on same machine
- [ ] Can access from `http://[YOUR_IP]:3001` on other devices
- [ ] No firewall blocking ports 3001 and 5001
- [ ] All devices on same network

---

## 🎯 Quick Reference

**Start servers:**
```bash
npm run dev
```

**Get network IP:**
```bash
npm run network-info
```

**Access URLs:**
- Local: `http://localhost:3001`
- Network: `http://[YOUR_IP]:3001`

---

**Now your MERN app is accessible from any device on your local network! 🎉**

