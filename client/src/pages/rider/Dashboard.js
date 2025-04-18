import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMotorcycle, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaBox } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { getRiderOrders, updateRiderOrderStatus } from '../../utils/api';
import Spinner from '../../components/Spinner';

const RiderDashboard = () => {
  const { user, isAuthenticated, isRider } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [orders, setOrders] = useState({
    active: [],
    completed: []
  });

  // Redirect if not authenticated or not rider
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isRider) {
      navigate('/');
    }
  }, [isAuthenticated, isRider, navigate]);

  // Fetch rider orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        const response = await getRiderOrders();
        const ordersData = response.data;
        
        // Separate active and completed orders
        const active = ordersData.filter(order => order.orderStatus === 'shipped');
        const completed = ordersData.filter(order => 
          order.orderStatus === 'delivered' || order.orderStatus === 'undelivered'
        );
        
        setOrders({
          active,
          completed
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching rider orders:', err);
        setError('Failed to load orders. Please try again.');
        setLoading(false);
      }
    };

    if (isAuthenticated && isRider) {
      fetchOrders();
    }
  }, [isAuthenticated, isRider]);

  // Handle order status update
  const handleUpdateStatus = async (orderId, status) => {
    try {
      setProcessingOrder(orderId);
      setError(null);
      
      await updateRiderOrderStatus(orderId, { orderStatus: status });
      
      // Update local state
      setOrders(prev => {
        const updatedActive = prev.active.filter(order => order._id !== orderId);
        const updatedOrder = prev.active.find(order => order._id === orderId);
        
        if (!updatedOrder) return prev;
        
        const updatedCompletedOrders = [
          ...prev.completed,
          { ...updatedOrder, orderStatus: status }
        ];
        
        return {
          active: updatedActive,
          completed: updatedCompletedOrders
        };
      });
      
      setSuccessMessage(`Order marked as ${status}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
      setProcessingOrder(null);
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status. Please try again.');
      setProcessingOrder(null);
    }
  };

  if (loading) {
    return <Spinner fullScreen size="large" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="container mx-auto px-4 py-16 mt-16">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-cyan-300 mb-2 drop-shadow">Rider Dashboard</h1>
          <p className="text-cyan-100">Welcome back, {user?.name || 'Rider'}! Manage your deliveries here.</p>
        </div>
        
        {/* Success/Error Messages */}
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
        
        {/* Active Orders Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-cyan-200 mb-4">Active Deliveries</h2>
          {orders.active.length === 0 ? (
            <div className="p-6 rounded-xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-cyan-800/40 shadow-inner-glass text-cyan-300 text-center">
              No active deliveries at the moment.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {orders.active.map(order => (
                <motion.div key={order._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="rounded-xl bg-gradient-to-br from-gray-950/70 via-gray-900/80 to-cyan-900/60 border border-cyan-600/40 shadow-xl-glass p-6 flex flex-col gap-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-cyan-300 font-bold text-lg">#{order._id.slice(-6)}</span>
                    <span className="rounded-full px-3 py-1 text-xs font-semibold bg-cyan-800/80 text-cyan-100 border border-cyan-400/30">Shipped</span>
                  </div>
                  <div className="text-cyan-100 text-sm flex items-center gap-2"><FaMapMarkerAlt className="inline" /> {order.shippingAddress?.city}, {order.shippingAddress?.state}</div>
                  <div className="text-cyan-200 text-xs">{new Date(order.createdAt).toLocaleString()}</div>
                  <div className="flex gap-2 mt-2">
                    <Link to={`/rider/order/${order._id}`} className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-md py-1.5 px-3 text-sm font-semibold shadow hover:from-cyan-500 hover:to-blue-500 transition">View</Link>
                    <button disabled={processingOrder === order._id} onClick={() => handleUpdateStatus(order._id, 'delivered')} className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-md py-1.5 px-3 text-sm font-semibold shadow hover:from-green-500 hover:to-emerald-500 transition disabled:opacity-60">{processingOrder === order._id ? 'Processing...' : 'Mark Delivered'}</button>
                    <button disabled={processingOrder === order._id} onClick={() => handleUpdateStatus(order._id, 'undelivered')} className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-md py-1.5 px-3 text-sm font-semibold shadow hover:from-red-500 hover:to-pink-500 transition disabled:opacity-60">{processingOrder === order._id ? 'Processing...' : 'Undelivered'}</button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
        
        {/* Completed Orders Section */}
        <section>
          <h2 className="text-xl font-semibold text-cyan-200 mb-4">Completed Deliveries</h2>
          {orders.completed.length === 0 ? (
            <div className="p-6 rounded-xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/40 shadow-inner-glass text-gray-400 text-center">
              No completed deliveries yet.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {orders.completed.map(order => (
                <motion.div key={order._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="rounded-xl bg-gradient-to-br from-gray-950/70 via-gray-900/80 to-gray-800/60 border border-gray-700/40 shadow-xl-glass p-6 flex flex-col gap-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-cyan-300 font-bold text-lg">#{order._id.slice(-6)}</span>
                    {order.orderStatus === 'delivered' ? (
                      <span className="rounded-full px-3 py-1 text-xs font-semibold bg-green-700/80 text-green-100 border border-green-400/30 flex items-center"><FaCheckCircle className="mr-1" /> Delivered</span>
                    ) : (
                      <span className="rounded-full px-3 py-1 text-xs font-semibold bg-red-700/80 text-red-100 border border-red-400/30 flex items-center"><FaTimesCircle className="mr-1" /> Undelivered</span>
                    )}
                  </div>
                  <div className="text-cyan-100 text-sm flex items-center gap-2"><FaMapMarkerAlt className="inline" /> {order.shippingAddress?.city}, {order.shippingAddress?.state}</div>
                  <div className="text-cyan-200 text-xs">{new Date(order.createdAt).toLocaleString()}</div>
                  <Link to={`/rider/order/${order._id}`} className="mt-2 bg-gradient-to-r from-cyan-700 to-blue-700 text-white rounded-md py-1.5 px-3 text-sm font-semibold shadow hover:from-cyan-600 hover:to-blue-600 transition text-center">View Details</Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default RiderDashboard;
