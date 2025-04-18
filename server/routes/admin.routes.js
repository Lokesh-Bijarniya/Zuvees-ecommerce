const express = require('express');
const {
  getAllOrders,
  updateOrderStatus,
  getAllRiders,
  addApprovedEmail,
  getApprovedEmails,
  deleteApprovedEmail
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// Order routes
router.route('/orders')
  .get(getAllOrders);

router.route('/orders/:id')
  .put(updateOrderStatus);

// Rider routes
router.route('/riders')
  .get(getAllRiders);

// Approved emails routes
router.route('/approved-emails')
  .get(getApprovedEmails)
  .post(addApprovedEmail);

router.route('/approved-emails/:id')
  .delete(deleteApprovedEmail);

module.exports = router;
