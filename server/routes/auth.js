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

// Determine callback URL based on environment
// In production (Render), use RENDER_EXTERNAL_URL or construct from available env vars
// In development, use localhost
let callbackURL;

// Determine if we're in production or on Render
// Check for Render-specific environment variables OR production environment
const isRender = !!process.env.RENDER_EXTERNAL_URL || 
                 !!process.env.RENDER || 
                 process.env.RENDER_SERVICE_NAME ||
                 process.env.RENDER_URL ||
                 (process.env.PORT && process.env.PORT !== '5001' && process.env.PORT !== '3001' && parseInt(process.env.PORT) >= 10000);

// STRICT production check: Must be explicitly set or running on Render
const isProduction = process.env.NODE_ENV === 'production' || isRender;

// Determine callback URL with explicit priority
if (process.env.CALLBACK_URL) {
  // Priority 1: Explicitly set callback URL (most reliable)
  callbackURL = process.env.CALLBACK_URL;
  console.log('✅ Using CALLBACK_URL from environment:', callbackURL);
} else if (isProduction || isRender) {
  // Priority 2: Production/Render deployment - construct from available vars
  let baseUrl = process.env.RENDER_EXTERNAL_URL || 
                process.env.RENDER_URL || 
                process.env.BACKEND_URL;
  
  // Try constructing from service name
  if (!baseUrl && process.env.RENDER_SERVICE_NAME) {
    baseUrl = `https://${process.env.RENDER_SERVICE_NAME}.onrender.com`;
  }
  
  // Last resort: Use known Render URL (your production backend)
  if (!baseUrl) {
    baseUrl = 'https://weather-analytics-api-xsyq.onrender.com';
    console.warn('⚠️  Render URL not detected. Using known production URL.');
    console.warn('   To fix: Set CALLBACK_URL or RENDER_EXTERNAL_URL in Render dashboard.');
  }
  
  callbackURL = `${baseUrl.replace(/\/$/, '')}/api/auth/google/callback`;
  console.log('✅ Production callback URL:', callbackURL);
} else {
  // Priority 3: Development - only use localhost if explicitly in dev
  // Check if we're really in development (not accidentally in production)
  const isDefinitelyDevelopment = process.env.NODE_ENV !== 'production' && 
                                  !isRender && 
                                  (!process.env.PORT || process.env.PORT === '5001' || process.env.PORT === '3001');
  
  if (isDefinitelyDevelopment) {
    callbackURL = `http://localhost:${process.env.PORT || 5001}/api/auth/google/callback`;
    console.log('✅ Development callback URL:', callbackURL);
  } else {
    // Safety fallback: if unclear, default to production to avoid errors
    callbackURL = 'https://weather-analytics-api-xsyq.onrender.com/api/auth/google/callback';
    console.warn('⚠️  Environment unclear. Defaulting to production callback URL.');
    console.warn('   To fix: Set NODE_ENV=production and CALLBACK_URL in Render.');
  }
}

