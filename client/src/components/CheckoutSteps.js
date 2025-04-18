import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCreditCard, FaCheckCircle } from 'react-icons/fa';

const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { number: 1, title: 'Shipping', icon: <FaMapMarkerAlt /> },
    { number: 2, title: 'Payment', icon: <FaCreditCard /> },
    { number: 3, title: 'Confirmation', icon: <FaCheckCircle /> }
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center relative w-1/3">
            {/* Step Circle */}
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                currentStep >= step.number
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: step.number * 0.1 }}
            >
              {step.icon}
            </motion.div>
            
            {/* Step Title */}
            <motion.p
              className={`mt-2 text-sm font-medium ${
                currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: step.number * 0.1 + 0.1 }}
            >
              {step.title}
            </motion.p>
            
            {/* Connector Line */}
            {step.number < steps.length && (
              <div className="absolute top-6 left-1/2 w-full h-0.5 bg-gray-200">
                {currentStep > step.number && (
                  <motion.div
                    className="h-full bg-blue-600"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutSteps;
