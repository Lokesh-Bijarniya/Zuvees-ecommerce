import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaTruck, FaCreditCard } from 'react-icons/fa';
import { formatDate, formatPrice } from '../utils/helpers';
import api from '../utils/api';
import { motion } from 'framer-motion';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}`);
        setOrder(data.data);
      } catch (err) {
        setError('Order not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
        <div className="w-16 h-16 border-t-4 border-blue-400 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-blue-100">
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <p className="mb-6">We couldn't find the order you're looking for.</p>
        <Link to="/my-orders" className="text-blue-400 hover:underline flex items-center">
          <FaArrowLeft className="mr-2" /> Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 py-12 mt-16">
      <div className="container mx-auto max-w-3xl px-4">
        <Link to="/my-orders" className="inline-flex items-center text-blue-400 hover:underline mb-8">
          <FaArrowLeft className="mr-2" /> Back to Orders
        </Link>
        <motion.div
          className="bg-white/10 rounded-2xl shadow-2xl border border-white/10 backdrop-blur p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-blue-200 mb-2">Order #{order._id}</h1>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <FaTruck className="mr-2 text-blue-400" />
              <span className="text-blue-100">{order.orderStatus ? (order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)) : 'Unknown'}</span>
            </div>
            <div className="text-sm text-blue-200">Placed on {formatDate(order.createdAt)}</div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="font-semibold text-blue-200 mb-2">Order Items</h2>
              <div className="space-y-4">
                {(order.items || []).map(item => (
                  <div key={item._id} className="flex items-center">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg border border-blue-400/20 mr-5 shadow" />
                    <div>
                      <div className="font-semibold text-blue-100">{item.product.name}</div>
                      <div className="text-xs text-blue-200/80 mb-1">{item.variant.size} / {item.variant.color.name}</div>
                      <div className="text-xs text-blue-200/80">{formatPrice(item.variant.price)} × {item.quantity}</div>
                      <div className="font-bold text-blue-300">{formatPrice(item.variant.price * item.quantity)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-semibold text-blue-200 mb-2">Shipping Address</h2>
              <address className="text-sm text-blue-100/80 not-italic mb-6">
                {order.shippingAddress?.street || '-'}<br />
                {order.shippingAddress?.city || ''}{order.shippingAddress?.city ? ',' : ''} {order.shippingAddress?.postalCode || ''}<br />
                {order.shippingAddress?.country || ''}
              </address>
              <h2 className="font-semibold text-blue-200 mb-2">Payment</h2>
              <div className="flex items-center text-blue-100/80 mb-2">
                <FaCreditCard className="mr-2" /> {order.paymentMethod}
              </div>
              <div className="mb-2">
                {order.paymentStatus === 'paid' ? (
                  <span className="text-xs bg-green-800/80 text-green-100 px-2 py-1 rounded-full font-semibold">Paid</span>
                ) : (
                  <span className="text-xs bg-yellow-800/80 text-yellow-100 px-2 py-1 rounded-full font-semibold">Not Paid</span>
                )}
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-white/10 mt-2">
                <span>Total:</span>
                <span className="text-blue-400 drop-shadow-glow animate-pulse">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetail;
