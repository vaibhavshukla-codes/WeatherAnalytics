const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Trust proxy for accurate HTTPS detection (important for deployment platforms)
// This helps with cookies and SSL/TLS detection
app.set('trust proxy', 1);

// Fix SSL/TLS issues with Google OAuth (for local development only)
// This disables SSL certificate validation in development
// WARNING: Only use in development, never in production!
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  console.log('⚠️  TLS rejection disabled for development');
}

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3001', // Primary frontend port (Weather Analytics)
    process.env.CLIENT_URL || 'http://localhost:3001', // Use 3001 as default
    // Note: localhost:3000 is intentionally excluded - it's a different project
    // Add production frontend URL here when deploying
    ...(process.env.CLIENT_URL && process.env.NODE_ENV === 'production' ? [process.env.CLIENT_URL] : [])
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

// Passport and session middleware
app.use(session({
  secret: process.env.JWT_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    httpOnly: true
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB with better error handling
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/weather-analytics';
    
    // MongoDB Atlas connection options
    const options = {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };
    
    // For MongoDB Atlas, ensure SSL is enabled
    if (mongoUri.includes('mongodb.net') || mongoUri.includes('mongodb+srv')) {
      // Atlas connections should use SSL by default, but we can be explicit
      console.log('🔗 Connecting to MongoDB Atlas...');
    } else {
      console.log('🔗 Connecting to local MongoDB...');
    }
    
    const conn = await mongoose.connect(mongoUri, options);
    console.log('✅ MongoDB Connected');
    console.log('   Database:', conn.connection.name);
    console.log('   Host:', conn.connection.host);
    return true;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    
    // Provide helpful error messages
    if (err.message.includes('IP') || err.message.includes('whitelist')) {
      console.error('\n⚠️  MONGODB ATLAS IP WHITELIST ISSUE:');
      console.error('   Your IP address is not whitelisted in MongoDB Atlas.');
      console.error('   To fix this:');
      console.error('   1. Go to: https://cloud.mongodb.com');
      console.error('   2. Navigate to: Security > Network Access');
      console.error('   3. Click "Add IP Address"');
      console.error('   4. Click "Allow Access from Anywhere" (0.0.0.0/0)');
      console.error('      OR add Render\'s IP ranges');
      console.error('   5. Save and wait 1-2 minutes for changes to propagate\n');
    }
    
    if (err.message.includes('authentication')) {
      console.error('\n⚠️  MONGODB AUTHENTICATION ISSUE:');
      console.error('   Check your MONGODB_URI - username/password might be incorrect.');
      console.error('   Format: mongodb+srv://username:password@cluster.mongodb.net/database\n');
    }
    
    console.error('   Please check your MONGODB_URI in environment variables');
    // Don't exit - let the server start, but OAuth will fail gracefully
    return false;
  }
};

// Connect to database
connectDB();

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
  // Try to reconnect after 5 seconds
  setTimeout(() => {
    if (mongoose.connection.readyState === 0) {
      console.log('🔄 Attempting to reconnect to MongoDB...');
      connectDB();
    }
  }, 5000);
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

mongoose.connection.on('connecting', () => {
  console.log('🔄 Connecting to MongoDB...');
});

// Routes (this import sets up passport strategies)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/favorites', require('./routes/favorites'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Weather Analytics API is running',
    timestamp: new Date().toISOString()
  });
});

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  console.error('Error stack:', err.stack);
  
  // Don't expose internal errors in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message || 'Internal server error';
  
  res.status(err.status || 500).json({ 
    message: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5001;

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Handle port already in use error
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
    console.error(`💡 Kill the process: lsof -ti:${PORT} | xargs kill -9`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});
