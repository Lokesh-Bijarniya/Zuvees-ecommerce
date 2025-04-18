const express = require('express');
const passport = require('passport');
const { getMe, googleCallback, logout, checkEmail } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleCallback
);

// User routes
router.get('/me', protect, getMe);
router.get('/logout', logout);
router.post('/check-email', checkEmail);

module.exports = router;
