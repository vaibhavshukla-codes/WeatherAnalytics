const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `http://localhost:${process.env.PORT || 5001}/api/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    if (!profile || !profile.id) {
      return done(new Error('Invalid profile data'), null);
    }

    let user = await User.findOne({ googleId: profile.id });
    
    if (!user) {
      // Create new user with safe defaults
      user = await User.create({
        googleId: profile.id,
        email: profile.emails?.[0]?.value || 'unknown@example.com',
        name: profile.displayName || 'User',
        picture: profile.photos?.[0]?.value || '',
        favorites: []
      });
    }
    
    return done(null, user);
  } catch (error) {
    console.error('OAuth error:', error);
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
  passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:3001/login' }),
  (req, res) => {
    try {
      if (!req.user || !req.user._id) {
        return res.redirect('http://localhost:3001/login');
      }

      const token = jwt.sign(
        { userId: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Always redirect to port 3001 /dashboard (this project)
      res.redirect('http://localhost:3001/dashboard');
    } catch (error) {
      console.error('Callback error:', error);
      res.redirect('http://localhost:3001/login');
    }
  }
);

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('token');
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
