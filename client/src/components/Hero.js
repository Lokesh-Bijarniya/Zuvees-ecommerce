import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaFan, FaSnowflake } from 'react-icons/fa';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-teal-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-blue-100 opacity-60"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 10, 0],
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute top-40 -left-20 w-80 h-80 rounded-full bg-teal-100 opacity-60"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, -10, 0],
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        />
        
        {/* Floating Icons */}
        <motion.div 
          className="absolute top-1/4 left-1/4 text-blue-300 opacity-20"
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <FaFan size={60} />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-1/4 right-1/4 text-teal-300 opacity-20"
          animate={{ 
            y: [0, 30, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2
          }}
        >
          <FaSnowflake size={50} />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          {/* Hero Content */}
          <div className="w-full md:w-1/2 mb-10 md:mb-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
                Stay <span className="text-blue-600">Cool</span> & <span className="text-teal-500">Comfortable</span>
              </h1>
              
              <p className="text-lg text-gray-700 mb-8 max-w-lg">
                Discover our premium range of fans and air conditioners designed to keep your space perfectly comfortable all year round.
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/products" 
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
                  >
                    <span className="flex items-center">
                      Shop Now
                      <FaArrowRight className="ml-2" />
                    </span>
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/products?category=fan" 
                    className="inline-block bg-white hover:bg-gray-100 text-blue-600 font-medium py-3 px-6 rounded-lg border border-blue-200 transition-colors duration-300 shadow-md hover:shadow-lg"
                  >
                    <span className="flex items-center">
                      <FaFan className="mr-2" />
                      Explore Fans
                    </span>
                  </Link>
                </motion.div>
              </div>
              
              {/* Features */}
              <div className="mt-12 grid grid-cols-2 gap-4">
                <FeatureItem 
                  title="Energy Efficient" 
                  description="Save on electricity bills with our energy-efficient products"
                  delay={0.2}
                />
                <FeatureItem 
                  title="Smart Controls" 
                  description="Control your comfort with advanced smart features"
                  delay={0.4}
                />
                <FeatureItem 
                  title="Premium Quality" 
                  description="Built to last with high-quality materials"
                  delay={0.6}
                />
                <FeatureItem 
                  title="Fast Delivery" 
                  description="Quick delivery and professional installation"
                  delay={0.8}
                />
              </div>
            </motion.div>
          </div>
          
          {/* Hero Image */}
          <div className="w-full md:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1585338447937-7082f8fc763d?auto=format&fit=crop&w=800&q=80" 
                alt="Premium Air Conditioner" 
                className="rounded-2xl shadow-2xl max-w-full mx-auto"
              />
              
              {/* Floating Badge */}
              <motion.div
                className="absolute -top-5 -right-5 bg-white rounded-full shadow-lg p-3"
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <div className="bg-red-500 text-white text-sm font-bold rounded-full w-16 h-16 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xs">UP TO</div>
                    <div className="text-xl">30%</div>
                    <div className="text-xs">OFF</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Feature Item Component
const FeatureItem = ({ title, description, delay = 0 }) => (
  <motion.div 
    className="flex items-start"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="flex-shrink-0 mt-1">
      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-teal-400"></div>
    </div>
    <div className="ml-3">
      <h3 className="text-gray-900 font-medium">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </motion.div>
);

export default Hero;
