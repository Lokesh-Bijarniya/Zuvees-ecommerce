const Product = require('../models/Product');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Redis = require('ioredis');
const redisClient = new Redis(process.env.REDIS_URL);

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    // Try to fetch products from Redis cache
    const cachedProducts = await redisClient.get('products:all');
    if (cachedProducts) {
      return res.json({ success: true, count: JSON.parse(cachedProducts).length, data: JSON.parse(cachedProducts) });
    }

    // If not cached, fetch from DB
    const products = await Product.find();

    // Cache the result in Redis for 10 minutes
    await redisClient.set('products:all', JSON.stringify(products), 'EX', 600);

    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    let imageUrls = [];
    // If files are uploaded via multipart/form-data
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'zuvee-products',
        });
        imageUrls.push(result.secure_url);
        // Remove local file after upload
        fs.unlinkSync(file.path);
      }
    } else if (req.body.images && Array.isArray(req.body.images)) {
      // If images are provided as URLs (already uploaded)
      imageUrls = req.body.images;
    }
    const productData = { ...req.body };
    if (imageUrls.length) {
      productData.images = imageUrls;
    }
    const product = await Product.create(productData);
    await redisClient.del('products:all'); // Invalidate cache
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    let imageUrls = product.images || [];
    // If new images are uploaded
    if (req.files && req.files.length > 0) {
      imageUrls = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'zuvee-products',
        });
        imageUrls.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
    } else if (req.body.images && Array.isArray(req.body.images)) {
      imageUrls = req.body.images;
    }
    const updateData = { ...req.body };
    if (imageUrls.length) {
      updateData.images = imageUrls;
    }
    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });
    await redisClient.del('products:all'); // Invalidate cache
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await product.remove();
    await redisClient.del('products:all'); // Invalidate cache
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Add a review to a product
// @route   POST /api/products/:id/reviews
// @access  Private
exports.addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.user && r.user.toString() === req.user.id
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed by this user' });
    }

    const review = {
      user: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.ratings.count = product.reviews.length;
    product.ratings.average = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save();
    // Return the new review and updated ratings for instant UI update
    res.status(201).json({
      message: 'Review added',
      review: product.reviews[product.reviews.length - 1],
      ratings: product.ratings,
      reviews: product.reviews
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Example: Add input validation to product creation
exports.validateProduct = [
  body('name').isString().trim().escape().notEmpty().withMessage('Name is required'),
  body('description').isString().trim().escape(),
  body('category').isString().trim().escape(),
  body('basePrice').isNumeric(),
  body('brand').isString().trim().escape(),
  // Add more validation as needed
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
