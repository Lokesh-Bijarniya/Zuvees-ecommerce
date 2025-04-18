import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserPlus, FaSearch, FaMotorcycle, FaEnvelope, FaPhone, FaShippingFast } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { getAllRiders, getAllOrders, addApprovedEmail } from '../../utils/api';
import Spinner from '../../components/Spinner';

const AdminRiders = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [riders, setRiders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredRiders, setFilteredRiders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRiderEmail, setNewRiderEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Fetch riders and orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch riders
        const ridersResponse = await getAllRiders();
        const ridersData = ridersResponse.data;
        setRiders(ridersData);
        
        // Fetch orders to get rider assignments
        const ordersResponse = await getAllOrders();
        const ordersData = ordersResponse.data;
        setOrders(ordersData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching riders data:', err);
        setError('Failed to load riders. Please try again.');
        setLoading(false);
      }
    };

    if (isAuthenticated && isAdmin) {
      fetchData();
    }
  }, [isAuthenticated, isAdmin]);

  // Apply search filter
  useEffect(() => {
    if (!riders.length) return;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = riders.filter(rider => 
        rider.name.toLowerCase().includes(term) ||
        rider.email.toLowerCase().includes(term) ||
        (rider.phone && rider.phone.includes(term))
      );
      setFilteredRiders(filtered);
    } else {
      setFilteredRiders(riders);
    }
  }, [riders, searchTerm]);

  // Handle add new rider
  const handleAddRider = async (e) => {
    e.preventDefault();
    
    if (!newRiderEmail) {
      setError('Please enter an email address');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(newRiderEmail)) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await addApprovedEmail({
        email: newRiderEmail,
        role: 'rider'
      });
      
      setSuccessMessage(`${newRiderEmail} has been approved as a rider. They can now sign in with Google.`);
      setNewRiderEmail('');
      setIsAddModalOpen(false);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      setIsSubmitting(false);
    } catch (err) {
      console.error('Error adding rider:', err);
      setError('Failed to add rider. The email might already be approved.');
      setIsSubmitting(false);
    }
  };

  // Get active orders for a rider
  const getRiderActiveOrders = (riderId) => {
    return orders.filter(order => 
      order.rider === riderId && order.orderStatus === 'shipped'
    );
  };

  // Get completed orders for a rider
  const getRiderCompletedOrders = (riderId) => {
    return orders.filter(order => 
      order.rider === riderId && 
      (order.orderStatus === 'delivered' || order.orderStatus === 'undelivered')
    );
  };

  if (loading) {
    return <Spinner fullScreen size="large" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16 mt-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-cyan-200 drop-shadow mb-2">
            Manage Riders
          </h1>
          <p className="text-blue-200/80 text-lg">
            View, add, and manage delivery riders for your platform.
          </p>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div 
              className="mb-6 bg-green-900/40 border border-green-400/30 text-green-200 px-4 py-3 rounded-lg shadow"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-900/40 border border-red-400/30 text-red-200 px-4 py-3 rounded-lg shadow">
            {error}
          </div>
        )}

        {/* Search and Add Rider */}
        <div className="bg-white/10 backdrop-blur-xl border border-cyan-200/20 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-cyan-300" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-cyan-400/30 rounded-lg bg-white/5 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder:text-cyan-300/60"
                  placeholder="Search riders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* Add Rider Button */}
              <motion.button
                className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white px-4 py-2 rounded-lg flex items-center font-semibold shadow"
                onClick={() => setIsAddModalOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaUserPlus className="mr-2" />
                Add New Rider
              </motion.button>
            </div>
          </div>
        </div>

        {/* Riders Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/0 backdrop-blur-xl border-none rounded-2xl shadow-xl overflow-x-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2 md:p-8">
            {filteredRiders.length === 0 ? (
              <div className="col-span-full bg-white/10 rounded-xl shadow-md p-8 text-center">
                <div className="flex justify-center mb-4">
                  <FaMotorcycle className="text-cyan-400 text-5xl" />
                </div>
                <h3 className="text-xl font-semibold text-cyan-200 mb-2">No Riders Found</h3>
                <p className="text-cyan-300 mb-4">
                  {searchTerm
                    ? 'No riders match your search criteria.'
                    : 'There are no riders in the system yet.'}
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow"
                >
                  Add Your First Rider
                </button>
              </div>
            ) : (
              filteredRiders.map(rider => {
                const activeOrders = getRiderActiveOrders(rider._id);
                const completedOrders = getRiderCompletedOrders(rider._id);
                return (
                  <motion.div
                    key={rider._id}
                    className="bg-white/10 backdrop-blur-xl border border-cyan-200/20 rounded-xl shadow-md overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <img 
                            src={rider.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(rider.name)}`}
                            alt={rider.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400 shadow"
                          />
                        </div>
                        <div className="ml-4 flex-grow">
                          <h3 className="text-lg font-semibold text-cyan-100">{rider.name}</h3>
                          <div className="flex items-center text-sm text-cyan-200 mt-1">
                            <FaEnvelope className="mr-1" />
                            {rider.email}
                          </div>
                          {rider.phone && (
                            <div className="flex items-center text-sm text-cyan-200 mt-1">
                              <FaPhone className="mr-1" />
                              {rider.phone}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-6 border-t border-cyan-800 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium text-cyan-300">Active Orders</div>
                            <div className="mt-1 flex items-baseline">
                              <div className="text-2xl font-semibold text-cyan-100">{activeOrders.length}</div>
                              <div className="ml-2 text-sm text-cyan-200">assigned</div>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-cyan-300">Completed</div>
                            <div className="mt-1 flex items-baseline">
                              <div className="text-2xl font-semibold text-cyan-100">{completedOrders.length}</div>
                              <div className="ml-2 text-sm text-cyan-200">deliveries</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {activeOrders.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-cyan-100 mb-2">Current Deliveries</h4>
                          <div className="space-y-2">
                            {activeOrders.slice(0, 2).map(order => (
                              <div key={order._id} className="bg-blue-900/40 rounded-lg p-2 text-sm">
                                <div className="flex items-center">
                                  <FaShippingFast className="text-blue-300 mr-2" />
                                  <span className="font-medium text-blue-200">Order #{order._id.slice(-6)}</span>
                                </div>
                                <div className="mt-1 text-blue-200">
                                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                                </div>
                              </div>
                            ))}
                            {activeOrders.length > 2 && (
                              <div className="text-center text-sm text-blue-200">
                                +{activeOrders.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Add Rider Modal */}
        <AnimatePresence>
          {isAddModalOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white/10 backdrop-blur-xl border border-cyan-200/20 rounded-2xl shadow-xl max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25 }}
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-cyan-100 mb-4">Add New Rider</h3>
                  <p className="text-cyan-200 mb-4">
                    Enter the email address of the new rider. They will be able to sign in with Google using this email.
                  </p>
                  <form onSubmit={handleAddRider}>
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-cyan-100 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="block w-full px-3 py-2 border border-cyan-400/30 rounded-lg bg-white/5 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder:text-cyan-300/60"
                        placeholder="rider@example.com"
                        value={newRiderEmail}
                        onChange={(e) => setNewRiderEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 border border-cyan-300 rounded-md shadow-sm text-sm font-medium text-cyan-200 bg-white/10 hover:bg-cyan-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                        onClick={() => {
                          setIsAddModalOpen(false);
                          setNewRiderEmail('');
                          setError(null);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Adding...' : 'Add Rider'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminRiders;
