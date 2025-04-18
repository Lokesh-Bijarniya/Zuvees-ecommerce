const express = require('express');
const {
  getRiderOrders,
  updateOrderStatus,
  getOrderDetails
} = require('../controllers/rider.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require rider authentication
router.use(protect);
router.use(authorize('rider'));

router.route('/orders')
  .get(getRiderOrders);

router.route('/orders/:id')
  .get(getOrderDetails)
  .put(updateOrderStatus);

module.exports = router;
