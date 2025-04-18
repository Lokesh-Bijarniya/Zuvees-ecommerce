const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderToPaid,
  cancelOrder
} = require('../controllers/order.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .post(createOrder)
  .get(getMyOrders);

router.route('/:id')
  .get(getOrder);

router.route('/:id/pay')
  .put(updateOrderToPaid);

router.route('/:id/cancel')
  .put(cancelOrder);

module.exports = router;
