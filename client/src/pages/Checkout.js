import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { createOrder } from '../utils/api';
import AddressForm from '../components/checkout/AddressForm';
import OrderSummary from '../components/checkout/OrderSummary';
import PaymentForm from '../components/checkout/PaymentForm';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);

  // Calculate totals using correct variant logic
  const calcTotal = cartItems.reduce((acc, item) => {
    if (!item.product || !item.variant) return acc;
    const matchedVariant = item.product.variants?.find(
      v => v.color.name === item.variant.color.name && v.size === item.variant.size
    );
    if (!matchedVariant) return acc;
    return acc + matchedVariant.price * item.quantity;
  }, 0);
  const tax = calcTotal * 0.1;
  const orderTotal = calcTotal + tax;

  // Step 1: Shipping
  const handleShippingSubmit = (data) => {
    setShippingAddress(data);
    setStep(2);
  };

  // Step 2: Payment
  const handlePaymentSubmit = (data) => {
    setPaymentInfo(data);
    setStep(3);
  };

  // Step 3: Confirmation
  const handleConfirmOrder = async () => {
    try {
      // Compose the order data with required fields for backend validation
      const orderData = {
        items: cartItems.map(item => ({
          product: item.product._id,
          variant: {
            color: item.variant.color,
            size: item.variant.size,
            price: item.variant.price,
          },
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentInfo,
        // These must match your backend schema:
        paymentMethod: paymentInfo?.paymentMethod || 'credit-card',
        totalAmount: orderTotal, // Use the exact name expected by backend
        tax,
      };

      await createOrder(orderData);
      await clearCart();
      navigate('/my-orders');
    } catch (err) {
      alert('Order could not be placed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 min-h-screen text-white">
      <div className="container mx-auto px-4 py-16 mt-16">
        {/* Progress Steps */}
        <div className="flex justify-center items-center mb-12">
          <div className="flex items-center space-x-12">
            <div className="flex items-center">
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step === 1 ? 'bg-cyan-500' : 'bg-gray-700'}`}>
                <span className="text-white">1</span>
              </div>
              <span className={`ml-2 ${step === 1 ? 'text-cyan-300' : 'text-gray-400'}`}>Shipping</span>
            </div>
            <div className="h-px w-24 bg-gray-600" />
            <div className="flex items-center">
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step === 2 ? 'bg-cyan-500' : 'bg-gray-700'}`}>
                <span className="text-white">2</span>
              </div>
              <span className={`ml-2 ${step === 2 ? 'text-cyan-300' : 'text-gray-400'}`}>Payment</span>
            </div>
            <div className="h-px w-24 bg-gray-600" />
            <div className="flex items-center">
              <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step === 3 ? 'bg-cyan-500' : 'bg-gray-700'}`}>
                <span className="text-white">3</span>
              </div>
              <span className={`ml-2 ${step === 3 ? 'text-cyan-300' : 'text-gray-400'}`}>Confirmation</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-blue-200/20 shadow-xl p-8">
              {step === 1 && (
                <AddressForm initialValues={shippingAddress} onSubmit={handleShippingSubmit} />
              )}
              {step === 2 && (
                <PaymentForm onSubmit={handlePaymentSubmit} />
              )}
              {step === 3 && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-cyan-300 mb-6">Order Confirmation</h2>
                  <p className="mb-4">Thank you for your order! Your order has been placed successfully.</p>
                  <button
                    className="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-colors mt-4"
                    onClick={handleConfirmOrder}
                  >
                    View My Orders
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Order Summary */}
          <div className="w-full lg:w-96">
            <OrderSummary
              cartItems={cartItems.map(item => {
                const matchedVariant = item.product.variants?.find(
                  v => v.color.name === item.variant.color.name && v.size === item.variant.size
                );
                return {
                  ...item,
                  variant: {
                    ...item.variant,
                    price: matchedVariant?.price || 0,
                  }
                };
              })}
              totalPrice={calcTotal}
              tax={tax}
              orderTotal={orderTotal}
              currentStep={step}
              shippingAddress={shippingAddress}
              paymentMethod={paymentInfo?.paymentMethod}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
