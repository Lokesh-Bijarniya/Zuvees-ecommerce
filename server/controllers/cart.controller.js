const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get the user's cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json(cart || { user: req.user._id, items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cart', error: err.message });
  }
};

// Add or update items in the cart
exports.addOrUpdateCart = async (req, res) => {
  try {
    const { product, variant, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }
    // Check if item (product + variant) already exists
    const idx = cart.items.findIndex(
      i => i.product.toString() === product && i.variant.size === variant.size && i.variant.color.name === variant.color.name
    );
    if (idx > -1) {
      // Update quantity
      cart.items[idx].quantity = quantity;
      if (quantity <= 0) cart.items.splice(idx, 1);
    } else {
      // Add new item
      cart.items.push({ product, variant, quantity });
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update cart', error: err.message });
  }
};

// Remove an item from the cart
exports.removeCartItem = async (req, res) => {
  try {
    const { product, variant } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(
      i => !(i.product.toString() === product && i.variant.size === variant.size && i.variant.color.name === variant.color.name)
    );
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove item', error: err.message });
  }
};

// Clear the cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear cart', error: err.message });
  }
};
