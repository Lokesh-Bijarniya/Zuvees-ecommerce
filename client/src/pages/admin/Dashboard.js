import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  FaBox,
  FaChartLine,
  FaCheck,
  FaClipboardList,
  FaExclamationTriangle,
  FaShippingFast,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { useAuth } from "../../context/AuthContext";
import { getAllOrders, getAllRiders } from "../../utils/api";

const AdminDashboard = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    orders: [],
    riders: [],
    stats: {
      totalOrders: 0,
      pendingOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      totalRevenue: 0,
    },
  });

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (!isAdmin) {
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch orders
        const ordersResponse = await getAllOrders();
        const orders = ordersResponse.data;

        // Fetch riders
        const ridersResponse = await getAllRiders();
        const riders = ridersResponse.data;

        // Calculate stats
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(
          (order) => order.orderStatus === "pending"
        ).length;
        const shippedOrders = orders.filter(
          (order) => order.orderStatus === "shipped"
        ).length;
        const deliveredOrders = orders.filter(
          (order) => order.orderStatus === "delivered"
        ).length;
        const totalRevenue = orders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );

        setDashboardData({
          orders,
          riders,
          stats: {
            totalOrders,
            pendingOrders,
            shippedOrders,
            deliveredOrders,
            totalRevenue,
          },
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
        setLoading(false);
      }
    };

    if (isAuthenticated && isAdmin) {
      fetchDashboardData();
    }
  }, [isAuthenticated, isAdmin]);

  if (loading) {
    return <Spinner fullScreen size="large" />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 mt-16 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { stats, orders, riders } = dashboardData;

  // Get recent orders (last 5)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Get pending orders that need attention
  const ordersNeedingAttention = orders
    .filter((order) => order.orderStatus === "pending")
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16 mt-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-extrabold text-cyan-300 drop-shadow mb-2">
            Admin Dashboard
          </h1>
          <p className="text-blue-100/80 text-lg">
            Welcome back, {user?.name || "Admin"}! Here’s an overview of your
            store.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<FaClipboardList className="text-cyan-300" />}
            color="glass-cyan"
            delay={0}
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon={<FaBox className="text-blue-300" />}
            color="glass-blue"
            delay={0.1}
          />
          <StatCard
            title="Shipped Orders"
            value={stats.shippedOrders}
            icon={<FaShippingFast className="text-green-300" />}
            color="glass-green"
            delay={0.2}
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon={<FaChartLine className="text-purple-300" />}
            color="glass-purple"
            delay={0.3}
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Link
            to="/admin/orders"
            className="bg-white/10 backdrop-blur-xl border border-cyan-200/20 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow p-6 flex flex-col items-center group hover:bg-cyan-900/10"
          >
            <FaClipboardList className="text-3xl text-cyan-300 group-hover:scale-110 transition-transform mb-2" />
            <span className="text-lg font-semibold text-cyan-100">Manage Orders</span>
            <span className="text-sm text-cyan-300/70">View and update order status</span>
          </Link>
          <Link
            to="/admin/products"
            className="bg-white/10 backdrop-blur-xl border border-green-200/20 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow p-6 flex flex-col items-center group hover:bg-green-900/10"
          >
            <FaBox className="text-3xl text-green-300 group-hover:scale-110 transition-transform mb-2" />
            <span className="text-lg font-semibold text-green-100">Manage Products</span>
            <span className="text-sm text-green-300/70">Add, edit, or remove products</span>
          </Link>
          <Link
            to="/admin/riders"
            className="bg-white/10 backdrop-blur-xl border border-purple-200/20 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow p-6 flex flex-col items-center group hover:bg-purple-900/10"
          >
            <FaShippingFast className="text-3xl text-purple-300 group-hover:scale-110 transition-transform mb-2" />
            <span className="text-lg font-semibold text-purple-100">Manage Riders</span>
            <span className="text-sm text-purple-300/70">View and add delivery personnel</span>
          </Link>
          <Link
            to="/admin/dashboard/analytics"
            className="bg-white/10 backdrop-blur-xl border border-blue-200/20 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow p-6 flex flex-col items-center group hover:bg-blue-900/10"
          >
            <FaChartLine className="text-3xl text-blue-300 group-hover:scale-110 transition-transform mb-2" />
            <span className="text-lg font-semibold text-blue-100">Analytics</span>
            <span className="text-sm text-blue-300/70">Sales, users, top products</span>
          </Link>
        </motion.div>

        {/* Main Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-xl border border-blue-200/20 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-cyan-200">
                  Recent Orders
                </h2>
                <Link
                  to="/admin/orders"
                  className="text-cyan-400 hover:text-cyan-200 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              {recentOrders.length === 0 ? (
                <p className="text-blue-100/60 text-center py-4">
                  No orders yet
                </p>
              ) : (
                <div className="divide-y divide-blue-200/10">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="py-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-cyan-100">
                            Order #{order._id.slice(-6)}
                          </p>
                          <p className="text-xs text-blue-100/60">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-cyan-200">
                            ${order.totalAmount.toFixed(2)}
                          </p>
                          <OrderStatusBadge status={order.orderStatus} />
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-blue-100/70">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Orders Needing Attention */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="bg-white/10 backdrop-blur-xl border border-yellow-200/20 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-yellow-200">
                  Orders Needing Attention
                </h2>
                <span className="bg-yellow-100/20 text-yellow-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {stats.pendingOrders} Pending
                </span>
              </div>
              {ordersNeedingAttention.length === 0 ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/30 text-green-400 mb-4">
                    <FaCheck className="text-2xl" />
                  </div>
                  <p className="text-green-200">
                    All orders have been processed!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-yellow-200/10">
                  {ordersNeedingAttention.map((order) => (
                    <div key={order._id} className="py-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <FaExclamationTriangle className="text-yellow-400 mr-2" />
                            <p className="font-medium text-yellow-100">
                              Order #{order._id.slice(-6)}
                            </p>
                          </div>
                          <p className="text-xs text-yellow-100/60">
                            Paid on{" "}
                            {new Date(order.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Link
                          to={`/admin/orders?id=${order._id}`}
                          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-medium px-3 py-1 rounded-md shadow transition-colors"
                        >
                          Process
                        </Link>
                      </div>
                      <div className="mt-2 text-xs text-yellow-100/70">
                        Customer: {order.user?.name || "Unknown"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Rider Status Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white/10 backdrop-blur-xl border border-purple-200/20 rounded-2xl shadow-xl overflow-hidden mt-12"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-purple-200">
                Rider Status
              </h2>
              <Link
                to="/admin/riders"
                className="text-purple-400 hover:text-purple-200 text-sm font-medium"
              >
                Manage Riders
              </Link>
            </div>
            {riders.length === 0 ? (
              <p className="text-blue-100/60 text-center py-4">
                No riders available
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-purple-200/10">
                  <thead className="bg-purple-900/20">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-100 uppercase tracking-wider">
                        Rider
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-100 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-100 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-100 uppercase tracking-wider">
                        Active Orders
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-100 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/5 divide-y divide-purple-200/10">
                    {riders.map((rider) => {
                      const riderActiveOrders = orders.filter(
                        (order) =>
                          order.rider === rider._id &&
                          order.orderStatus === "shipped"
                      ).length;
                      return (
                        <tr key={rider._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={
                                    rider.avatar ||
                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                      rider.name
                                    )}`
                                  }
                                  alt={rider.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-purple-100">
                                  {rider.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-purple-100/80">
                              {rider.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-purple-100/80">
                              {rider.phone || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-purple-100">
                              {riderActiveOrders}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                riderActiveOrders > 0
                                  ? "bg-green-900/40 text-green-300"
                                  : "bg-purple-900/30 text-purple-200"
                              }`}
                            >
                              {riderActiveOrders > 0 ? "Active" : "Available"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, delay = 0 }) => {
  // Modern glassy color classes
  const colorClasses = {
    'glass-cyan': 'bg-white/10 border border-cyan-200/20',
    'glass-blue': 'bg-white/10 border border-blue-200/20',
    'glass-green': 'bg-white/10 border border-green-200/20',
    'glass-purple': 'bg-white/10 border border-purple-200/20',
  };
  return (
    <motion.div
      className={`relative ${colorClasses[color]} backdrop-blur-xl rounded-2xl shadow-xl p-6 flex flex-col justify-between overflow-hidden group hover:scale-[1.025] transition-transform`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="absolute top-4 right-4 opacity-70 group-hover:opacity-100 transition-opacity">{icon}</div>
      <div className="text-4xl font-extrabold text-cyan-100 drop-shadow mb-2">{value}</div>
      <div className="text-lg font-semibold text-cyan-300 tracking-wide">{title}</div>
    </motion.div>
  );
};

// Order Status Badge Component
const OrderStatusBadge = ({ status }) => {
  let bgColor = "";
  let textColor = "";

  switch (status) {
    case "pending":
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
      break;
    case "paid":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      break;
    case "shipped":
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      break;
    case "delivered":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      break;
    case "undelivered":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      break;
    case "cancelled":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      break;
    default:
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
  }

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default AdminDashboard;
