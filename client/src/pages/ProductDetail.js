import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaRegStar, FaStarHalfAlt, FaShoppingCart, FaHeart, FaRegHeart, FaCheck, FaShieldAlt, FaTruck, FaUndo } from 'react-icons/fa';
import api, { getProduct } from '../utils/api';
import { useCart } from '../context/CartContext';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  // console.log("ProductDetail mounted");
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Fetch product data
  useEffect(() => {
    setProduct(null); 
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await getProduct(id);
        let data = response.data;

        // Normalize specifications if it's an object
        if (data.specifications && !Array.isArray(data.specifications)) {
          data.specifications = Object.entries(data.specifications).map(([name, value]) => ({ name, value }));
        }
        setProduct(data);
        
        // Set default selections
        if (data.variants && data.variants.length > 0) {
          const defaultVariant = data.variants[0];
          setSelectedColor(defaultVariant.color);
          setSelectedSize(defaultVariant.size);
          setSelectedVariant(defaultVariant);
        }
        
        // Set main image
        if (data.images && data.images.length > 0) {
          setMainImage(data.images[0]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again.');
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  // Update selected variant when color or size changes
  useEffect(() => {
    if (product && selectedColor && selectedSize) {
      const variant = product.variants.find(
        v => v.color.name === selectedColor.name && v.size === selectedSize
      );
      
      if (variant) {
        setSelectedVariant(variant);
      }
    }
  }, [product, selectedColor, selectedSize]);

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    
    // Find available sizes for this color
    const availableSizes = product.variants
      .filter(v => v.color.name === color.name)
      .map(v => v.size);
    
    // If current selected size is not available for this color, select the first available
    if (!availableSizes.includes(selectedSize)) {
      setSelectedSize(availableSizes[0]);
    }
  };

  // Handle size selection
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  // Handle quantity changes
  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity > 0 && newQuantity <= selectedVariant.stock) {
      setQuantity(newQuantity);
    }
  };

  // Handle add to cart
const handleAddToCart = async () => {
  console.log("handleAddToCart called", { selectedVariant, product, quantity });
  if (selectedVariant) {
    try {
      await addToCart(product, selectedVariant, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (err) {
      alert('Failed to add to cart. See console for details.');
      console.error(err);
    }
  }
};

  // Get unique colors from variants
  const getUniqueColors = () => {
    if (!product || !product.variants) return [];
    
    const uniqueColors = [];
    const colorNames = new Set();
    
    product.variants.forEach(variant => {
      if (!colorNames.has(variant.color.name)) {
        colorNames.add(variant.color.name);
        uniqueColors.push(variant.color);
      }
    });
    
    return uniqueColors;
  };

  // Get available sizes for selected color
  const getAvailableSizes = () => {
    if (!product || !product.variants || !selectedColor) return [];
    
    return [...new Set(
      product.variants
        .filter(v => v.color.name === selectedColor.name)
        .map(v => v.size)
    )];
  };

  // Generate star ratings
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    
    return stars;
  };

  // Helper to get full image URL
  const getImageUrl = (img) => {
    if (!img) return '/placeholder.png';
    if (img.startsWith('http')) return img;
    // Remove leading slash if present
    const cleanImg = img.replace(/^\\|\//, '');
    return `http://localhost:5050/${cleanImg}`;
  };

  if (loading) {
    return <Spinner fullScreen size="large" />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16 mt-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-200/20 overflow-hidden">
          {/* Product Images */}
          <div className="flex flex-col items-center justify-center p-8">
            <img src={getImageUrl(mainImage)} alt={product?.name} className="w-full max-w-xs rounded-xl shadow-md mb-6 border border-blue-200/20 bg-gray-900/40" />
            <div className="flex gap-3">
              {product?.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={getImageUrl(img)}
                  alt={product?.name}
                  className={`w-16 h-16 object-cover rounded-lg border-2 ${getImageUrl(mainImage) === getImageUrl(img) ? 'border-cyan-400' : 'border-blue-200/20'} cursor-pointer bg-gray-900/40`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>
          {/* Product Info */}
          <div className="p-8 flex flex-col gap-6">
            <div>
              <span className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs px-3 py-1 rounded-full mb-2 shadow">{product?.category === 'ac' ? 'Air Conditioner' : 'Fan'}</span>
              <h2 className="text-3xl font-bold text-cyan-200 mb-2">{product?.name}</h2>
              <div className="flex items-center gap-2 mb-2">
                {[...Array(Math.floor(product?.ratings?.average || 0))].map((_, i) => <FaStar key={i} className="text-yellow-400" />)}
                <span className="text-blue-100/80 text-sm">({product?.ratings?.count || 0} reviews)</span>
              </div>
              <div className="text-2xl font-bold text-cyan-300 mb-2">${selectedVariant?.price?.toFixed(2)}</div>
              <div className="text-blue-100/80 mb-4">{product?.description}</div>
              {/* Specialization / Features */}
              {product?.specialization && (
                <div className="mb-4">
                  <h4 className="text-blue-600 font-semibold mb-1 flex items-center gap-2">
                    <FaShieldAlt className="inline-block" /> Specialization
                  </h4>
                  <ul className="list-disc pl-6 text-gray-700">
                    {Array.isArray(product.specialization)
                      ? product.specialization.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))
                      : <li>{product.specialization}</li>
                    }
                  </ul>
                </div>
              )}
              {/* Specifications Table */}
              {product?.specifications && product.specifications.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-blue-600 font-semibold mb-1 flex items-center gap-2">
                    <FaCheck className="inline-block" /> Specifications
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-[300px] w-full bg-white/70 border border-blue-100 rounded-lg text-sm">
                      <tbody>
                        {product.specifications.map((spec, idx) => (
                          <tr key={idx} className="border-b border-blue-50">
                            <td className="py-1 px-3 font-semibold text-blue-900/90 whitespace-nowrap">{spec.name}</td>
                            <td className="py-1 px-3 text-gray-700">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-4 mb-4">
              {getUniqueColors().map((color, idx) => (
                <button
                  key={color.name}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-150 ${selectedColor?.name === color.name ? 'border-cyan-400 ring-2 ring-cyan-400' : 'border-blue-200/20'} bg-gray-800/60`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </div>
            <div className="flex gap-2 mb-4">
              {getAvailableSizes().map((size) => (
                <button
                  key={size}
                  className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-150 ${selectedSize === size ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow' : 'bg-gray-900/40 border-blue-200/20 text-blue-100/80'}`}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 mb-4">
              <button onClick={() => handleQuantityChange(-1)} className="bg-gray-800/50 text-cyan-200 rounded-full w-8 h-8 flex items-center justify-center hover:bg-cyan-700/60 transition-all">
                -
              </button>
              <span className="font-bold text-cyan-100 text-lg">{quantity}</span>
              <button onClick={() => handleQuantityChange(1)} className="bg-gray-800/50 text-cyan-200 rounded-full w-8 h-8 flex items-center justify-center hover:bg-cyan-700/60 transition-all">
                +
              </button>
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02 }}
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0}
              className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg shadow-lg font-semibold text-base tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 ${addedToCart ? 'ring-2 ring-green-400' : ''} ${(!selectedVariant || selectedVariant.stock === 0) ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {addedToCart ? <FaCheck className="mr-2 text-lg text-green-400 animate-bounce" /> : <FaShoppingCart className="mr-2 text-lg" />}
              {addedToCart ? 'Added!' : (selectedVariant?.stock === 0 ? 'Out of Stock' : 'Add to Cart')}
            </motion.button>
            <button
              onClick={() => setIsFavorite((fav) => !fav)}
              className={`mt-2 flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-150 ${isFavorite ? 'border-pink-400 bg-pink-400/20 text-pink-300' : 'border-blue-200/20 bg-gray-900/40 text-blue-100/80'} hover:border-pink-400`}
            >
              {isFavorite ? <FaHeart className="text-pink-400" /> : <FaRegHeart className="text-blue-200/60" />}
              {isFavorite ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* --- REVIEWS SECTION START --- */}
      <div className="p-10">
        <h3 className="text-xl font-semibold text-cyan-200 mb-4">Customer Reviews</h3>
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map((review, idx) => (
              <div key={idx} className="bg-white/10 border border-blue-200/20 rounded-xl p-4 shadow flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-cyan-100">{review.name || 'Anonymous'}</span>
                  <span className="flex ml-2">
                    {[...Array(review.rating)].map((_, i) => <FaStar key={i} className="text-yellow-400 text-sm" />)}
                  </span>
                </div>
                <div className="text-blue-100/90 text-sm mb-1">{review.comment}</div>
                <div className="text-xs text-blue-200/60">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-blue-100/70">No reviews yet. Be the first to review this product!</div>
        )}

        {/* --- ADD REVIEW FORM --- */}
        <AddReviewForm productId={product._id} onReviewAdded={newReview => setProduct(prev => ({ ...prev, reviews: [newReview, ...(prev.reviews || [])] }))} />
      </div>
      {/* --- REVIEWS SECTION END --- */}
    </div>
  );
};

// --- AddReviewForm component ---
function AddReviewForm({ productId, onReviewAdded }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please sign in to add a review.');
      return;
    }
    if (!rating || !comment.trim()) {
      setError('Please provide both a rating and a comment.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      // Only send rating and comment; user info comes from the backend session
      const res = await api.post(`/products/${productId}/reviews`, { rating, comment });
      if (res.status !== 201) throw new Error(res.data.message || 'Failed to add review');
      onReviewAdded(res.data.review || {});
      setRating(0);
      setComment('');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 bg-white/5 border border-blue-100/10 rounded-xl p-6 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="font-medium text-blue-100">Your Rating:</span>
        {[1,2,3,4,5].map(val => (
          <button
            type="button"
            key={val}
            onClick={() => setRating(val)}
            className={val <= rating ? 'text-yellow-400 text-xl' : 'text-blue-200/40 text-xl'}
          >
            <FaStar />
          </button>
        ))}
      </div>
      <textarea
        className="bg-gray-900/60 border border-blue-100/10 rounded-lg p-2 text-blue-100 min-h-[60px]"
        placeholder="Write your review here..."
        value={comment}
        onChange={e => setComment(e.target.value)}
        disabled={!isAuthenticated || submitting}
      />
      {error && <div className="text-red-400 text-sm">{error}</div>}
      <button
        type="submit"
        className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 px-6 rounded-lg font-semibold shadow hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-60"
        disabled={!isAuthenticated || submitting}
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
      {!isAuthenticated && <div className="text-blue-200/80 text-xs">Please sign in to leave a review.</div>}
    </form>
  );
}

export default ProductDetail;
