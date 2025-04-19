import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaTruck, FaBell } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { user, isAuthenticated, isAdmin, isRider, isCustomer, logout } = useAuth();
  const { totalItems } = useCart();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const location = useLocation();

  // console.log(user?.avatar);

  // Handle scroll event to change header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
    setIsNotifOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed  top-0 left-0 right-0 z-50 transition-all duration-300 \
        ${isScrolled ? 'bg-gradient-to-r from-gray-950 via-gray-900 to-surface shadow-xl-glass py-2 backdrop-blur-md' : 'bg-gradient-to-r from-gray-950 via-gray-900 to-surface py-4'} \
        `}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tight drop-shadow">
                Zuvee
              </span>
              <span className="ml-2 text-sm text-cyan-200 font-medium">Fans & ACs</span>
            </motion.div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Show Home and Products only for regular customers or when not logged in */}
            {(!isAuthenticated || isCustomer) && (
              <>
                <NavLink to="/" darkMode>Home</NavLink>
                <NavLink to="/products" darkMode>Products</NavLink>
              </>
            )}
            {isAuthenticated && isRider && null}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {/* Cart Icon - Only show for customers or non-authenticated users */}
            {(!isAuthenticated || isCustomer) && (
              <Link to="/cart">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaShoppingCart className={`text-xl ${isScrolled ? 'text-cyan-400' : 'text-cyan-500'}`} />
                  {totalItems > 0 && (
                    <motion.span 
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            )}
            
            {/* Notification Icon - Show for authenticated users */}
            {isAuthenticated && (
              <div className="relative flex items-center">
                <button
                  className="focus:outline-none"
                  onClick={() => setIsNotifOpen(open => !open)}
                  title="Notifications"
                >
                  <FaBell className={`text-xl ${isScrolled ? 'text-yellow-400' : 'text-yellow-500'}`} />
                  {unreadCount > 0 && (
                    <motion.span
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </button>
                {/* Notification Dropdown */}
                <AnimatePresence>
                  {isNotifOpen && (
                    <motion.div
                      className="absolute right-0 top-10 md:top-12 w-80 bg-gray-900 rounded-md shadow-lg py-1 z-50 border border-yellow-400/20"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      style={{ minWidth: '18rem', maxWidth: '95vw' }}
                    >
                      <div className="px-4 py-2 border-b border-border/40 flex items-center justify-between">
                        <span className="text-sm font-bold text-yellow-300">Notifications</span>
                        <button className="text-xs text-yellow-400 hover:underline" onClick={markAllAsRead}>Mark all as read</button>
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-gray-800">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-gray-400">No notifications yet.</div>
                        ) : (
                          notifications.slice(0, 5).map((n) => (
                            <div key={n.id} className="px-4 py-3 text-sm text-yellow-100 flex flex-col">
                              <span className="font-semibold">Order #{n.orderId} status: <span className="capitalize">{n.status}</span></span>
                              <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  className="flex items-center space-x-1"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img 
                    src={user?.avatar || 'https://ui-avatars.com/api/?name=User'}
                    alt="User" 
                    className="w-8 h-8 rounded-full border-2 border-cyan-400"
                    referrerPolicy="no-referrer"
                  />
                </motion.button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 z-10"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 py-2 border-b border-border/40">
                        <p className="text-sm font-medium text-cyan-200">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      </div>
                      
                      {isAdmin && (
                        <Link 
                          to="/admin/dashboard" 
                          className="block px-4 py-2 text-sm text-cyan-400 hover:bg-gray-800"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      {isCustomer && (
                        <Link 
                          to="/my-orders" 
                          className="block px-4 py-2 text-sm text-cyan-400 hover:bg-gray-800"
                        >
                          My Orders
                        </Link>
                      )}
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-cyan-400 hover:bg-gray-800"
                      >
                        <div className="flex items-center">
                          <FaUser className="mr-2" />
                          Profile
                        </div>
                      </Link>
                      
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-800"
                      >
                        <div className="flex items-center">
                          <FaSignOutAlt className="mr-2" />
                          Logout
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login">
                <motion.button
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-cyan-400 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden absolute top-full left-0 right-0 bg-gray-900 shadow-lg z-50 overflow-hidden"
            >
              <div className="px-4 py-2 space-y-2">
                {/* Show Home and Products only for regular customers or when not logged in */}
                {(!isAuthenticated || isCustomer) && (
                  <>
                    <MobileNavLink to="/">Home</MobileNavLink>
                    <MobileNavLink to="/products">Products</MobileNavLink>
                  </>
                )}
                {/* Admin-specific navigation */}
                {isAdmin && (
                  <MobileNavLink to="/admin/dashboard">Admin Dashboard</MobileNavLink>
                )}
                {/* Rider-specific navigation */}
                {isRider && null}
                {/* Show My Orders only for customers */}
                {isCustomer && (
                  <MobileNavLink to="/my-orders">My Orders</MobileNavLink>
                )}
                {/* Profile and Logout for authenticated users */}
                {isAuthenticated && (
                  <>
                    <MobileNavLink to="/profile">Profile</MobileNavLink>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-800 rounded"
                    >
                      <div className="flex items-center">
                        <FaSignOutAlt className="mr-2" />
                        Logout
                      </div>
                    </button>
                  </>
                )}
                {!isAuthenticated && (
                  <MobileNavLink to="/login">Login</MobileNavLink>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

// Desktop Navigation Link
const NavLink = ({ to, children, darkMode }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <Link to={to}>
      <motion.div
        className="relative"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <span className={`text-sm font-medium ${isActive ? 'text-cyan-400' : 'text-gray-400'}`}>
          {children}
        </span>
        {isActive && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full"
            layoutId="navIndicator"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </motion.div>
    </Link>
  );
};

// Mobile Navigation Link
const MobileNavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <Link to={to}>
      <div className={`block px-4 py-2 text-sm ${isActive ? 'bg-gray-800 text-cyan-400' : 'text-gray-400 hover:bg-gray-800'}`}>
        {children}
      </div>
    </Link>
  );
};

export default Header;
