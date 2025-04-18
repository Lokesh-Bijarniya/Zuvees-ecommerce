import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { getRiderOrderDetails, updateRiderOrderStatus } from '../../utils/api';
import Spinner from '../../components/Spinner';

const RiderOrderDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, isRider } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [order, setOrder] = useState(null);

  // Redirect if not authenticated or not rider
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isRider) {
      navigate('/');
    }
  }, [isAuthenticated, isRider, navigate]);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        
        const response = await getRiderOrderDetails(id);
        setOrder(response.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details. Please try again.');
        setLoading(false);
      }
    };

    if (isAuthenticated && isRider && id) {
      fetchOrderDetails();
    }
  }, [isAuthenticated, isRider, id]);

  // Handle order status update
  const handleUpdateStatus = async (status) => {
    try {
      setProcessing(true);
      setError(null);
      
      await updateRiderOrderStatus(id, { orderStatus: status });
      
      // Update local state
      setOrder(prev => ({
        ...prev,
        orderStatus: status
      }));
      
      setSuccessMessage(`Order marked as ${status}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
      setProcessing(false);
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) {
    return <Spinner fullScreen size="large" />;
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 mt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or you don't have permission to view it.</p>
          <Link
            to="/rider/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="container mx-auto px-4 py-16 mt-16">
        <div className="mb-8">
          <Link
            to="/rider/dashboard"
            className="inline-flex items-center text-cyan-300 hover:text-cyan-400 transition"
          >
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-cyan-200 mt-4 mb-2 drop-shadow">
            Order #{order._id.slice(-6)}
          </h1>
          <div className="flex items-center">
            <p className="text-cyan-100 mr-3">
              {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
            </p>
            <OrderStatusBadge status={order.orderStatus} />
          </div>
        </div>
        {successMessage && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6 p-4 rounded-lg bg-gradient-to-r from-green-700/80 via-green-600/70 to-green-700/80 text-green-100 shadow-xl-glass border border-green-400/40">
            {successMessage}
          </motion.div>
        )}
        {error && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6 p-4 rounded-lg bg-gradient-to-r from-red-700/80 via-red-600/70 to-red-700/80 text-red-100 shadow-xl-glass border border-red-400/40">
            {error}
          </motion.div>
        )}
        <div className="rounded-xl bg-gradient-to-br from-gray-950/70 via-gray-900/80 to-cyan-900/60 border border-cyan-600/40 shadow-xl-glass p-8 mb-8">
          <h2 className="text-xl font-semibold text-cyan-200 mb-4">Delivery Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <span className="block text-cyan-100 font-medium">Customer</span>
                <span className="block text-cyan-200 text-lg">{order.user?.name}</span>
                <span className="block text-cyan-100 text-sm">{order.user?.email}</span>
                <span className="block text-cyan-100 text-sm"><FaPhone className="inline mr-1" /> {order.user?.phone}</span>
              </div>
              <div className="mb-4">
                <span className="block text-cyan-100 font-medium">Address</span>
                <span className="block text-cyan-200">{order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</span>
              </div>
            </div>
            <div>
              <span className="block text-cyan-100 font-medium mb-2">Order Status</span>
              <OrderStatusBadge status={order.orderStatus} />
              <div className="flex gap-3 mt-4">
                {order.orderStatus === 'shipped' && (
                  <>
                    <button disabled={processing} onClick={() => handleUpdateStatus('delivered')} className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-md py-2 px-4 text-sm font-semibold shadow hover:from-green-500 hover:to-emerald-500 transition disabled:opacity-60">{processing ? 'Processing...' : 'Mark Delivered'}</button>
                    <button disabled={processing} onClick={() => handleUpdateStatus('undelivered')} className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-md py-2 px-4 text-sm font-semibold shadow hover:from-red-500 hover:to-pink-500 transition disabled:opacity-60">{processing ? 'Processing...' : 'Undelivered'}</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-gray-950/70 via-gray-900/80 to-gray-800/60 border border-gray-700/40 shadow-xl-glass p-8">
          <h2 className="text-xl font-semibold text-cyan-200 mb-4">Order Items</h2>
          <div className="divide-y divide-gray-800">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-4 flex items-center gap-4">
                <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg border border-cyan-800/40 shadow" />
                <div className="flex-1">
                  <span className="block text-cyan-100 font-medium">{item.product.name}</span>
                  <span className="block text-cyan-200 text-sm">{item.variant.size} | {item.variant.color.name}</span>
                </div>
                <span className="text-cyan-100 font-semibold">x{item.quantity}</span>
                <span className="text-cyan-200 font-semibold">₹{item.variant.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Order Status Badge Component
const OrderStatusBadge = ({ status }) => {
  let bgColor = '';
  let textColor = '';
  let icon = null;
  
  switch (status) {
    case 'shipped':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      icon = null;
      break;
    case 'delivered':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      icon = <FaCheckCircle className="mr-1" />;
      break;
    case 'undelivered':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      icon = <FaTimesCircle className="mr-1" />;
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      icon = null;
  }
  
  return (
    <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default RiderOrderDetail;
