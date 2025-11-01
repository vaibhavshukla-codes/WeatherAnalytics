const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const router = express.Router();

// Validate OAuth credentials before setting up strategy
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('⚠️  WARNING: Google OAuth credentials not set in environment variables');
}

const callbackURL = process.env.CALLBACK_URL || `http://localhost:${process.env.PORT || 5001}/api/auth/google/callback`;
console.log('🔧 OAuth Configuration:');
console.log('   Client ID:', process.env.GOOGLE_CLIENT_ID ? '✓ Set' : '✗ Missing');
console.log('   Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? '✓ Set' : '✗ Missing');
console.log('   Callback URL:', callbackURL);

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: callbackURL,
  proxy: false // Set to true only if behind a proxy in production
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Log successful token exchange
    console.log('✅ OAuth token exchange successful');
    console.log('   Access token received:', accessToken ? 'Yes' : 'No');
    
    if (!profile || !profile.id) {
      console.error('❌ OAuth: Invalid profile data received');
      console.error('   Profile object:', profile ? 'exists' : 'null');
      return done(new Error('Invalid profile data'), null);
    }
    
    console.log('✅ Profile received:', {
      id: profile.id,
      email: profile.emails?.[0]?.value || 'no email',
      name: profile.displayName || 'no name'
    });

    // Ensure database is connected - wait a bit if connecting
    const maxRetries = 10; // Increased retries
    let retries = 0;
    
    // If disconnected, try to reconnect
    if (mongoose.connection.readyState === 0) {
      console.log('🔄 MongoDB disconnected, attempting reconnect...');
      try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/weather-analytics', {
          serverSelectionTimeoutMS: 5000
        });
      } catch (reconnectErr) {
        console.error('❌ Failed to reconnect:', reconnectErr.message);
      }
    }
    
    // Wait for connection
    while (mongoose.connection.readyState !== 1 && retries < maxRetries) {
      const state = mongoose.connection.readyState;
      const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
      console.log(`⏳ Waiting for database connection... (${retries + 1}/${maxRetries}) - State: ${states[state] || state}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      retries++;
    }
    
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ OAuth: Database not connected after retries');
      console.error('   Connection state:', mongoose.connection.readyState);
      console.error('   Please check your MongoDB connection string in .env');
      // Fail with a more specific error message
      return done(new Error('Database connection timeout. Please check your MongoDB URI in .env file.'), null);
    }
    
    console.log('✅ Database connection verified');

    let user = await User.findOne({ googleId: profile.id });
    
    if (!user) {
      // Create new user with safe defaults
      try {
        user = await User.create({
          googleId: profile.id,
          email: profile.emails?.[0]?.value || 'unknown@example.com',
          name: profile.displayName || 'User',
          picture: profile.photos?.[0]?.value || '',
          favorites: []
        });
        console.log('OAuth: Created new user:', user.email);
      } catch (createError) {
        // If user creation fails (e.g., duplicate email), try to find by email
        if (createError.code === 11000) {
          user = await User.findOne({ email: profile.emails?.[0]?.value });
          if (user) {
            // Update existing user with googleId
            user.googleId = profile.id;
            await user.save();
          }
        } else {
          throw createError;
        }
      }
    }
    
    return done(null, user);
  } catch (error) {
    console.error('OAuth strategy error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      name: error.name
    });
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  (req, res, next) => {
    // Log callback attempt for debugging
    console.log('🔔 OAuth callback received:', {
      query: req.query,
      hasCode: !!req.query.code,
      hasError: !!req.query.error,
      error: req.query.error,
      errorDescription: req.query.error_description
    });
    
    // Check for OAuth error in query parameters
    if (req.query.error) {
      console.error('❌ OAuth error from Google:', {
        error: req.query.error,
        description: req.query.error_description
      });
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:3001';
      return res.redirect(`${clientUrl}/login?error=${req.query.error}&description=${encodeURIComponent(req.query.error_description || '')}`);
    }
    
    // Check if authorization code is missing
    if (!req.query.code) {
      console.error('❌ Missing authorization code in callback');
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:3001';
      return res.redirect(`${clientUrl}/login?error=no_code`);
    }
    
    next();
  },
  (req, res, next) => {
    // Use custom callback to handle errors better
    passport.authenticate('google', { 
      session: false,
      failureFlash: false
    }, (err, user, info) => {
      if (err) {
        console.error('❌ Passport authentication error:', err);
        console.error('   Error message:', err.message);
        console.error('   Error name:', err.name);
        
        // Check for specific OAuth errors
        if (err.message && err.message.includes('Bad Request')) {
          console.error('\n🔍 OAuth Bad Request Error Detected!');
          console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.error('This error occurs during token exchange with Google.');
          console.error('\n📋 Most Common Causes:');
          console.error('   1. ❌ Callback URL mismatch');
          console.error('      Current callback:', callbackURL);
          console.error('      Must EXACTLY match Google Cloud Console');
          console.error('      → Check: https://console.cloud.google.com/apis/credentials');
          console.error('\n   2. ❌ Invalid client credentials');
          console.error('      Verify Client ID and Secret in .env match Google Console');
          console.error('      Run: node server/verify-oauth.js');
          console.error('\n   3. ❌ Authorization code expired or reused');
          console.error('      Codes expire in ~10 minutes and can only be used once');
          console.error('      → Start a fresh login flow (don\'t refresh callback URL)');
          console.error('\n   4. ❌ Token exchange request failed');
          console.error('      Network issues or Google API errors');
          console.error('      → Check internet connection and try again');
          console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
          
          // Log additional error details if available
          if (err.oauthError) {
            console.error('📄 OAuth Error Details:', err.oauthError);
          }
          if (err.statusCode) {
            console.error('📊 Status Code:', err.statusCode);
          }
          if (err.data) {
            console.error('📦 Response Data:', err.data);
          }
        }
        
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:3001';
        return res.redirect(`${clientUrl}/login?error=oauth_failed&message=${encodeURIComponent(err.message || 'Authentication failed')}`);
      }
      
      if (!user) {
        console.error('❌ No user returned from OAuth strategy');
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:3001';
        return res.redirect(`${clientUrl}/login?error=no_user`);
      }
      
      // Attach user to request for next middleware
      req.user = user;
      next();
    })(req, res, next);
  },
  async (req, res) => {
    try {
      if (!req.user || !req.user._id) {
        console.error('OAuth callback: No user in request');
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:3001';
        return res.redirect(`${clientUrl}/login?error=no_user`);
      }

      // Sign JWT token
      const token = jwt.sign(
        { userId: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Determine if we're using HTTPS (check proxy headers)
      const isSecure = req.secure || 
                      req.headers['x-forwarded-proto'] === 'https' || 
                      req.headers['x-forwarded-ssl'] === 'on' ||
                      process.env.NODE_ENV === 'production';
      
      // Cookie configuration - fix SSL/TLS issues
      const cookieOptions = {
        httpOnly: true,
        secure: isSecure,
        sameSite: isSecure ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/'
      };

      // Only set sameSite: 'none' if secure is true (required by browsers)
      if (!isSecure && cookieOptions.sameSite === 'none') {
        cookieOptions.sameSite = 'lax';
      }

      res.cookie('token', token, cookieOptions);

      // Redirect to dashboard
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:3001';
      res.redirect(`${clientUrl}/dashboard`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      console.error('Error stack:', error.stack);
      
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:3001';
      // Redirect with error query parameter for debugging
      res.redirect(`${clientUrl}/login?error=auth_failed`);
    }
  }
);

// Logout route
router.post('/logout', (req, res) => {
  const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https' || process.env.NODE_ENV === 'production';
  
  res.clearCookie('token', {
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? 'none' : 'lax',
    path: '/'
  });
  res.json({ message: 'Logged out successfully' });
});

// Get current user
router.get('/me', require('../middleware/auth').authenticate, (req, res) => {
  res.json({
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    picture: req.user.picture,
    preferences: req.user.preferences,
    favorites: req.user.favorites
  });
});

module.exports = router;
