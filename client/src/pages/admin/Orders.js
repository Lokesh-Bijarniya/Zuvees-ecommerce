import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaTimes, FaChevronDown, FaChevronUp, FaShippingFast } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { getAllOrders, getAllRiders, updateOrderStatus } from '../../utils/api';
import Spinner from '../../components/Spinner';

const AdminOrders = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const highlightedOrderId = queryParams.get('id');
  
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState(null);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [riders, setRiders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedRiderId, setSelectedRiderId] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Fetch orders and riders
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch orders
        const ordersResponse = await getAllOrders();
        const ordersData = ordersResponse.data;
        setOrders(ordersData);
        
        // Fetch riders
        const ridersResponse = await getAllRiders();
        const ridersData = ridersResponse.data;
        setRiders(ridersData);
        
        // If there's a highlighted order ID, select it
        if (highlightedOrderId) {
          setSelectedOrderId(highlightedOrderId);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders data:', err);
        setError('Failed to load orders. Please try again.');
        setLoading(false);
      }
    };

    if (isAuthenticated && isAdmin) {
      fetchData();
    }
  }, [isAuthenticated, isAdmin, highlightedOrderId]);

  // Apply filters and sorting
  useEffect(() => {
    if (!orders.length) return;
    
    let result = [...orders];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.orderStatus === statusFilter);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        (order._id && order._id.toLowerCase().includes(term)) ||
        (order.user && order.user.name && order.user.name.toLowerCase().includes(term)) ||
        (order.user && order.user.email && order.user.email.toLowerCase().includes(term))
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'orderId':
          comparison = a._id.localeCompare(b._id);
          break;
        case 'customer':
          comparison = (a.user?.name || '').localeCompare(b.user?.name || '');
          break;
        case 'status':
          comparison = a.orderStatus.localeCompare(b.orderStatus);
          break;
        case 'amount':
          comparison = a.totalAmount - b.totalAmount;
          break;
        case 'newest':
        default:
          comparison = new Date(b.createdAt) - new Date(a.createdAt);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setFilteredOrders(result);
  }, [orders, statusFilter, searchTerm, sortBy, sortDirection]);

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  // Handle order selection
  const handleOrderSelect = (orderId) => {
    setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
  };

  // Handle ship order
  const handleShipOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setIsAssignModalOpen(true);
  };

  // Handle rider assignment and shipping
  const handleAssignRider = async () => {
    if (!selectedRiderId) {
      setError('Please select a rider');
      return;
    }
    
    try {
      setProcessingOrder(selectedOrderId);
      
      await updateOrderStatus(selectedOrderId, {
        orderStatus: 'shipped',
        riderId: selectedRiderId
      });
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === selectedOrderId
            ? { ...order, orderStatus: 'shipped', rider: selectedRiderId }
            : order
        )
      );
      
      setSuccessMessage('Order has been shipped and assigned to rider');
      setIsAssignModalOpen(false);
      setSelectedRiderId('');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
      setProcessingOrder(null);
    } catch (err) {
      console.error('Error updating order:', err);
      setError('Failed to update order. Please try again.');
      setProcessingOrder(null);
    }
  };

  if (loading) {
    return <Spinner fullScreen size="large" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 mt-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-cyan-300 drop-shadow mb-2">Manage Orders</h1>
          <p className="text-blue-100/80 text-lg">View, filter, and process all customer orders.</p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-wrap gap-4 items-center mb-8">
          <div className="relative flex-1 min-w-[200px]">
            <FaSearch className="absolute left-3 top-3 text-cyan-400" />
            <input
              type="text"
              placeholder="Search by order ID, customer, or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 border border-cyan-400/30 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-cyan-300/50"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="rounded-xl bg-white/10 border border-cyan-400/30 text-cyan-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="undelivered">Undelivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </motion.div>

        {/* Orders Table */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/10 backdrop-blur-xl border border-cyan-200/20 rounded-2xl shadow-xl overflow-x-auto">
          <table className="min-w-full divide-y divide-cyan-200/10">
            <thead className="bg-cyan-900/20">
              <tr>
                <SortableTableHeader title="Order ID" field="orderId" currentSort={sortBy} direction={sortDirection} onSort={handleSortChange} />
                <SortableTableHeader title="Customer" field="customer" currentSort={sortBy} direction={sortDirection} onSort={handleSortChange} />
                <SortableTableHeader title="Amount" field="amount" currentSort={sortBy} direction={sortDirection} onSort={handleSortChange} />
                <SortableTableHeader title="Status" field="status" currentSort={sortBy} direction={sortDirection} onSort={handleSortChange} />
                <SortableTableHeader title="Date" field="date" currentSort={sortBy} direction={sortDirection} onSort={handleSortChange} />
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-100 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white/5 divide-y divide-cyan-200/10">
              {filteredOrders.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-cyan-200">No orders found.</td></tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order._id} className={highlightedOrderId === order._id ? 'bg-cyan-900/20' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-cyan-100 font-mono">#{order._id.slice(-6)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium text-cyan-200">{order.user?.name || 'Unknown'}</span>
                        <span className="text-xs text-cyan-100/70">{order.user?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-cyan-100">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <OrderStatusBadge status={order.orderStatus} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-cyan-100">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold px-4 py-1 rounded shadow transition-colors mr-2"
                        onClick={() => handleOrderSelect(order._id)}
                      >
                        Details
                      </button>
                      {order.orderStatus === 'paid' && (
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold px-3 py-1 rounded shadow transition-colors"
                          onClick={() => handleShipOrder(order._id)}
                        >
                          Assign Rider
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>

        {/* Assign Rider Modal */}
        <AnimatePresence>
          {isAssignModalOpen && (
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
                  <h3 className="text-xl font-semibold text-cyan-100 mb-4">Assign Rider</h3>
                  
                  <p className="text-cyan-100/80 mb-4">
                    Select a rider to deliver this order. The order status will be updated to "Shipped".
                  </p>
                  
                  <div className="mb-4">
                    <label htmlFor="rider" className="block text-sm font-medium text-cyan-100 mb-1">
                      Rider
                    </label>
                    <select
                      id="rider"
                      className="rounded-xl bg-white/10 border border-cyan-400/30 text-cyan-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      value={selectedRiderId}
                      onChange={(e) => setSelectedRiderId(e.target.value)}
                    >
                      <option value="">Select a rider</option>
                      {riders.map(rider => (
                        <option key={rider._id} value={rider._id}>
                          {rider.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white/10 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => {
                        setIsAssignModalOpen(false);
                        setSelectedRiderId('');
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={handleAssignRider}
                      disabled={!selectedRiderId || processingOrder}
                    >
                      {processingOrder ? 'Processing...' : 'Assign & Ship'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div 
              className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
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
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

// Sortable Table Header Component
const SortableTableHeader = ({ title, field, currentSort, direction, onSort }) => {
  const isActive = currentSort === field;
  
  return (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-cyan-100 uppercase tracking-wider cursor-pointer"
      onClick={onSort}
    >
      <div className="flex items-center">
        <span>{title}</span>
        <span className="ml-1">
          {isActive ? (
            direction === 'asc' ? <FaChevronUp className="text-blue-500" /> : <FaChevronDown className="text-blue-500" />
          ) : (
            <FaChevronDown className="text-gray-400" />
          )}
        </span>
      </div>
    </th>
  );
};

// Order Status Badge Component
const OrderStatusBadge = ({ status }) => {
  let bgColor = '';
  let textColor = '';
  
  switch (status) {
    case 'pending':
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      break;
    case 'paid':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    case 'shipped':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'delivered':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'undelivered':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    case 'cancelled':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
  }
  
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default AdminOrders;
