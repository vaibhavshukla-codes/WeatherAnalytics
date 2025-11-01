# Environment Variables Setup

This file shows you what environment variables are needed for the Weather Analytics Dashboard.

## Create the .env file

Navigate to the `server` directory and create a file named `.env`:

```bash
cd server
touch .env
```

Then add the following content to your `.env` file:

## Required Environment Variables

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/weather-analytics

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# OpenWeatherMap API Key
WEATHER_API_KEY=your-openweather-api-key-here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Server Configuration
PORT=5000

# Client URL (where React app is running)
CLIENT_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

## Getting Your API Keys

### 1. MongoDB URI

**Local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/weather-analytics
```

**MongoDB Atlas (Cloud):**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/weather-analytics?retryWrites=true&w=majority`

### 2. JWT Secret

Generate a random secret:
```bash
# Using OpenSSL
openssl rand -hex 32

# Or use any random string (longer is better)
```

### 3. OpenWeatherMap API Key

1. Go to https://openweathermap.org/api
2. Sign up for a free account
3. Navigate to API keys
4. Copy your default API key
5. Wait a few minutes for the key to activate

### 4. Google OAuth Credentials

1. Go to https://console.cloud.google.com
2. Create a new project (or select existing)
3. Enable Google+ API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add these Authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback`
     - `http://localhost:3000` (for development)
   - Click "Create"
5. Copy the Client ID and Client Secret

## Security Notes

⚠️ **Important:**
- Never commit the `.env` file to version control
- Keep your API keys secret
- Use strong, random JWT secrets
- In production, use environment variables or a secrets manager
- Enable HTTPS for production

## Testing Your Configuration

After setting up your `.env` file, you can test it:

```bash
# Start the backend
cd server
npm run dev
```

You should see:
- ✅ MongoDB Connected
- 🚀 Server running on port 5000

If you see errors, double-check:
- All API keys are correct
- MongoDB is running (for local setup)
- No typos in variable names
- No extra spaces around the `=` sign

## Production Configuration

For production, you'll need to:
1. Change `NODE_ENV` to `production`
2. Update `CLIENT_URL` to your production domain
3. Use a production MongoDB URI
4. Set `secure: true` in JWT cookie settings
5. Use a secrets manager (AWS Secrets Manager, Azure Key Vault, etc.)

