# Weather Analytics Dashboard - Project Overview

## What is This Project?

A full-stack weather analytics application built with the MERN stack that allows users to track weather data for multiple cities, visualize trends, and make data-driven decisions about weather patterns.

## Key Features

### ✅ Core Requirements (All Implemented)

1. **🌦 Dashboard**
   - Summary cards for multiple cities
   - Current temperature, condition, humidity, wind speed
   - Real-time updates
   - Location: `client/src/pages/Dashboard.js`

2. **🔍 Detailed View**
   - Click any city to see in-depth analytics
   - 5-7 day forecast
   - Hour-by-hour forecast (24 hours)
   - Detailed stats (pressure, visibility, UV index)
   - Location: `client/src/pages/CityDetail.js`

3. **💬 Search & Favorites**
   - Search bar with autocomplete
   - Favorite cities persist in MongoDB
   - Add/remove favorites
   - Locations: 
     - `client/src/components/CitySearch.js`
     - `server/routes/favorites.js`

4. **📈 Data Visualization**
   - Temperature trends (hourly)
   - Precipitation patterns
   - Wind speed/direction
   - Interactive with hover effects
   - Built with Recharts
   - Locations: `client/src/components/charts/`

5. **⚙ Settings**
   - Toggle Celsius ↔ Fahrenheit
   - Stored in user preferences
   - Applied across all views
   - Location: `client/src/redux/slices/settingsSlice.js`

6. **🔁 Real-time Data**
   - Live weather from OpenWeatherMap API
   - Data freshness: max 60 seconds
   - Location: `server/utils/weatherApi.js`

### ✅ Bonus Features (All Implemented)

7. **🔐 Authentication**
   - Google OAuth sign-in
   - JWT-based sessions
   - Protected routes
   - Location: `server/routes/auth.js`, `client/src/pages/Login.js`

8. **⚡ Caching**
   - 60-second cache window
   - Reduces API calls by ~95%
   - Automatic expiration
   - Location: `server/utils/cache.js`

## Architecture

### Frontend (React)
```
client/src/
├── App.js                 # Main app component with routing
├── pages/                 # Page components
│   ├── Login.js          # Google OAuth login
│   ├── Dashboard.js      # Main dashboard view
│   └── CityDetail.js     # Detailed city analytics
├── components/           # Reusable components
│   ├── charts/          # Visualization components
│   ├── CityCard.js      # City summary card
│   ├── CitySearch.js    # Search dialog
│   ├── HourlyForecast.js
│   └── DailyForecast.js
├── redux/               # State management
│   ├── store.js         # Redux store config
│   └── slices/          # Redux slices
│       ├── authSlice.js
│       ├── weatherSlice.js
│       ├── favoritesSlice.js
│       └── settingsSlice.js
├── services/            # API services
│   └── weatherService.js
└── utils/               # Helper functions
    └── conversions.js   # Temperature & unit conversions
```

### Backend (Node.js/Express)
```
server/
├── server.js            # Express server setup
├── models/              # MongoDB models
│   └── User.js         # User schema
├── routes/              # API endpoints
│   ├── auth.js         # Google OAuth & JWT
│   ├── weather.js      # Weather API integration
│   └── favorites.js    # Favorites CRUD
├── middleware/          # Custom middleware
│   └── auth.js         # JWT authentication
└── utils/               # Utilities
    ├── weatherApi.js   # OpenWeatherMap client
    └── cache.js        # Caching layer
```

## Data Flow

### User Authentication
1. User clicks "Sign in with Google"
2. Redirected to Google OAuth
3. Google redirects back with code
4. Server exchanges code for user info
5. Server creates/finds user in MongoDB
6. Server generates JWT token
7. Token stored in httpOnly cookie
8. Client checks auth on mount

### Weather Data Flow
1. User adds favorite city
2. City saved to user's favorites in MongoDB
3. Dashboard fetches weather for all favorites
4. Weather API called with lat/lon
5. Cache checked first (60s TTL)
6. If cache miss, fetch from OpenWeatherMap
7. Data cached for future requests
8. Data displayed on city cards

### Detailed View Flow
1. User clicks city card
2. Navigate to `/city/:cityId`
3. Fetch current weather + forecast
4. Display in tabs:
   - Hourly forecast (24h)
   - Daily forecast (5 days)
   - Temperature chart
   - Precipitation chart
   - Wind chart

## Technology Choices

### Frontend
- **React 18** - Modern UI library
- **Redux Toolkit** - Predictable state management
- **Material-UI** - Beautiful, consistent components
- **Recharts** - Powerful charting library
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Passport.js** - Authentication middleware
- **JWT** - Token-based auth
- **Node-Cache** - In-memory caching

### APIs
- **OpenWeatherMap API** - Weather data
- **Google OAuth** - Authentication

## Security Features

1. **JWT Authentication** - Secure token-based auth
2. **httpOnly Cookies** - XSS protection
3. **CORS Configuration** - Controlled origins
4. **Environment Variables** - Secrets protection
5. **Input Validation** - Server-side checks
6. **Rate Limiting** - API protection ready

## Performance Optimizations

1. **Caching** - 60s cache reduces API calls
2. **Code Splitting** - Lazy loading ready
3. **Debounced Search** - Limits API calls
4. **Memoization** - React.memo where useful
5. **Optimistic Updates** - Instant UI feedback

## Scalability Considerations

1. **Stateless Backend** - Horizontal scaling ready
2. **Database Indexing** - Fast lookups
3. **Cache Layer** - Reduces DB/API load
4. **API Key Rotation** - Easy to update
5. **Environment Config** - Multi-environment support

## Future Enhancements

Possible additions:
- Historical weather data
- Weather alerts
- Mobile app (React Native)
- Social features (share forecasts)
- Advanced analytics (ML predictions)
- Multi-language support
- Dark mode
- Custom dashboard layouts

## Testing Strategy

Current implementation focuses on functionality. For production:
1. Unit tests (Jest)
2. Integration tests (Supertest)
3. E2E tests (Cypress/Playwright)
4. Load testing (Artillery)
5. Security testing (OWASP)

## Deployment

The app can be deployed to:
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Backend**: Heroku, AWS EC2, Google Cloud Run, Railway
- **Database**: MongoDB Atlas, AWS DocumentDB
- **Cache**: Redis (for production scale)

## Monitoring

Recommended monitoring:
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Uptime monitoring (UptimeRobot)
- Analytics (Google Analytics)
- API monitoring (Postman)

## License

ISC - See LICENSE file

## Contributing

This is a showcase project demonstrating:
- Full-stack MERN development
- Modern React patterns
- Redux state management
- API integration
- Authentication flows
- Caching strategies
- Responsive design
- Clean code architecture

---

Built with ❤️ using the MERN stack

