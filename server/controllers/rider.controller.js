const Order = require('../models/Order');
const User = require('../models/User');
const { notifyOrderStatus } = require('./order.controller');

// @desc    Get rider's assigned orders
// @route   GET /api/rider/orders
// @access  Private/Rider
exports.getRiderOrders = async (req, res) => {
  try {
    const orders = await Order.find({ rider: req.user.id })
      .populate('items.product', 'name images')
      .populate('user', 'name email address phone')
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Update order status by rider
// @route   PUT /api/rider/orders/:id
// @access  Private/Rider
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    
    if (!orderStatus) {
      return res.status(400).json({ message: 'Please provide order status' });
    }
    
    // Riders can only update to delivered or undelivered
    if (!['delivered', 'undelivered'].includes(orderStatus)) {
      return res.status(400).json({ 
        message: 'Riders can only update order status to delivered or undelivered' 
      });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if order is assigned to this rider
    if (order.rider.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }
    
    // Check if order is in shipped status
    if (order.orderStatus !== 'shipped') {
      return res.status(400).json({ 
        message: 'Can only update orders that are in shipped status' 
      });
    }
    
    order.orderStatus = orderStatus;
    
    const updatedOrder = await order.save();
    
    // Send email notification to user on status update
    const user = await User.findById(order.user);
    await notifyOrderStatus(order, user, orderStatus);

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get single order details for rider
// @route   GET /api/rider/orders/:id
// @access  Private/Rider
exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name description images')
      .populate('user', 'name email address phone');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if order is assigned to this rider
    if (order.rider.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
