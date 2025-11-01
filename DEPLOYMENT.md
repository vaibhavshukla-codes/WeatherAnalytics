# 🚀 Deployment Guide - Weather Analytics Dashboard

This guide covers multiple deployment options for the MERN stack Weather Analytics Dashboard.

## 📋 Pre-Deployment Checklist

- [ ] Update Google OAuth redirect URIs for production
- [ ] Set up environment variables
- [ ] Test all features locally
- [ ] Build the React app
- [ ] Choose deployment platform(s)

---

## 🌐 Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend) ⭐ Recommended

**Best for:** Easy deployment, free tier available, automatic deployments

#### Frontend on Vercel

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

3. **Environment Variables in Vercel**
   ```
   REACT_APP_API_URL=https://your-backend.onrender.com/api
   ```

4. **Deploy!** Vercel will automatically build and deploy.

#### Backend on Render

1. **Go to [render.com](https://render.com)**
   - Sign up/login
   - Click "New +" → "Web Service"

2. **Connect your GitHub repo**

3. **Configure the service:**
   - **Name:** weather-analytics-api
   - **Root Directory:** `server`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start` (or `node server.js`)
   - **Plan:** Free (or paid for better performance)

4. **Environment Variables in Render:**
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret
   WEATHER_API_KEY=your_openweathermap_api_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   PORT=10000
   CLIENT_URL=https://your-frontend.vercel.app
   NODE_ENV=production
   ```

5. **Update Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Add to Authorized redirect URIs:
     ```
     https://your-backend.onrender.com/api/auth/google/callback
     ```

6. **Deploy!**

---

### Option 2: Netlify (Frontend) + Railway (Backend)

#### Frontend on Netlify

1. **Go to [netlify.com](https://netlify.com)**
   - Sign in with GitHub
   - Click "New site from Git"

2. **Configure:**
   - Connect repository
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/build`

3. **Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend.railway.app/api
   ```

#### Backend on Railway

1. **Go to [railway.app](https://railway.app)**
   - Sign in with GitHub
   - Click "New Project" → "Deploy from GitHub repo"

2. **Configure:**
   - Select `server` directory
   - Add environment variables (same as Render above)

3. **Update start script in `server/package.json`:**
   ```json
   "start": "node server.js"
   ```

---

### Option 3: Full Stack on Heroku

1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create two Heroku apps:**
   ```bash
   # Backend
   cd server
   heroku create weather-analytics-api
   
   # Frontend (separate app)
   cd ../client
   heroku create weather-analytics-app --buildpack https://github.com/mars/create-react-app-buildpack.git
   ```

3. **Deploy Backend:**
   ```bash
   cd server
   git init
   heroku git:remote -a weather-analytics-api
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

4. **Set Environment Variables (Backend):**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set WEATHER_API_KEY=your_api_key
   heroku config:set GOOGLE_CLIENT_ID=your_client_id
   heroku config:set GOOGLE_CLIENT_SECRET=your_client_secret
   heroku config:set CLIENT_URL=https://weather-analytics-app.herokuapp.com
   ```

5. **Deploy Frontend:**
   ```bash
   cd client
   heroku git:remote -a weather-analytics-app
   git add .
   git commit -m "Deploy frontend"
   git push heroku main
   ```

6. **Update Google OAuth redirect URI:**
   ```
   https://weather-analytics-api.herokuapp.com/api/auth/google/callback
   ```

---

### Option 4: Docker Deployment

#### Create Dockerfile for Backend

**Create `server/Dockerfile`:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5001

CMD ["node", "server.js"]
```

#### Create Dockerfile for Frontend

**Create `client/Dockerfile`:**
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Create docker-compose.yml (Root)

```yaml
version: '3.8'

services:
  backend:
    build: ./server
    ports:
      - "5001:5001"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - WEATHER_API_KEY=${WEATHER_API_KEY}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      - CLIENT_URL=http://localhost:3000
      - NODE_ENV=production
    restart: unless-stopped

  frontend:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

**Create `client/nginx.conf`:**
```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Deploy with Docker:**
```bash
docker-compose up -d
```

---

## 🔧 Required Environment Variables

### Frontend (.env in client/)
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Backend (.env in server/)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your-secret-key-here
WEATHER_API_KEY=your-openweathermap-api-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
PORT=5001
CLIENT_URL=https://your-frontend-url.com
NODE_ENV=production
```

---

## 🔐 Google OAuth Configuration

### Update Authorized Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Navigate to "APIs & Services" → "Credentials"
4. Click on your OAuth 2.0 Client ID
5. Add to **Authorized redirect URIs**:
   ```
   https://your-backend-domain.com/api/auth/google/callback
   ```
6. Add to **Authorized JavaScript origins**:
   ```
   https://your-frontend-domain.com
   https://your-backend-domain.com
   ```

---

## 📝 Pre-Deployment Steps

### 1. Update Backend Production URLs

Update `server/routes/auth.js`:
```javascript
// Change hardcoded localhost:3001 to use environment variable
const clientUrl = process.env.CLIENT_URL || 'https://your-frontend-domain.com';
res.redirect(`${clientUrl}/dashboard`);
```

### 2. Update CORS Settings

Ensure `server/server.js` allows your production frontend:
```javascript
app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    'https://your-frontend-domain.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 3. Build Production Frontend

```bash
cd client
npm run build
```

### 4. Update Package Scripts

**server/package.json:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

---

## 🌍 Deployment Platforms Comparison

| Platform | Frontend | Backend | Free Tier | Ease of Use |
|----------|----------|---------|-----------|-------------|
| **Vercel** | ✅ Excellent | ❌ No | ✅ Yes | ⭐⭐⭐⭐⭐ |
| **Netlify** | ✅ Excellent | ❌ No | ✅ Yes | ⭐⭐⭐⭐⭐ |
| **Render** | ✅ Good | ✅ Excellent | ✅ Yes | ⭐⭐⭐⭐ |
| **Railway** | ✅ Good | ✅ Excellent | ❌ No | ⭐⭐⭐⭐ |
| **Heroku** | ✅ Good | ✅ Good | ❌ No (paid) | ⭐⭐⭐ |
| **Docker** | ✅ Any | ✅ Any | Depends | ⭐⭐ |

---

## ✅ Post-Deployment Checklist

- [ ] Test Google OAuth login
- [ ] Verify API endpoints work
- [ ] Check CORS is configured correctly
- [ ] Test weather data fetching
- [ ] Verify favorites persist
- [ ] Test temperature unit toggle
- [ ] Check mobile responsiveness
- [ ] Verify HTTPS is enabled
- [ ] Test error handling
- [ ] Monitor logs for errors

---

## 🐛 Common Issues & Fixes

### Issue 1: CORS Errors
**Fix:** Update CORS in `server/server.js` to include production frontend URL

### Issue 2: OAuth Redirect URI Mismatch
**Fix:** Update Google Cloud Console with correct production callback URL

### Issue 3: API URL Not Working
**Fix:** Ensure `REACT_APP_API_URL` is set correctly in frontend environment

### Issue 4: Database Connection Failed
**Fix:** Check MongoDB Atlas allows connections from your server IP (0.0.0.0/0 for all)

### Issue 5: Build Fails
**Fix:** Check Node.js version matches (use Node 18+)

---

## 📊 Monitoring & Maintenance

### Recommended Tools:
- **Logs:** Use platform's built-in logging (Render, Railway, Vercel all provide this)
- **Uptime:** UptimeRobot (free tier available)
- **Errors:** Sentry.io (free tier available)
- **Analytics:** Google Analytics

---

## 🚀 Quick Start (Recommended: Vercel + Render)

### 5-Minute Deployment:

1. **Frontend (Vercel):**
   - Push to GitHub
   - Import to Vercel
   - Set `REACT_APP_API_URL` env var
   - Deploy!

2. **Backend (Render):**
   - Connect GitHub repo
   - Select `server` directory
   - Add all env vars
   - Update Google OAuth redirect URI
   - Deploy!

3. **Update Frontend env var with Render URL**

4. **Test!** 🎉

---

## 💡 Tips

- Always use HTTPS in production
- Keep environment variables secure
- Use strong JWT secrets
- Enable MongoDB Atlas IP whitelisting
- Monitor API rate limits (OpenWeatherMap)
- Set up automatic deployments from GitHub
- Use production MongoDB (not local)

---

## 📞 Need Help?

If you encounter issues:
1. Check deployment platform logs
2. Verify all environment variables
3. Test API endpoints directly
4. Check Google OAuth configuration
5. Verify MongoDB connection

---

**Good luck with your deployment! 🚀**

