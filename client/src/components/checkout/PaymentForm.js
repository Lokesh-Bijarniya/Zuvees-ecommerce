import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaCreditCard, FaPaypal, FaCheck } from 'react-icons/fa';

const PaymentForm = ({ onSubmit, initialPaymentMethod, initialCardDetails }) => {
  const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod || 'credit-card');
  const [cardDetails, setCardDetails] = useState(initialCardDetails || {
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setErrors({});
  };

  // Handle card detail changes
  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date (MM/YY)
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (paymentMethod === 'credit-card') {
      // Card number validation (16 digits, spaces allowed)
      if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      
      // Card name validation
      if (!cardDetails.cardName) {
        newErrors.cardName = 'Please enter the name on your card';
      }
      
      // Expiry date validation (MM/YY format)
      if (!cardDetails.expiryDate || !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(cardDetails.expiryDate)) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      } else {
        // Check if card is expired
        const [month, year] = cardDetails.expiryDate.split('/');
        const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
        const currentDate = new Date();
        
        if (expiryDate < currentDate) {
          newErrors.expiryDate = 'Your card has expired';
        }
      }
      
      // CVV validation (3-4 digits)
      if (!cardDetails.cvv || !/^[0-9]{3,4}$/.test(cardDetails.cvv)) {
        newErrors.cvv = 'Please enter a valid CVV code (3-4 digits)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsProcessing(true);
      
      try {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        onSubmit({
          paymentMethod,
          cardDetails: paymentMethod === 'credit-card' ? cardDetails : null
        });
      } catch (error) {
        console.error('Payment processing error:', error);
        setErrors({ form: 'There was an error processing your payment. Please try again.' });
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="p-6 bg-white/10 backdrop-blur-xl rounded-xl border border-blue-200/20 shadow-xl">
      <h2 className="text-xl font-semibold text-cyan-300 mb-6">Payment Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Payment Method Selection */}
        <div className="flex gap-4 mb-4">
          <PaymentMethodButton
            method="credit-card"
            icon={<FaCreditCard />}
            title="Credit Card"
            description="Pay with Visa, Mastercard, etc."
            selected={paymentMethod === 'credit-card'}
            onClick={() => handlePaymentMethodChange('credit-card')}
          />
          
          <PaymentMethodButton
            method="paypal"
            icon={<FaPaypal />}
            title="PayPal"
            description="Fast and secure checkout"
            selected={paymentMethod === 'paypal'}
            onClick={() => handlePaymentMethodChange('paypal')}
          />
        </div>
        
        {/* Credit Card Form */}
        {paymentMethod === 'credit-card' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card Number */}
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-cyan-200 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    handleCardChange({ target: { name: 'cardNumber', value: formatted } });
                  }}
                  maxLength={19}
                  className="w-full bg-gray-800/50 border border-blue-200/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  placeholder="1234 5678 9012 3456"
                />
                {errors.cardNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                )}
              </div>
              
              {/* Card Name */}
              <div>
                <label htmlFor="cardName" className="block text-sm font-medium text-cyan-200 mb-1">
                  Name on Card
                </label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={cardDetails.cardName}
                  onChange={handleCardChange}
                  className="w-full bg-gray-800/50 border border-blue-200/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  placeholder="John Doe"
                />
                {errors.cardName && (
                  <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
                )}
              </div>
              
              {/* Expiry Date */}
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-cyan-200 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={cardDetails.expiryDate}
                  onChange={(e) => {
                    const formatted = formatExpiryDate(e.target.value);
                    handleCardChange({ target: { name: 'expiryDate', value: formatted } });
                  }}
                  maxLength={5}
                  className="w-full bg-gray-800/50 border border-blue-200/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  placeholder="MM/YY"
                />
                {errors.expiryDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                )}
              </div>
              
              {/* CVV */}
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-cyan-200 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardChange}
                  maxLength={4}
                  className="w-full bg-gray-800/50 border border-blue-200/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  placeholder="123"
                />
                {errors.cvv && (
                  <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
        
        {/* PayPal Form */}
        {paymentMethod === 'paypal' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 rounded-lg p-6 mb-6 text-center"
          >
            <p className="text-gray-700 mb-4">
              You will be redirected to PayPal to complete your payment securely.
            </p>
            <div className="flex justify-center">
              <FaPaypal className="text-blue-600 text-5xl" />
            </div>
          </motion.div>
        )}
        
        {/* Form Error */}
        {errors.form && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errors.form}
          </div>
        )}
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg shadow-lg font-semibold text-base tracking-wide transition-all duration-200 hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 mt-4"
          disabled={isProcessing}
        >
          <FaLock className="mr-2 text-lg" />
          {isProcessing ? 'Processing...' : 'Secure Checkout'}
        </button>
        
        <p className="mt-4 text-center text-sm text-gray-500 flex items-center justify-center">
          <FaLock className="mr-1 text-gray-400" />
          Your payment information is secure
        </p>
      </form>
    </div>
  );
};

// Payment Method Button Component
const PaymentMethodButton = ({ method, icon, title, description, selected, onClick }) => (
  <motion.button
    type="button"
    className={`flex-1 p-4 rounded-lg border-2 text-left transition-colors ${
      selected 
        ? 'border-cyan-500 bg-cyan-50' 
        : 'border-gray-200 hover:border-gray-300'
    }`}
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-start">
      <div className={`mr-3 text-xl ${selected ? 'text-cyan-500' : 'text-gray-400'}`}>
        {icon}
      </div>
      <div>
        <div className="flex items-center">
          <span className={`font-medium ${selected ? 'text-cyan-700' : 'text-gray-700'}`}>
            {title}
          </span>
          {selected && (
            <span className="ml-2 text-cyan-500">
              <FaCheck />
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  </motion.button>
);

export default PaymentForm;
