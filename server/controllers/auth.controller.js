const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApprovedEmail = require('../models/ApprovedEmail');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
exports.googleCallback = async (req, res) => {
  try {
    // Generate token
    const token = generateToken(req.user.id);
    
    // Set cookie options
    const options = {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none'
    };
    
    // Determine redirect URL based on user role
    let redirectUrl;
    if (req.user.role === 'admin') {
      redirectUrl = `${process.env.CLIENT_URL}/admin/dashboard`;
    } else if (req.user.role === 'rider') {
      redirectUrl = `${process.env.RIDER_URL}/dashboard`;
    } else {
      console.log('Invalid user role:', req.user.role);
      redirectUrl = `${process.env.CLIENT_URL}`;
    }
    
    // Set cookie and redirect
    res.cookie('token', token, options);
    res.redirect(redirectUrl);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Public
exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none'
  });
  
  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
};

// @desc    Check if email is approved
// @route   POST /api/auth/check-email
// @access  Public
exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Please provide an email' });
    }
    
    const approvedEmail = await ApprovedEmail.findOne({ email });
    
    if (!approvedEmail) {
      return res.status(403).json({ 
        success: false,
        message: 'Email not approved for access' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Email is approved',
      role: approvedEmail.role
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
