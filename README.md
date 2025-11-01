# Weather Analytics Dashboard

A comprehensive Weather Analytics Dashboard built with the MERN stack that displays current weather data, forecasts, and interactive visualizations.

## Features

### Core Features
- 🌦 **Dashboard** - Summary cards for multiple cities with current temperature, weather condition, humidity, and wind speed
- 🔍 **Detailed View** - In-depth analytics with 5-7 day forecast and hour-by-hour data
- 💬 **Search & Favorites** - City search with autocomplete and favorite cities that persist
- 📈 **Data Visualization** - Interactive charts showing temperature trends, precipitation patterns, and wind data
- ⚙ **Settings** - Switch between Celsius and Fahrenheit
- 🔁 **Real-time Data** - Live weather data with 60-second refresh window

### Bonus Features
- 🔐 **Authentication** - Google OAuth sign-in
- ⚡ **Caching** - Smart caching to reduce API calls

## Tech Stack

### Frontend
- React with Hooks
- Redux Toolkit for state management
- Recharts for visualizations
- Material-UI for beautiful components
- React Router for navigation

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT authentication
- Weather API integration (OpenWeatherMap)
- Caching layer

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or remote)
- Google OAuth credentials
- OpenWeatherMap API key

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd WeatherAnalytics
```

2. Run the setup script
```bash
chmod +x setup.sh
./setup.sh
```

3. Configure environment variables

Copy and edit the example environment file:
```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your credentials:
```
MONGODB_URI=mongodb://localhost:27017/weather-analytics
JWT_SECRET=your-jwt-secret-here
WEATHER_API_KEY=your-openweather-api-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
PORT=5000
CLIENT_URL=http://localhost:3000
```

4. Start MongoDB (if running locally)
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

5. Start the development servers
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## API Keys Setup

### OpenWeatherMap API
1. Sign up at https://openweathermap.org/api
2. Get your free API key
3. Add it to the `.env` file as `WEATHER_API_KEY`

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Configure redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Add credentials to `.env` file

## Usage

1. Sign in with Google
2. Search for cities using the search bar (Fab button in bottom right)
3. Add cities to your favorites
4. Click on any city card to view detailed analytics
5. Switch between Celsius and Fahrenheit in the user menu
6. Explore interactive charts and visualizations

## Project Structure

```
WeatherAnalytics/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components & charts
│   │   ├── pages/         # Page components
│   │   ├── redux/         # Redux store and slices
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions & caching
│   ├── server.js
│   └── package.json
├── setup.sh              # Setup script
├── SETUP.md              # Detailed setup guide
└── package.json          # Root package.json
```

## Development

### Backend Only
```bash
cd server && npm run dev
```

### Frontend Only
```bash
cd client && npm start
```

### Both (Recommended)
```bash
npm run dev
```

## Features in Detail

### Dashboard
- View all favorite cities at a glance
- Real-time weather updates
- Quick access to detailed views

### Detailed City View
- Current weather conditions
- 24-hour hourly forecast
- 5-day daily forecast
- Temperature trend charts
- Precipitation charts
- Wind speed and direction charts

### Search & Favorites
- Autocomplete city search
- Add/remove favorites
- Persistent storage across sessions

### Authentication
- Google OAuth integration
- Secure JWT tokens
- Protected routes

### Caching
- 60-second cache for weather data
- Reduces API calls significantly
- Automatic cache invalidation

## License

ISC

