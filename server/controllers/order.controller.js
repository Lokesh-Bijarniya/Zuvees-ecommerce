const Order = require('../models/Order');
const User = require('../models/User');
const { sendMail } = require('../utils/mailer');

// Helper to get io from req.app
const getIO = (req) => req.app.get('io');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    // Add user ID to request body
    req.body.user = req.user.id;
    
    // Create order
    const order = await Order.create(req.body);
    
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get all orders for current user
// @route   GET /api/orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name images')
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

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name description images')
      .populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if order belongs to user or user is admin/rider
    if (
      order.user._id.toString() !== req.user.id && 
      req.user.role !== 'admin' && 
      (req.user.role !== 'rider' || order.rider?.toString() !== req.user.id)
    ) {
      return res.status(403).json({ message: 'Not authorized to access this order' });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if order belongs to user
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }
    
    // Update order
    order.paymentStatus = 'paid';
    order.orderStatus = 'paid';
    order.paymentMethod = req.body.paymentMethod || order.paymentMethod;
    
    const updatedOrder = await order.save();
    
    // Emit Socket.io real-time event 'orderStatusUpdate'
    const io = getIO(req);
    io.to(`order_${order._id}`).emit('orderStatusUpdate', { orderId: order._id, status: order.orderStatus });
    
    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if order belongs to user
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }
    
    // Check if order can be cancelled
    if (['shipped', 'delivered'].includes(order.orderStatus)) {
      return res.status(400).json({ message: 'Cannot cancel order that has been shipped or delivered' });
    }
    
    // Update order
    order.orderStatus = 'cancelled';
    
    const updatedOrder = await order.save();
    
    // Notify user on order status update
    const user = await User.findById(order.user);
    await notifyOrderStatus(order, user, 'cancelled');
    
    // Emit Socket.io real-time event 'orderStatusUpdate'
    const io = getIO(req);
    io.to(`order_${order._id}`).emit('orderStatusUpdate', { orderId: order._id, status: order.orderStatus });
    
    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Notify user on order status update
async function notifyOrderStatus(order, user, status) {
  // Email notification
  if (user.email) {
    await sendMail({
      to: user.email,
      subject: `Order #${order._id} - ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #f8f8f8; padding: 24px; border-radius: 8px; max-width: 480px; margin: auto;">
          <h2 style="color: #3f51b5;">Hello${user.name ? ', ' + user.name : ''}!</h2>
          <p style="font-size: 16px; color: #222;">Your order <b>#${order._id}</b> status has been updated:</p>
          <div style="margin: 20px 0; padding: 18px; background: #e3f2fd; border-radius: 6px;">
            <span style="font-size: 18px; color: #00796b; font-weight: bold;">${status.toUpperCase()}</span>
          </div>
          <h3 style="margin-top:30px; color:#3f51b5;">Order Summary</h3>
          <table style="width:100%; background:#fff; border-radius:6px; overflow:hidden; border-collapse:collapse; margin-bottom:16px;">
            <thead>
              <tr style="background:#e3f2fd;">
                <th align="left" style="padding:8px; font-size:14px;">Product</th>
                <th align="left" style="padding:8px; font-size:14px;">Variant</th>
                <th align="center" style="padding:8px; font-size:14px;">Qty</th>
                <th align="right" style="padding:8px; font-size:14px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td style="padding:8px; border-top:1px solid #f0f0f0;">${item.product?.name || 'Product'}</td>
                  <td style="padding:8px; border-top:1px solid #f0f0f0;">${item.variant?.size || ''} ${item.variant?.color?.name ? '(' + item.variant.color.name + ')' : ''}</td>
                  <td align="center" style="padding:8px; border-top:1px solid #f0f0f0;">${item.quantity}</td>
                  <td align="right" style="padding:8px; border-top:1px solid #f0f0f0;">₹${item.variant?.price ? item.variant.price.toFixed(2) : '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div style="text-align:right; font-size:16px; color:#222; margin-bottom:16px;">
            <b>Total: ₹${order.totalAmount.toFixed(2)}</b>
          </div>
          <p style="font-size: 15px; color: #444;">You can view your order details by logging into your account.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
          <p style="font-size: 13px; color: #888;">Thank you for shopping with <b>Zuvee</b>, ${user.name ? user.name : 'valued customer'}!<br>Zuvee Team</p>
        </div>
      `
    });
  }
  // SMS notification removed
}
