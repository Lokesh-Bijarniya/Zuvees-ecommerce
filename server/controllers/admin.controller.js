const Order = require('../models/Order');
const User = require('../models/User');
const ApprovedEmail = require('../models/ApprovedEmail');
const { notifyOrderStatus } = require('./order.controller');

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.product', 'name images')
      .populate('user', 'name email')
      .populate('rider', 'name email')
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

// @desc    Update order status
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, riderId } = req.body;
    
    if (!orderStatus) {
      return res.status(400).json({ message: 'Please provide order status' });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // If changing to shipped status, a rider must be assigned
    if (orderStatus === 'shipped' && !riderId) {
      return res.status(400).json({ message: 'Please assign a rider when shipping an order' });
    }
    
    // If assigning a rider, check if rider exists and has rider role
    if (riderId) {
      const rider = await User.findById(riderId);
      
      if (!rider) {
        return res.status(404).json({ message: 'Rider not found' });
      }
      
      if (rider.role !== 'rider') {
        return res.status(400).json({ message: 'Assigned user is not a rider' });
      }
      
      order.rider = riderId;
    }
    
    order.orderStatus = orderStatus;
    
    const updatedOrder = await order.save();

    // Send email notification to user on status update
    const user = await User.findById(order.user);
    await notifyOrderStatus(order, user, orderStatus);

    // ===== Socket.io Notification Logic =====
    // Notify the user in real time about order status update
    const io = req.app.get('io');
    io.to(`order_${order._id}`).emit('orderStatusUpdate', {
      orderId: order._id,
      status: updatedOrder.orderStatus,
      updatedAt: updatedOrder.updatedAt,
    });
    // ========================================

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get all riders
// @route   GET /api/admin/riders
// @access  Private/Admin
exports.getAllRiders = async (req, res) => {
  try {
    const riders = await User.find({ role: 'rider' }).select('-__v');
    
    res.status(200).json({
      success: true,
      count: riders.length,
      data: riders
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Add approved email
// @route   POST /api/admin/approved-emails
// @access  Private/Admin
exports.addApprovedEmail = async (req, res) => {
  try {
    const { email, role } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Please provide email' });
    }
    
    // Check if email already exists
    const existingEmail = await ApprovedEmail.findOne({ email });
    
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already approved' });
    }
    
    // Create new approved email
    const approvedEmail = await ApprovedEmail.create({
      email,
      role: role || 'customer'
    });
    
    res.status(201).json({
      success: true,
      data: approvedEmail
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get all approved emails
// @route   GET /api/admin/approved-emails
// @access  Private/Admin
exports.getApprovedEmails = async (req, res) => {
  try {
    const approvedEmails = await ApprovedEmail.find();
    
    res.status(200).json({
      success: true,
      count: approvedEmails.length,
      data: approvedEmails
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Delete approved email
// @route   DELETE /api/admin/approved-emails/:id
// @access  Private/Admin
exports.deleteApprovedEmail = async (req, res) => {
  try {
    const approvedEmail = await ApprovedEmail.findById(req.params.id);
    
    if (!approvedEmail) {
      return res.status(404).json({ message: 'Approved email not found' });
    }
    
    await approvedEmail.remove();
    
    res.status(200).json({
      success: true,
      message: 'Approved email deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
