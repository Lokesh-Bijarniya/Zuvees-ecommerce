const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, uploadAvatar, upload } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth');

// All routes in this file are protected and require authentication
router.use(protect);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', updateUserProfile);

// Avatar upload endpoint
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;
