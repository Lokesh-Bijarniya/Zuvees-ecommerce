const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  validateProduct
} = require('../controllers/product.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Add review to product (authenticated users)
router.post('/:id/reviews', protect, addProductReview);

// Admin only routes
router.post('/', validateProduct, protect, authorize('admin'), createProduct);
router.put('/:id', validateProduct, protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
