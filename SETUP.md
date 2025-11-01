# Weather Analytics Dashboard - Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or remote)
- Google OAuth credentials
- OpenWeatherMap API key

## Installation

### 1. Clone and Install Dependencies

Run the setup script:
```bash
chmod +x setup.sh
./setup.sh
```

Or manually:
```bash
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 2. Configure Environment Variables

Copy the example environment file and update it with your credentials:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` and add:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A random secret string for JWT tokens
- `WEATHER_API_KEY`: Your OpenWeatherMap API key
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `CLIENT_URL`: Frontend URL (default: http://localhost:3000)

### 3. Get API Keys

#### OpenWeatherMap API
1. Sign up at https://openweathermap.org/api
2. Go to API keys section
3. Create a new key
4. Add it to `.env` as `WEATHER_API_KEY`

#### Google OAuth
1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Configure:
   - Application type: Web application
   - Authorized redirect URI: http://localhost:5000/api/auth/google/callback
6. Copy Client ID and Client Secret to `.env`

### 4. Start MongoDB

**macOS (Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Windows:**
```bash
net start MongoDB
```

Or use MongoDB Atlas (cloud):
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string and add to `.env`

### 5. Run the Application

Start both servers concurrently:
```bash
npm run dev
```

Or start them separately:
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm start
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- Try connecting with MongoDB Compass to verify

### API Key Errors
- Verify your OpenWeatherMap API key is valid
- Check rate limits on your API key
- Ensure you've activated the API key on OpenWeatherMap

### Google OAuth Issues
- Verify redirect URI matches exactly
- Check that Google+ API is enabled
- Make sure client credentials are correct

### Port Already in Use
- Change `PORT` in server `.env`
- Or kill the process using the port:
  ```bash
  # Find process
  lsof -i :5000
  
  # Kill it
  kill -9 <PID>
  ```

## Project Structure

```
WeatherAnalytics/
├── client/                  # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── pages/          # Page components
│       ├── redux/          # Redux store & slices
│       ├── services/       # API services
│       └── utils/          # Utility functions
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   └── server.js          # Server entry point
└── package.json           # Root package.json
```

## Features

✅ Google OAuth Authentication  
✅ Dashboard with multiple cities  
✅ Real-time weather data (60s cache)  
✅ 5-day forecast  
✅ Hour-by-hour forecast  
✅ Interactive charts (temperature, precipitation, wind)  
✅ Search cities with autocomplete  
✅ Favorites management  
✅ Temperature unit conversion (Celsius/Fahrenheit)  
✅ Responsive design  

## Development

### Backend Development
```bash
cd server
npm run dev
```

### Frontend Development
```bash
cd client
npm start
```

### Build for Production
```bash
cd client
npm run build
```

## License

ISC

