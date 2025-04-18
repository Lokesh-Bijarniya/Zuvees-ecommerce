import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { RiderPwaProvider } from './context/RiderPwaContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import PwaPrompt from './components/rider/PwaPrompt';
import RoleBasedRedirect from './components/RoleBasedRedirect';

// Pages
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import UserOrders from './pages/UserOrders';
import OrderDetail from './pages/OrderDetail';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminRiders from './pages/admin/Riders';
import AdminProducts from './pages/admin/Products';
import ProductForm from './pages/admin/ProductForm';

// Rider Pages
import RiderDashboard from './pages/rider/Dashboard';
import RiderOrderDetail from './pages/rider/OrderDetail';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <RiderPwaProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Routes>
                  {/* Rider Routes */}
                  <Route path="/rider/dashboard" element={<RiderDashboard />} />
                  <Route path="/rider/order/:id" element={<RiderOrderDetail />} />

                  {/* PWA Prompt for Rider App (should be after specific rider routes) */}
                  <Route path="/rider/pwa" element={<PwaPrompt />} />
                  {/* Optionally handle unknown rider routes */}
                  <Route path="/rider/*" element={<NotFound />} />
                  
                  {/* Public Routes */}
                  <Route path="/" element={
                    <RoleBasedRedirect>
                      <Home />
                    </RoleBasedRedirect>
                  } />
                  <Route path="/products" element={
                    <RoleBasedRedirect>
                      <ProductListing />
                    </RoleBasedRedirect>
                  } />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/login" element={<Login />} />
                  
                  {/* User Routes */}
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/my-orders" element={<UserOrders />} />
                  <Route path="/orders/:orderId" element={<OrderDetail />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/riders" element={<AdminRiders />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/products/add" element={<ProductForm />} />
                  <Route path="/admin/products/edit/:id" element={<ProductForm />} />
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
            
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </RiderPwaProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
