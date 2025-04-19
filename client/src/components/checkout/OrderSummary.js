import { motion } from "framer-motion";
import React from "react";
import { FaCreditCard, FaMapMarkerAlt, FaPaypal } from "react-icons/fa";

const OrderSummary = ({
  cartItems = [],
  totalPrice,
  tax,
  orderTotal,
  currentStep,
  shippingAddress,
  paymentMethod,
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-blue-200/20 shadow-xl p-8">
      <h2 className="text-xl font-semibold text-cyan-300 mb-6">
        Order Summary
      </h2>

      {/* Cart Items */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-cyan-200 mb-3">
          {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
        </h3>

        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover border border-blue-200/20"
                  />
                </div>
                <div className="ml-3 flex-grow">
                  <p className="text-sm font-medium text-cyan-200 line-clamp-1">
                    {item.product.name}
                  </p>
                  <div className="flex justify-between">
                    <p className="text-xs text-blue-100/80">
                      {item.variant.size}, {item.variant.color.name}
                    </p>
                    <p className="text-xs text-blue-100/80">x{item.quantity}</p>
                  </div>
                </div>
                <div className="ml-2 text-sm font-semibold text-cyan-300">
                  ${(item.variant.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))
          ) : (
            <p className="text-blue-100/70">No items in cart.</p>
          )}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-blue-100/80">
          <span>Subtotal</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-blue-100/80">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between text-blue-100/80">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-blue-200/20 my-4" />
        <div className="flex justify-between text-lg font-bold text-cyan-200 mb-6">
          <span>Total</span>
          <span>${orderTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Shipping Information (Step 2+) */}
      {currentStep >= 2 && shippingAddress && (
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <div className="border-t border-blue-200/20 pt-4">
            <h3 className="text-sm font-medium text-cyan-200 mb-2 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-blue-500" />
              Shipping Address
            </h3>
            <div className="text-sm text-blue-100/80">
              <p className="font-medium">{shippingAddress.fullName}</p>
              <p>{shippingAddress.street}</p>
              <p>
                {shippingAddress.city}, {shippingAddress.state}{" "}
                {shippingAddress.postalCode}
              </p>
              <p>{shippingAddress.country}</p>
              <p className="mt-1">{shippingAddress.phone}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Payment Method (Step 3+) */}
      {currentStep >= 3 && paymentMethod && (
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <div className="border-t border-blue-200/20 pt-4">
            <h3 className="text-sm font-medium text-cyan-200 mb-2 flex items-center">
              {paymentMethod === "credit-card" ? (
                <FaCreditCard className="mr-2 text-blue-500" />
              ) : (
                <FaPaypal className="mr-2 text-blue-500" />
              )}
              Payment Method
            </h3>
            <p className="text-sm text-blue-100/80">
              {paymentMethod === "credit-card" ? "Credit Card" : "PayPal"}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OrderSummary;
