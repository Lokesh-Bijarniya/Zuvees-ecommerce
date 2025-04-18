import { motion } from "framer-motion";
import React, { useState } from "react";
import {
  FaRegStar,
  FaShoppingCart,
  FaStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const ProductCard = ({ product, darkMode }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Helper to get full image URL
  const getImageUrl = (img) => {
    if (!img) return '/placeholder.png';
    if (img.startsWith('http')) return img;
    // Remove leading slash if present
    const cleanImg = img.replace(/^\\|\//, '');
    return `http://localhost:5050/${cleanImg}`;
  };

  // Get the first variant's price as default
  const defaultPrice =
    product.variants && product.variants.length > 0
      ? product.variants[0].price
      : product.basePrice;

  // Calculate price range if there are multiple variants
  const priceRange =
    product.variants && product.variants.length > 1
      ? {
          min: Math.min(...product.variants.map((v) => v.price)),
          max: Math.max(...product.variants.map((v) => v.price)),
        }
      : null;

  // Generate star ratings
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <FaStar
            key={i}
            className={`text-yellow-400 ${darkMode ? "text-yellow-200" : ""}`}
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <FaStarHalfAlt
            key={i}
            className={`text-yellow-400 ${darkMode ? "text-yellow-200" : ""}`}
          />
        );
      } else {
        stars.push(
          <FaRegStar
            key={i}
            className={`text-yellow-400 ${darkMode ? "text-yellow-200" : ""}`}
          />
        );
      }
    }

    return stars;
  };

  return (
    <motion.div
      className="flex flex-col h-full bg-white/15 rounded-2xl border border-blue-100/20 shadow-xl backdrop-blur-xl p-4 transition-all duration-300 text-blue-100 hover:shadow-[0_4px_32px_0_rgba(56,189,248,0.25)] hover:scale-105 group min-h-[420px]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{
        y: -5,
        boxShadow:
          "0 0 32px 0 rgba(56,189,248,0.25), 0 10px 20px -5px rgba(0,0,0,0.3)",
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Product Image */}
        <Link to={`/products/${product._id}`}>
          <motion.img
            src={getImageUrl(product.images && product.images.length > 0 ? product.images[0] : null)}
            alt={product.name}
            className="h-48 w-full object-cover rounded-xl mb-3 group-hover:scale-105 transition-transform duration-300"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
            onError={e => { e.target.onerror = null; e.target.src = "/placeholder.png"; }}
          />
        </Link>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="text-xs font-semibold px-2 py-1 rounded-full border border-blue-200/40 bg-blue-500/60 text-white shadow backdrop-blur">
            {product.category === "fan" ? "Fan" : "AC"}
          </span>
        </div>

        {/* Quick Add to Cart Button */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 flex justify-center pb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
        >
          <Link to={`/products/${product._id}`}>
            <motion.button
              className="w-full relative py-2 rounded-xl flex px-3 items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 text-blue-900 font-semibold border border-blue-200/40 backdrop-blur-md transition-all duration-300 focus:outline-none shadow-[0_2px_12px_0_rgba(56,189,248,0.08)] overflow-hidden group"
              whileHover={{ scale: 1.06, y: -2, boxShadow: '0 6px 24px 0 rgba(56,189,248,0.18)' }}
              whileTap={{ scale: 0.97, y: 0 }}
              style={{ boxShadow: 'none' }}
            >
              {/* Animated border effect */}
              <span className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-300 bg-gradient-to-r from-blue-400/40 via-blue-300/30 to-blue-500/40 opacity-0 group-hover:opacity-100 blur-[2px]" />
              <FaShoppingCart className="text-blue-500 group-hover:text-blue-700 transition-colors duration-300 drop-shadow" />
              <span className="z-10 relative">View Options</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-lg font-bold mb-1 truncate text-white drop-shadow-sm">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-blue-100/90 mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        {/* Ratings */}
        <div className="flex items-center mb-2">
          <div className="flex mr-2">
            {renderRatingStars(product.ratings?.average || 0)}
          </div>
          <span className="ml-2 text-xs text-blue-100/80">
            ({product.ratings?.count || 0} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-end gap-2 mt-auto pt-2">
          <span className="text-lg font-bold text-yellow-300 drop-shadow">
            {priceRange
              ? `$${priceRange.min.toFixed(2)} - $${priceRange.max.toFixed(2)}`
              : `$${defaultPrice.toFixed(2)}`}
          </span>
          {priceRange && (
            <span className="text-xs text-blue-200/80">(Multiple options)</span>
          )}
        </div>

        {/* Variants Preview */}
        {product.variants && product.variants.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center space-x-1">
              {/* Show unique colors as dots */}
              {Array.from(new Set(product.variants.map((v) => v.color.code)))
                .slice(0, 4)
                .map((colorCode, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: colorCode }}
                  />
                ))}

              {/* If there are more colors than we're showing */}
              {new Set(product.variants.map((v) => v.color.code)).size > 4 && (
                <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                  +
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
