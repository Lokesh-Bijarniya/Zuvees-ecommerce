import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaLock } from 'react-icons/fa';

const AddressForm = ({ initialValues, onSubmit }) => {
  const [formData, setFormData] = useState(initialValues || {
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  });
  
  const [errors, setErrors] = useState({});

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = ['fullName', 'email', 'phone', 'street', 'city', 'state', 'postalCode', 'country'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    // Postal code validation
    if (formData.postalCode && !/^\d{5}(-\d{4})?$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Please enter a valid postal code (e.g., 12345 or 12345-6789)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="p-6 bg-white/10 backdrop-blur-xl rounded-xl border border-blue-200/20 shadow-xl">
      <h2 className="text-xl font-semibold text-cyan-300 mb-6">Shipping Address</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="fullName" className="block text-sm font-medium text-cyan-200 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full bg-gray-800/50 border border-blue-200/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 ${
                errors.fullName ? 'border-red-500' : ''
              }`}
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>
          
          {/* Email */}
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="email" className="block text-sm font-medium text-cyan-200 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-gray-800/50 border border-blue-200/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 ${
                errors.email ? 'border-red-500' : ''
              }`}
              placeholder="john.doe@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          
          {/* Phone */}
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="phone" className="block text-sm font-medium text-cyan-200 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full bg-gray-800/50 border border-blue-200/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 ${
                errors.phone ? 'border-red-500' : ''
              }`}
              placeholder="(123) 456-7890"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
          
          {/* Country */}
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="country" className="block text-sm font-medium text-cyan-200 mb-1">
              Country
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`w-full bg-gray-800/50 border border-blue-200/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 ${
                errors.country ? 'border-red-500' : ''
              }`}
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="IN">India</option>
            </select>
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">{errors.country}</p>
            )}
          </div>
          
          {/* Street Address */}
          <div className="col-span-2">
            <label htmlFor="street" className="block text-sm font-medium text-cyan-200 mb-1">
              Street Address
            </label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className={`w-full bg-gray-800/50 border border-blue-200/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 ${
                errors.street ? 'border-red-500' : ''
              }`}
              placeholder="123 Main St, Apt 4B"
            />
            {errors.street && (
              <p className="mt-1 text-sm text-red-600">{errors.street}</p>
            )}
          </div>
          
          {/* City */}
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="city" className="block text-sm font-medium text-cyan-200 mb-1">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full bg-gray-800/50 border border-blue-200/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 ${
                errors.city ? 'border-red-500' : ''
              }`}
              placeholder="New York"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>
          
          {/* State */}
          <div className="col-span-1">
            <label htmlFor="state" className="block text-sm font-medium text-cyan-200 mb-1">
              State / Province
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`w-full bg-gray-800/50 border border-blue-200/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 ${
                errors.state ? 'border-red-500' : ''
              }`}
              placeholder="NY"
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">{errors.state}</p>
            )}
          </div>
          
          {/* Postal Code */}
          <div className="col-span-1">
            <label htmlFor="postalCode" className="block text-sm font-medium text-cyan-200 mb-1">
              ZIP / Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className={`w-full bg-gray-800/50 border border-blue-200/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 ${
                errors.postalCode ? 'border-red-500' : ''
              }`}
              placeholder="10001"
            />
            {errors.postalCode && (
              <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
            )}
          </div>
        </div>
        
        {/* Submit Button */}
        <motion.button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg shadow-lg font-semibold text-base tracking-wide transition-all duration-200 hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 mt-4"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaLock className="mr-2 text-lg" />
          Secure Checkout
        </motion.button>
      </form>
    </div>
  );
};

export default AddressForm;
