import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { getProducts, deleteProduct } from '../../utils/api';
import Spinner from '../../components/Spinner';

const AdminProducts = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
        setLoading(false);
      }
    };

    if (isAuthenticated && isAdmin) {
      fetchProducts();
    }
  }, [isAuthenticated, isAdmin]);

  // Filter products based on search term
  useEffect(() => {
    if (products.length === 0) return;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.category.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchTerm]);

  // Handle product deletion
  const handleDeleteProduct = async () => {
    if (!deleteProductId) return;
    
    try {
      await deleteProduct(deleteProductId);
      
      // Update local state
      setProducts(prevProducts => 
        prevProducts.filter(product => product._id !== deleteProductId)
      );
      
      setSuccessMessage('Product deleted successfully');
      setShowDeleteConfirm(false);
      setDeleteProductId(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product. Please try again.');
      setShowDeleteConfirm(false);
    }
  };

  // Navigate to add product page
  const handleAddProduct = () => {
    navigate('/admin/products/add');
  };

  // Navigate to edit product page
  const handleEditProduct = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  if (loading) {
    return <Spinner fullScreen size="large" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 mt-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-cyan-300 drop-shadow mb-2">Manage Products</h1>
          <p className="text-blue-100/80 text-lg">View, add, edit, or remove products for your store.</p>
        </motion.div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        {/* Search & Add Product */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-wrap gap-4 items-center mb-8">
          <div className="relative flex-1 min-w-[200px]">
            <FaSearch className="absolute left-3 top-3 text-cyan-400" />
            <input
              type="text"
              placeholder="Search by name, category, or brand..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 border border-cyan-400/30 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-cyan-300/50"
            />
          </div>
          <button
            onClick={handleAddProduct}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-6 py-2 rounded-xl shadow transition-colors flex items-center gap-2"
          >
            <FaPlus /> Add Product
          </button>
        </motion.div>

        {/* Products Table */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/10 backdrop-blur-xl border border-cyan-200/20 rounded-2xl shadow-xl overflow-x-auto">
          <table className="min-w-full divide-y divide-cyan-200/10">
            <thead className="bg-cyan-900/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-100 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-100 uppercase tracking-wider">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-100 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-100 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-100 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-cyan-100 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white/5 divide-y divide-cyan-200/10">
              {filteredProducts.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-cyan-200">No products found.</td></tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-cyan-100 font-semibold">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-cyan-100">{product.brand}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-cyan-100">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-cyan-100">${product.variants?.[0]?.price?.toFixed(2) || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-cyan-100">{product.variants?.[0]?.countInStock ?? 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <button
                        onClick={() => handleEditProduct(product._id)}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white text-xs font-semibold px-4 py-1 rounded shadow transition-colors flex items-center gap-1"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => { setDeleteProductId(product._id); setShowDeleteConfirm(true); }}
                        className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white text-xs font-semibold px-4 py-1 rounded shadow transition-colors flex items-center gap-1"
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteProductId(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={handleDeleteProduct}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
