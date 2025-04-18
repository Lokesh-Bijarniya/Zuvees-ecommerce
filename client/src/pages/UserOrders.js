import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaCalendarAlt, FaCreditCard, FaTruck, FaSearch, FaFilter, FaTimes, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatPrice, getMyOrders } from '../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const UserOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again later.');
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-400/20 text-yellow-200 border border-yellow-400/40 shadow-yellow-400/20',
      processing: 'bg-blue-400/20 text-blue-200 border border-blue-400/40 shadow-blue-400/20',
      shipped: 'bg-indigo-400/20 text-indigo-200 border border-indigo-400/40 shadow-indigo-400/20',
      delivered: 'bg-green-400/20 text-green-200 border border-green-400/40 shadow-green-400/20',
      cancelled: 'bg-red-400/20 text-red-200 border border-red-400/40 shadow-red-400/20',
    };
    const statusIcons = {
      pending: <FaClock className="mr-1" />,
      processing: <FaTruck className="mr-1 animate-bounce" />,
      shipped: <FaTruck className="mr-1 animate-spin-slow" />,
      delivered: <FaCheckCircle className="mr-1 animate-pulse" />,
      cancelled: <FaTimesCircle className="mr-1" />,
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold glass-badge shadow-md backdrop-blur ${statusStyles[status] || 'bg-white/10 text-blue-100 border border-white/20'}`}
        >
        {statusIcons[status]}
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const OrdersSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white/10 rounded-2xl shadow-2xl border border-white/10 h-32 w-full flex items-center px-8 space-x-6">
          <div className="w-12 h-12 rounded-full bg-blue-900/30" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 bg-blue-900/30 rounded" />
            <div className="h-3 w-1/4 bg-blue-900/20 rounded" />
          </div>
        </div>
      ))}
    </div>
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
  };

  const filteredOrders = orders?.length > 0 ?
    orders
      .filter(order => filterStatus === 'all' || order.orderStatus === filterStatus)
      .filter(order =>
        searchTerm === '' ||
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.product.name.toLowerCase().includes(searchTerm.toLowerCase()))
      ) : [];

  const toggleOrderExpand = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancellingOrderId(orderId);
    try {
      await api.put(`/orders/${orderId}/cancel`);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: 'cancelled' } : order
        )
      );
    } catch (err) {
      alert('Failed to cancel order. Please try again.');
    }
    setCancellingOrderId(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 flex items-center justify-center">
        <div className="bg-blue-900/30 border-l-4 border-blue-400/60 p-6 rounded-2xl shadow-xl text-blue-200 max-w-md w-full backdrop-blur-md">
          <p className="text-blue-100 text-lg">Please log in to view your orders.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 flex items-center justify-center">
        <div className="w-full max-w-3xl"><OrdersSkeleton /></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 flex items-center justify-center">
        <div className="bg-red-900/30 border-l-4 border-red-400/60 p-6 rounded-2xl shadow-xl text-red-200 max-w-md w-full backdrop-blur-md">
          <p className="text-red-100 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 py-12 mt-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-blue-200 drop-shadow-lg">My Orders</h1>
        {/* Search and Filter Bar */}
        <div className="mb-8 bg-gradient-to-r from-blue-900/60 via-gray-900/60 to-blue-900/60 rounded-2xl shadow-xl p-4 backdrop-blur border border-blue-400/20">
          <div className="md:flex justify-between items-center">
            <div className="relative md:w-1/2 mb-4 md:mb-0">
              <input
                type="text"
                placeholder="Search orders by ID or product name..."
                className="w-full pl-10 pr-4 py-2 border border-blue-400/40 rounded-lg bg-blue-950/60 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400/40 placeholder:text-blue-200/60 backdrop-blur"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-blue-100"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <div className="flex space-x-2">
              <div className="relative">
                <select
                  className="appearance-none pl-10 pr-8 py-2 border border-blue-400/40 rounded-lg bg-blue-950/60 text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400/40 backdrop-blur"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" />
              </div>
            </div>
          </div>
        </div>
        {filteredOrders.length === 0 ? (
          <motion.div 
            className="bg-white/10 rounded-2xl shadow-xl overflow-hidden text-center py-16 border border-white/10 backdrop-blur"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FaBox size={50} className="mx-auto text-blue-900/40 mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold text-blue-100 mb-2">No Orders Found</h3>
            {searchTerm || filterStatus !== 'all' ? (
              <p className="text-blue-200/70 mb-6">Try adjusting your search or filter criteria.</p>
            ) : (
              <p className="text-blue-200/70 mb-6">You haven't placed any orders yet.</p>
            )}
            <Link to="/products">
              <button className="bg-blue-500/90 hover:bg-blue-600/80 text-white px-6 py-2 rounded-lg transition-colors shadow border border-blue-400/40 backdrop-blur">
                Browse Products
              </button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-6"
            initial="hidden"
            animate="show"
            variants={{}}
          >
            {filteredOrders.map((order, i) => (
              <motion.div 
                key={order._id}
                className="bg-white/10 rounded-2xl shadow-2xl overflow-hidden border border-white/10 hover:shadow-blue-400/40 hover:shadow-lg transition-shadow duration-300 backdrop-blur group"
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="show"
                whileHover={{ scale: 1.025, boxShadow: '0 0 40px 0 rgba(96,165,250,0.25)' }}
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-blue-900/40 to-teal-900/30 p-5 border-b border-white/10 flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="flex items-center mb-3 md:mb-0">
                    <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center mr-4 shadow-sm">
                      <FaBox className="text-blue-300 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-blue-100 tracking-wide">Order #{order._id.substring(order._id.length - 8)}</h3>
                      <div className="flex items-center text-xs text-blue-200/80 mt-1">
                        <FaCalendarAlt className="mr-1" size={12} />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(order.orderStatus)}
                    <button 
                      onClick={() => toggleOrderExpand(order._id)}
                      className="text-blue-200 hover:text-white font-semibold text-sm transition-colors border border-blue-400/30 bg-white/10 px-4 py-1 rounded-lg shadow-sm backdrop-blur"
                    >
                      {expandedOrderId === order._id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                </div>
                {/* Minimal Details (only when not expanded) */}
                {expandedOrderId !== order._id && (
                  <div className="p-5 bg-blue-900/10 border-b border-white/10 flex flex-wrap items-center justify-between">
                    <div className="flex items-center">
                      {order?.items?.slice(0, 1).map((item) => (
                        <img
                          key={item._id}
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-14 h-14 object-cover rounded-xl border border-blue-400/20 mr-4 shadow"
                        />
                      ))}
                      <div>
                        <div className="font-semibold text-blue-100">{order.items[0]?.product.name}</div>
                        <div className="text-xs text-blue-200/80">{formatPrice(order.items[0]?.variant.price)} × {order.items[0]?.quantity}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-200/60 text-xs uppercase tracking-widest">Total</div>
                      <div className="font-extrabold text-blue-400 text-lg drop-shadow-glow animate-pulse">{formatPrice(order.totalAmount)}</div>
                    </div>
                  </div>
                )}
                {/* Order Details (Expandable) */}
                <AnimatePresence>
                  {expandedOrderId === order._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 md:flex border-b border-white/10 bg-blue-900/30 backdrop-blur">
                        {/* Order Items */}
                        <div className="md:w-2/3 pr-8 mb-8 md:mb-0">
                          <h4 className="font-semibold mb-4 text-blue-200 text-lg">Order Items</h4>
                          <div className="space-y-4">
                            {order?.items?.map((item) => (
                              <div key={item._id} className="flex items-center">
                                <img 
                                  src={item.product.images[0]} 
                                  alt={item.product.name} 
                                  className="w-16 h-16 object-cover rounded-lg border border-blue-400/20 mr-5 shadow"
                                />
                                <div>
                                  <h5 className="font-semibold text-blue-100">{item.product.name}</h5>
                                  <div className="text-xs text-blue-200/80 mb-1">
                                    {item.variant.size} / {item.variant.color.name}
                                  </div>
                                  <div className="text-xs text-blue-200/80">
                                    {formatPrice(item.variant.price)} × {item.quantity}
                                  </div>
                                  <div className="font-bold text-blue-300">
                                    {formatPrice(item.variant.price * item.quantity)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        {/* Order Info */}
                        <div className="md:w-1/3 md:border-l md:border-white/10 md:pl-8">
                          <div className="mb-8">
                            <h4 className="font-semibold mb-2 text-blue-200">Shipping Address</h4>
                            <address className="text-sm text-blue-100/80 not-italic">
                              {order.shippingAddress.street}<br />
                              {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                              {order.shippingAddress.country}
                            </address>
                          </div>
                          <div className="mb-8">
                            <h4 className="font-semibold mb-2 text-blue-200">Payment Method</h4>
                            <div className="flex items-center text-sm text-blue-100/80">
                              <FaCreditCard className="mr-2" />
                              {order.paymentMethod}
                            </div>
                            <div className="mt-2">
                              {order.paymentStatus === 'paid' ? (
                                <span className="text-xs bg-green-800/80 text-green-100 px-2 py-1 rounded-full font-semibold">
                                  Paid
                                </span>
                              ) : (
                                <span className="text-xs bg-yellow-800/80 text-yellow-100 px-2 py-1 rounded-full font-semibold">
                                  Not Paid
                                </span>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 text-blue-200">Order Summary</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between font-bold pt-2 border-t border-white/10 mt-2">
                                <span>Total:</span>
                                <span className="text-blue-400 drop-shadow-glow animate-pulse">{formatPrice(order.totalAmount)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-5 bg-blue-900/10 flex flex-col md:flex-row justify-between items-center border-t border-white/10">
                        <div className="flex items-center text-sm text-blue-100 mb-3 md:mb-0">
                          <FaTruck className="mr-2 text-blue-400" />
                          {order.orderStatus === 'delivered' ? (
                            <span>Delivered on {formatDate(order.updatedAt)}</span>
                          ) : (
                            <span>Status: {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}</span>
                          )}
                        </div>
                        <div className="flex items-center">
                          <Link to={`/orders/${order._id}`}>
                            <button className="relative overflow-hidden bg-gradient-to-br from-blue-700/90 via-blue-800/80 to-blue-900/90 text-white text-sm px-5 py-2 rounded-lg transition-all duration-300 border border-blue-400/40 backdrop-blur group hover:scale-105 focus:outline-none">
                              <span className="absolute inset-0 bg-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
                              <span className="relative z-10 font-semibold tracking-wide flex items-center">
                                <FaSearch className="mr-2" /> View Full Details
                              </span>
                            </button>
                          </Link>
                          {!['shipped', 'delivered', 'cancelled'].includes(order.orderStatus) && (
                            <button
                              className="relative overflow-hidden bg-gradient-to-r from-red-500/80 via-red-600/80 to-red-700/80 text-white text-sm px-5 py-2 rounded-lg transition-all duration-300 ml-3 border border-red-400/30 backdrop-blur group hover:scale-105 hover:shadow-red-400/30 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                              onClick={() => handleCancelOrder(order._id)}
                              disabled={cancellingOrderId === order._id}
                            >
                              <span className="absolute inset-0 bg-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
                              <span className="relative z-10 font-semibold tracking-wide flex items-center">
                                <FaTimes className="mr-2" />
                                {cancellingOrderId === order._id ? 'Cancelling...' : 'Cancel Order'}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;