console.log('🔧 OAuth Configuration:');
console.log('   Client ID:', process.env.GOOGLE_CLIENT_ID ? '✓ Set' : '✗ Missing');
console.log('   Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? '✓ Set' : '✗ Missing');
console.log('   Callback URL:', callbackURL);
console.log('   Environment:', process.env.NODE_ENV || (isRender ? 'production (Render)' : 'development'));
console.log('   Render detected:', isRender ? 'Yes' : 'No');

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: callbackURL,
  proxy: isProduction || isRender // Enable proxy in production or on Render (for Render/Heroku)
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
  (req, res, next) => {
    // Detect client URL - prioritize origin, then referer, then default
    let clientUrl = 'http://localhost:3001'; // Default
    
    // Priority 1: Origin header (most reliable)
    if (req.headers.origin) {
      try {
        const originUrl = new URL(req.headers.origin);
        const hostname = originUrl.hostname;
        
        // Vercel deployment
        if (hostname.includes('.vercel.app') || hostname.includes('.vercel.com')) {
          clientUrl = `https://${hostname}`;
        }
        // Network IP
        else if (hostname.match(/^192\.168\.|^10\.|^172\.(1[6-9]|2[0-9]|3[01])\./)) {
          clientUrl = `${originUrl.protocol}//${hostname}:${originUrl.port || '3001'}`;
        }
        // Other hostname
        else if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
          clientUrl = `${originUrl.protocol}//${hostname}${originUrl.port ? ':' + originUrl.port : ''}`;
        }
      } catch (e) {
        // Invalid origin, continue
      }
    }
    
    // Priority 2: Referer header
    if (clientUrl === 'http://localhost:3001' && req.headers.referer) {
      try {
        const refererUrl = new URL(req.headers.referer);
        const hostname = refererUrl.hostname;
        
        // Vercel deployment
        if (hostname.includes('.vercel.app') || hostname.includes('.vercel.com')) {
          clientUrl = `https://${hostname}`;
        }
        // Network IP
        else if (hostname.match(/^192\.168\.|^10\.|^172\.(1[6-9]|2[0-9]|3[01])\./)) {
          clientUrl = `${refererUrl.protocol}//${hostname}:${refererUrl.port || '3001'}`;
        }
        // Other hostname
        else if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
          clientUrl = `${refererUrl.protocol}//${hostname}${refererUrl.port ? ':' + refererUrl.port : ''}`;
        }
      } catch (e) {
        // Invalid referer, use default
      }
    }
    
    // Pass client URL in OAuth state (Google will return it in callback)
    const state = Buffer.from(JSON.stringify({ redirect_url: clientUrl })).toString('base64');
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🔗 OAuth initiated from: ${clientUrl}`);
      console.log(`   Origin: ${req.headers.origin || 'none'}`);
      console.log(`   Referer: ${req.headers.referer || 'none'}`);
    }
    
    passport.authenticate('google', { 
      scope: ['profile', 'email'],
      state: state
    })(req, res, next);
  }
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
    
    // Determine correct client URL - supports network access
    const getClientUrl = (req) => {
      // In production, use CLIENT_URL if set
      if (process.env.NODE_ENV === 'production' && process.env.CLIENT_URL) {
        return process.env.CLIENT_URL;
      }
      
      // Check OAuth state for redirect_url (passed during OAuth initiation)
      if (req.query.state) {
        try {
          const state = JSON.parse(Buffer.from(req.query.state, 'base64').toString());
          if (state.redirect_url) {
            return state.redirect_url;
          }
        } catch (e) {
          // Invalid state, continue
        }
      }
      
      // Check referer header to detect where user came from
      if (req.headers.referer) {
        try {
          const refererUrl = new URL(req.headers.referer);
          // If referer is from local network, use that hostname
          if (refererUrl.hostname !== 'localhost' && refererUrl.hostname !== '127.0.0.1') {
            // Check if it's a local network IP (192.168.x.x, 10.x.x.x, etc.)
            const hostname = refererUrl.hostname;
            if (hostname.match(/^192\.168\.|^10\.|^172\.(1[6-9]|2[0-9]|3[01])\./)) {
              return `${refererUrl.protocol}//${hostname}:${refererUrl.port || '3001'}`;
            }
          }
        } catch (e) {
          // Invalid referer, fall through to default
        }
      }
      
      // Default: use localhost:3001 for local development
      return 'http://localhost:3001';
    };
    
    // Check for OAuth error in query parameters
    if (req.query.error) {
      console.error('❌ OAuth error from Google:', {
        error: req.query.error,
        description: req.query.error_description
      });
      const clientUrl = getClientUrl(req);
      console.log(`🔀 Redirecting to: ${clientUrl}/login`);
      return res.redirect(`${clientUrl}/login?error=${req.query.error}&description=${encodeURIComponent(req.query.error_description || '')}`);
    }
    
    // Check if authorization code is missing
    if (!req.query.code) {
      console.error('❌ Missing authorization code in callback');
      const clientUrl = getClientUrl(req);
      console.log(`🔀 Redirecting to: ${clientUrl}/login`);
      return res.redirect(`${clientUrl}/login?error=no_code`);
    }
    
    next();
  },
  (req, res, next) => {
    // Use custom callback to handle errors better
    passport.authenticate('google', { 
      session: false,
      failureFlash: false
    },       (err, user, info) => {
      // Determine correct client URL - supports network access
      const getClientUrl = (req) => {
        // In production, use CLIENT_URL if set
        if (process.env.NODE_ENV === 'production' && process.env.CLIENT_URL) {
          return process.env.CLIENT_URL;
        }
        
        // Check if there's a redirect_url in query params (from OAuth state)
        if (req.query.redirect_url) {
          return decodeURIComponent(req.query.redirect_url);
        }
        
        // Check referer header to detect where user came from
        if (req.headers.referer) {
          try {
            const refererUrl = new URL(req.headers.referer);
            // If referer is from local network, use that hostname
            if (refererUrl.hostname !== 'localhost' && refererUrl.hostname !== '127.0.0.1') {
              // Check if it's a local network IP
              const hostname = refererUrl.hostname;
              if (hostname.match(/^192\.168\.|^10\.|^172\.(1[6-9]|2[0-9]|3[01])\./)) {
                return `${refererUrl.protocol}//${hostname}:${refererUrl.port || '3001'}`;
              }
            }
          } catch (e) {
            // Invalid referer, fall through to default
          }
        }
        
        // Default: use localhost:3001 for local development
        return 'http://localhost:3001';
      };
      
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
        
        const clientUrl = getClientUrl(req);
        console.log(`🔀 Redirecting to: ${clientUrl}/login (OAuth failed)`);
        return res.redirect(`${clientUrl}/login?error=oauth_failed&message=${encodeURIComponent(err.message || 'Authentication failed')}`);
      }
      
      if (!user) {
        console.error('❌ No user returned from OAuth strategy');
        const clientUrl = getClientUrl(req);
        console.log(`🔀 Redirecting to: ${clientUrl}/login (no user)`);
        return res.redirect(`${clientUrl}/login?error=no_user`);
      }
      
      // Attach user to request for next middleware
      req.user = user;
      next();
    })(req, res, next);
  },
  async (req, res) => {
    // Determine correct client URL - supports network access and Vercel
    const getClientUrl = (req) => {
      // Priority 1: Check OAuth state for redirect_url (most reliable)
      if (req.query.state) {
        try {
          const state = JSON.parse(Buffer.from(req.query.state, 'base64').toString());
          if (state.redirect_url) {
            if (process.env.NODE_ENV !== 'production') {
              console.log(`📍 Using redirect URL from OAuth state: ${state.redirect_url}`);
            }
            return state.redirect_url;
          }
        } catch (e) {
          if (process.env.NODE_ENV !== 'production') {
            console.log('⚠️  Could not parse OAuth state:', e.message);
          }
        }
      }
      
    // Priority 2: Check origin header (more reliable than referer)
    if (req.headers.origin) {
      try {
        const originUrl = new URL(req.headers.origin);
        const hostname = originUrl.hostname;
        
        // Vercel deployment (has .vercel.app or custom domain)
        if (hostname.includes('.vercel.app') || hostname.includes('.vercel.com') || process.env.VERCEL_URL) {
          const clientUrl = `https://${hostname}`;
          if (process.env.NODE_ENV !== 'production') {
            console.log(`📍 Detected Vercel deployment: ${clientUrl}`);
          }
          return clientUrl;
        }
        
        // Render frontend (if deployed separately)
        if (hostname.includes('.onrender.com')) {
          const clientUrl = `${originUrl.protocol}//${hostname}`;
          if (process.env.NODE_ENV !== 'production') {
            console.log(`📍 Detected Render deployment: ${clientUrl}`);
          }
          return clientUrl;
        }
        
        // Network IP (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
        if (hostname.match(/^192\.168\.|^10\.|^172\.(1[6-9]|2[0-9]|3[01])\./)) {
          const clientUrl = `${originUrl.protocol}//${hostname}:${originUrl.port || '3001'}`;
          if (process.env.NODE_ENV !== 'production') {
            console.log(`📍 Detected network IP: ${clientUrl}`);
          }
          return clientUrl;
        }
        
        // Any other non-localhost hostname (likely production or custom domain)
        if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
          const clientUrl = `${originUrl.protocol}//${hostname}${originUrl.port ? ':' + originUrl.port : ''}`;
          if (process.env.NODE_ENV !== 'production') {
            console.log(`📍 Using origin header: ${clientUrl}`);
          }
          return clientUrl;
        }
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('⚠️  Could not parse origin header:', e.message);
        }
      }
    }
      
      // Priority 3: Check referer header (fallback)
      if (req.headers.referer) {
        try {
          const refererUrl = new URL(req.headers.referer);
          const hostname = refererUrl.hostname;
          
          // Vercel deployment
          if (hostname.includes('.vercel.app') || hostname.includes('.vercel.com')) {
            const clientUrl = `https://${hostname}`;
            if (process.env.NODE_ENV !== 'production') {
              console.log(`📍 Detected Vercel from referer: ${clientUrl}`);
            }
            return clientUrl;
          }
          
          // Render frontend
          if (hostname.includes('.onrender.com')) {
            const clientUrl = `${refererUrl.protocol}//${hostname}`;
            if (process.env.NODE_ENV !== 'production') {
              console.log(`📍 Detected Render from referer: ${clientUrl}`);
            }
            return clientUrl;
          }
          
          // Network IP
          if (hostname.match(/^192\.168\.|^10\.|^172\.(1[6-9]|2[0-9]|3[01])\./)) {
            const clientUrl = `${refererUrl.protocol}//${hostname}:${refererUrl.port || '3001'}`;
            if (process.env.NODE_ENV !== 'production') {
              console.log(`📍 Detected network IP from referer: ${clientUrl}`);
            }
            return clientUrl;
          }
          
          // Other hostname
          if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
            const clientUrl = `${refererUrl.protocol}//${hostname}${refererUrl.port ? ':' + refererUrl.port : ''}`;
            if (process.env.NODE_ENV !== 'production') {
              console.log(`📍 Using referer: ${clientUrl}`);
            }
            return clientUrl;
          }
        } catch (e) {
          if (process.env.NODE_ENV !== 'production') {
            console.log('⚠️  Could not parse referer:', e.message);
          }
        }
      }
      
      // Priority 4: Production environment variable
      if (process.env.NODE_ENV === 'production' && process.env.CLIENT_URL) {
        return process.env.CLIENT_URL;
      }
      
      // Priority 5: If on Render and no CLIENT_URL, try to construct Vercel URL
      // This is a fallback for when frontend is on Vercel but CLIENT_URL not set
      if (isRender && process.env.VERCEL_URL) {
        const clientUrl = `https://${process.env.VERCEL_URL}`;
        if (process.env.NODE_ENV !== 'production') {
          console.log(`📍 Using VERCEL_URL env var: ${clientUrl}`);
        }
        return clientUrl;
      }
      
      // Default: localhost for local development
      if (process.env.NODE_ENV !== 'production') {
        console.log(`📍 Using default: http://localhost:3001`);
      }
      return 'http://localhost:3001';
    };
    
    try {
      if (!req.user || !req.user._id) {
        console.error('OAuth callback: No user in request');
        const clientUrl = getClientUrl(req);
        console.log(`🔀 Redirecting to: ${clientUrl}/login (no user in callback)`);
        return res.redirect(`${clientUrl}/login?error=no_user`);
      }

      // Sign JWT token
      const token = jwt.sign(
        { userId: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Determine if we're using HTTPS (check proxy headers)
      // Always use secure cookies in production (Render/Vercel)
      const isSecure = req.secure || 
                      req.headers['x-forwarded-proto'] === 'https' || 
                      req.headers['x-forwarded-ssl'] === 'on' ||
                      isProduction ||
                      isRender;
      
      // Get client URL before setting cookie
      const clientUrl = getClientUrl(req);
      
      // Cookie configuration - optimized for cross-domain (Vercel frontend + Render backend)
      const cookieOptions = {
        httpOnly: true,
        secure: isSecure,
        sameSite: isSecure ? 'none' : 'lax', // 'none' allows cross-domain cookies
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
        domain: undefined // Don't set domain - let browser handle it
      };

      // Only set sameSite: 'none' if secure is true (required by browsers)
      if (!isSecure && cookieOptions.sameSite === 'none') {
        cookieOptions.sameSite = 'lax';
      }

      if (process.env.NODE_ENV !== 'production') {
        console.log(`🍪 Setting auth cookie:`, {
          secure: cookieOptions.secure,
          sameSite: cookieOptions.sameSite,
          httpOnly: cookieOptions.httpOnly,
          clientUrl: clientUrl
        });
      }

      res.cookie('token', token, cookieOptions);

      // Also send token in redirect URL as fallback (for immediate auth check)
      // This ensures auth works even if cookie takes a moment to be set
      // NOTE: Frontend will immediately remove token from URL for security
      const redirectUrl = `${clientUrl}/dashboard?token=${token}`;
      if (process.env.NODE_ENV !== 'production') {
        console.log(`✅ OAuth successful! Redirecting to: ${clientUrl}/dashboard`);
      }
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('OAuth callback error:', error);
      console.error('Error stack:', error.stack);
      
      const clientUrl = getClientUrl(req);
      console.log(`🔀 Redirecting to: ${clientUrl}/login (callback error)`);
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

