import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { FaArrowLeft, FaLock, FaMinus, FaPlus, FaTrash, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isRemoving, setIsRemoving] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle checkout
  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      loginWithGoogle();
      return;
    }

    // Proceed to checkout
    navigate("/checkout");
  };

  // Handle quantity update
  const handleUpdateQuantity = (
    productId,
    variantColor,
    variantSize,
    quantity
  ) => {
    updateQuantity(productId, variantColor, variantSize, quantity);
  };

  // Handle remove item with animation
  const handleRemoveItem = (productId, variantColor, variantSize) => {
    setIsRemoving(`${productId}-${variantColor}-${variantSize}`);

    // Wait for animation to complete before removing
    setTimeout(() => {
      removeFromCart(productId, variantColor, variantSize);
      setIsRemoving(null);
    }, 300);
  };

  if (loading) {
    return <Spinner fullScreen size="large" />;
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 min-h-screen text-white">
        <div className="container mx-auto px-4 py-16 mt-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-6 text-cyan-300 flex items-center">
                <FaShoppingCart className="mr-3 text-cyan-400 text-3xl" />
                Your Shopping Cart
              </h2>
              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-blue-200/20 shadow-lg p-8 text-center">
                <h3 className="text-xl font-semibold mb-2 text-cyan-300">
                  Your Cart is Empty
                </h3>
                <p className="mb-8 text-blue-100/80">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center text-cyan-400 hover:text-cyan-200 font-medium"
                >
                  <FaArrowLeft className="mr-2" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Update order summary calculation
  const calcTotal = cartItems.reduce((acc, item) => {
    if (!item.product || !item.variant) return acc;
    const matchedVariant = item.product.variants?.find(
      (v) =>
        v.color.name === item.variant.color.name && v.size === item.variant.size
    );
    if (!matchedVariant) return acc;
    return acc + matchedVariant.price * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-16 mt-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6 text-cyan-300 flex items-center">
              <FaShoppingCart className="mr-3 text-cyan-400 text-3xl" />
              Your Shopping Cart
            </h2>
            <div className="space-y-6">
              <AnimatePresence>
                {cartItems.map((item) => {
                  // Defensive: skip if malformed
                  if (!item.product || !item.variant) return null;
                  // Find the actual variant object from product.variants
                  const matchedVariant = item.product.variants?.find(
                    (v) =>
                      v.color.name === item.variant.color.name &&
                      v.size === item.variant.size
                  );
                  const itemKey = `${item.product._id}-${item.variant.color.name}-${item.variant.size}`;
                  const isRemovingThis = isRemoving === itemKey;

                  return (
                    <motion.div
                      key={itemKey}
                      className="bg-white/10 backdrop-blur-xl rounded-xl border border-blue-200/20 shadow-lg p-6 flex flex-col md:flex-row items-center gap-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      exit={{ opacity: 0, y: 20 }}
                    >
                      {/* Product Image */}
                      <div className="sm:w-24 sm:h-24 mb-4 sm:mb-0 flex-shrink-0">
                        <img
                          src={item.product.images?.[0] || "/placeholder.png"}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg border border-blue-200/20 bg-gray-900/40"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold mb-2 text-cyan-200">
                          {item.product.name}
                        </h4>
                        <div className="text-blue-100/80 text-sm mb-1">
                          Size: {item.variant.size}
                        </div>
                        <div className="text-blue-100/80 text-sm mb-1">
                          Color: {item.variant.color.name}
                        </div>
                        <div className="text-blue-200/60 text-xs">
                          SKU: {matchedVariant?.sku || ""}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <motion.button
                          className="bg-gray-800/50 text-cyan-200 rounded-full w-8 h-8 flex items-center justify-center hover:bg-cyan-700/60"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product._id,
                              item.variant.color.name,
                              item.variant.size,
                              item.quantity - 1
                            )
                          }
                          whileHover={{ backgroundColor: "#0891b2" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaMinus className="text-cyan-200 text-xs" />
                        </motion.button>

                        <span className="font-bold text-cyan-100">{item.quantity}</span>

                        <motion.button
                          className="bg-gray-800/50 text-cyan-200 rounded-full w-8 h-8 flex items-center justify-center hover:bg-cyan-700/60"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product._id,
                              item.variant.color.name,
                              item.variant.size,
                              item.quantity + 1
                            )
                          }
                          whileHover={{ backgroundColor: "#0891b2" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaPlus className="text-cyan-200 text-xs" />
                        </motion.button>
                      </div>

                      {/* Remove Button */}
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-semibold text-cyan-300">
                          {matchedVariant
                            ? `$${(
                                matchedVariant.price * item.quantity
                              ).toFixed(2)}`
                            : "--"}
                        </span>
                        <motion.button
                          className="text-red-400 hover:text-red-600 mt-2 flex items-center"
                          onClick={() =>
                            handleRemoveItem(
                              item.product._id,
                              item.variant.color.name,
                              item.variant.size
                            )
                          }
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaTrash className="mr-1" />
                          Remove
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Continue Shopping Button */}
            <div className="mb-6 lg:mb-0">
              <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/products"
                  className="inline-flex items-center text-cyan-400 hover:text-cyan-200 font-medium mt-6 border border-blue-200/20 rounded-lg p-2"
                >
                  <FaArrowLeft className="mr-2" />
                  Continue Shopping
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-blue-200/20 shadow-lg p-8 mt-16">
              <h3 className="text-xl font-semibold mb-4 text-cyan-300">Order Summary</h3>
              <div className="flex justify-between text-blue-100/80 mb-2">
                <span>Subtotal</span>
                <span>${calcTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-blue-100/80 mb-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-blue-100/80 mb-2">
                <span>Tax</span>
                <span>${(calcTotal * 0.1).toFixed(2)}</span>
              </div>

              <div className="border-t border-blue-200/20 my-4"></div>
              <div className="flex justify-between text-lg font-bold mb-6 text-cyan-200">
                <span>Total</span>
                <span>${(calcTotal + calcTotal * 0.1).toFixed(2)}</span>
              </div>
              <motion.button
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg shadow-lg font-semibold text-base tracking-wide transition-all duration-200 hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2"
                onClick={handleCheckout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaLock className="mr-2 text-lg" />
                {isAuthenticated
                  ? "Proceed to Checkout"
                  : "Sign in to Checkout"}
              </motion.button>
            </div>
            <button
              onClick={clearCart}
              className="w-full mt-4 text-red-400 hover:text-red-600 text-sm flex items-center justify-center"
            >
              <FaTrash className="mr-2" /> Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
