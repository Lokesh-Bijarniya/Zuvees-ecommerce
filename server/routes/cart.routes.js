const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth');

// All cart routes require authentication
router.use(protect);

// Get user's cart
router.get('/', cartController.getCart);

// Add or update an item in the cart
router.post('/', cartController.addOrUpdateCart);

// Remove an item from the cart
router.delete('/item', cartController.removeCartItem);

// Clear the cart
router.delete('/', cartController.clearCart);

module.exports = router;
