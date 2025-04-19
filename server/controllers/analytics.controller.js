const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Get orders per day for the last 30 days
async function getOrdersPerDay(req, res) {
  const days = parseInt(req.query.days, 10) || 30;
  const since = new Date();
  since.setDate(since.getDate() - days);
  const data = await Order.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: {
      _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
      count: { $sum: 1 },
      revenue: { $sum: '$totalPrice' }
    } },
    { $sort: { _id: 1 } }
  ]);
  res.json({ success: true, data });
}

// Get user signups per day for the last 30 days
async function getUserSignupsPerDay(req, res) {
  const days = parseInt(req.query.days, 10) || 30;
  const since = new Date();
  since.setDate(since.getDate() - days);
  const data = await User.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: {
      _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
      count: { $sum: 1 }
    } },
    { $sort: { _id: 1 } }
  ]);
  res.json({ success: true, data });
}

// Get top products by sales
async function getTopProducts(req, res) {
  const limit = parseInt(req.query.limit, 10) || 5;
  const data = await Order.aggregate([
    { $unwind: '$orderItems' },
    { $group: {
      _id: '$orderItems.product',
      totalSold: { $sum: '$orderItems.qty' },
      totalRevenue: { $sum: '$orderItems.price' }
    } },
    { $sort: { totalSold: -1 } },
    { $limit: limit },
    { $lookup: {
      from: 'products',
      localField: '_id',
      foreignField: '_id',
      as: 'product'
    } },
    { $unwind: '$product' }
  ]);
  res.json({ success: true, data });
}

module.exports = {
  getOrdersPerDay,
  getUserSignupsPerDay,
  getTopProducts
};
