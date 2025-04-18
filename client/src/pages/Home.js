import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaFan, FaSnowflake, FaStar, FaShippingFast, FaHeadset, FaShieldAlt } from 'react-icons/fa';
import { getProducts } from '../utils/api';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';

// Image slider images
const SLIDER_IMAGES = [
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308', // Modern AC
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb', // Living room with fan
  'https://images.unsplash.com/photo-1464983953574-0892a716854b', // Stylish room
  'https://images.unsplash.com/photo-1520880867055-1e30d1cb001c', // Bedroom with AC
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd', // Minimalist fan
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDER_IMAGES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Get featured products (top rated)
  const featuredProducts = products
    .sort((a, b) => (b.ratings?.average || 0) - (a.ratings?.average || 0))
    .slice(0, 4);

  // Get fans and ACs separately
  const fans = products.filter(product => product.category === 'fan').slice(0, 3);
  const acs = products.filter(product => product.category === 'ac').slice(0, 3);

  if (loading) {
    return <Spinner fullScreen size="large" />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
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

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 min-h-screen text-white">
      {/* Hero Section with Slider */}
      <div className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background image slider */}
        <div className="absolute inset-0 w-full h-full z-0">
          {SLIDER_IMAGES.map((img, idx) => (
            <img
              key={img}
              src={img}
              alt="Cooling product showcase"
              className={`object-cover w-full h-full absolute top-0 left-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
              style={{ filter: 'brightness(0.45) blur(1px)' }}
              draggable={false}
            />
          ))}
          {/* Overlay for extra contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-gray-900/80" />
        </div>

        {/* Main content (centered) */}
        <div className="relative z-10 w-full max-w-3xl mx-auto text-center px-4 py-24 flex flex-col items-center justify-center">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Ready to Experience Premium Cooling?
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto text-center drop-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="inline-block bg-gradient-to-r from-blue-300 via-cyan-400 to-teal-300 bg-clip-text text-transparent font-semibold">
              Browse our collection of fans and air conditioners
            </span>
            <br />
            <span className="text-gray-300/80">to find the perfect cooling solution for your space.</span>
          </motion.p>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/products" 
              className="inline-block bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-bold py-3 px-10 rounded-full shadow-2xl hover:from-cyan-500 hover:to-blue-600 transition-all duration-200 text-lg tracking-wide border-2 border-cyan-400/40 hover:border-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-500/30"
            >
              <span className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6m-6 0H7m6 0v6m0 0l2 2m-2-2l-2 2" /></svg>
                Shop Now
              </span>
            </Link>
          </motion.div>
          {/* Slider dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {SLIDER_IMAGES.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full border-2 ${currentSlide === idx ? 'bg-cyan-400 border-white' : 'bg-white/30 border-white/40'} transition-all`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-900/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl font-bold text-cyan-300 mb-4 drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Featured Products
            </motion.h2>
            <motion.p 
              className="text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Discover our top-rated cooling solutions loved by customers
            </motion.p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product._id} product={product} darkMode />
            ))}
          </div>
          <div className="text-center mt-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/products" 
                className="inline-flex items-center text-cyan-300 hover:text-white font-medium border-b border-cyan-400 hover:border-white transition-colors"
              >
                View All Products
                <FaArrowRight className="ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl font-bold text-cyan-300 mb-4 drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Shop by Category
            </motion.h2>
            <motion.p 
              className="text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Browse our selection of premium fans and air conditioners
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Fans Category */}
            <motion.div 
              className="bg-gray-900 rounded-xl shadow-xl overflow-hidden border border-gray-800"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <FaFan className="text-cyan-400 text-2xl mr-3" />
                  <h3 className="text-xl font-bold text-white">Fans</h3>
                </div>
                <p className="text-gray-400 mb-6">
                  Energy-efficient fans for every room, from ceiling fans to portable options.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {fans.map(product => (
                    <Link key={product._id} to={`/products/${product._id}`}>
                      <div className="rounded-lg overflow-hidden bg-gray-800 hover:shadow-lg transition-shadow">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-2">
                          <h4 className="text-sm font-medium text-gray-100 truncate">{product.name}</h4>
                          <p className="text-xs text-cyan-300">${product.basePrice.toFixed(2)}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link 
                  to="/products?category=fan" 
                  className="inline-flex items-center text-cyan-300 hover:text-white font-medium border-b border-cyan-400 hover:border-white transition-colors"
                >
                  View All Fans
                  <FaArrowRight className="ml-2" />
                </Link>
              </div>
            </motion.div>
            {/* Air Conditioners Category */}
            <motion.div 
              className="bg-gray-900 rounded-xl shadow-xl overflow-hidden border border-gray-800"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <FaSnowflake className="text-cyan-400 text-2xl mr-3" />
                  <h3 className="text-xl font-bold text-white">Air Conditioners</h3>
                </div>
                <p className="text-gray-400 mb-6">
                  Powerful air conditioners with smart features and energy-saving technology.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {acs.map(product => (
                    <Link key={product._id} to={`/products/${product._id}`}>
                      <div className="rounded-lg overflow-hidden bg-gray-800 hover:shadow-lg transition-shadow">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-2">
                          <h4 className="text-sm font-medium text-gray-100 truncate">{product.name}</h4>
                          <p className="text-xs text-cyan-300">${product.basePrice.toFixed(2)}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link 
                  to="/products?category=ac" 
                  className="inline-flex items-center text-cyan-300 hover:text-white font-medium border-b border-cyan-400 hover:border-white transition-colors"
                >
                  View All Air Conditioners
                  <FaArrowRight className="ml-2" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-900/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl font-bold text-cyan-300 mb-4 drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Why Choose Us
            </motion.h2>
            <motion.p 
              className="text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              We're committed to providing the best cooling solutions with exceptional service
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FaStar />}
              title="Premium Quality"
              description="All our products are made with high-quality materials and advanced technology for optimal performance and durability."
              delay={0}
            />
            <FeatureCard 
              icon={<FaShippingFast />}
              title="Fast Delivery"
              description="We offer quick and reliable delivery services to ensure your cooling solutions arrive when you need them."
              delay={0.1}
            />
            <FeatureCard 
              icon={<FaHeadset />}
              title="24/7 Support"
              description="Our customer support team is available around the clock to assist you with any questions or concerns."
              delay={0.2}
            />
            <FeatureCard 
              icon={<FaShieldAlt />}
              title="Warranty Protection"
              description="All products come with a comprehensive warranty to give you peace of mind with your purchase."
              delay={0.3}
            />
            <FeatureCard 
              icon={<FaFan />}
              title="Energy Efficient"
              description="Our products are designed to be energy-efficient, helping you save on electricity bills while staying cool."
              delay={0.4}
            />
            <FeatureCard 
              icon={<FaSnowflake />}
              title="Smart Controls"
              description="Many of our cooling solutions feature smart controls for convenient operation and customization."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-cyan-900 via-blue-900 to-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl font-bold mb-6 text-cyan-200 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Discover Comfort & Style for Every Space
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl text-cyan-100 mb-8 max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="inline-block bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent font-semibold">
              Shop the latest fans & air conditioners — curated for your needs
            </span>
            <br />
            <span className="text-cyan-100/80">Explore, compare, and upgrade your comfort today.</span>
          </motion.p>
          <motion.div
            className="flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-2xl hover:from-cyan-500 hover:to-blue-600 transition-all duration-200 text-lg tracking-wide border-2 border-cyan-400/40 hover:border-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-500/30"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6m-6 0H7m6 0v6m0 0l2 2m-2-2l-2 2" /></svg>
              Shop Now
            </Link>
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-cyan-600 text-white font-bold py-3 px-8 rounded-full shadow-2xl hover:from-blue-600 hover:to-cyan-500 transition-all duration-200 text-lg tracking-wide border-2 border-blue-400/40 hover:border-blue-200 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553 2.276A2 2 0 0121 14.09V17a2 2 0 01-2 2H5a2 2 0 01-2-2v-2.91a2 2 0 01.447-1.814L8 10" /></svg>
              Explore
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, delay = 0 }) => (
  <motion.div
    className="bg-white/10 backdrop-blur-xl rounded-2xl border border-blue-200/20 shadow-xl hover:shadow-blue-400/30 p-7 flex flex-col items-center transition-all duration-300 hover:scale-105 group min-h-[260px]"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-400/20 flex items-center justify-center text-blue-400 group-hover:text-blue-600 shadow-md mb-4 border border-blue-200/30 backdrop-blur">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-blue-100 mb-2 drop-shadow-lg text-center">
      {title}
    </h3>
    <p className="text-blue-100/80 text-center text-sm drop-shadow">
      {description}
    </p>
  </motion.div>
);

export default Home;
