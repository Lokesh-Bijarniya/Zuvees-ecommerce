const express = require('express');
const router = express.Router();
const { getOrdersPerDay, getUserSignupsPerDay, getTopProducts } = require('../controllers/analytics.controller');
const { protect, authorize } = require('../middleware/auth');

// All analytics routes are admin-only
router.get('/orders-per-day', protect, authorize('admin'), getOrdersPerDay);
router.get('/user-signups-per-day', protect, authorize('admin'), getUserSignupsPerDay);
router.get('/top-products', protect, authorize('admin'), getTopProducts);

module.exports = router;
