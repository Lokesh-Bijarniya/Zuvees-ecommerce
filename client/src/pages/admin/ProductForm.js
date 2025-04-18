import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getProductById, createProduct, updateProduct } from '../../utils/api';
import Spinner from '../../components/Spinner';

const ProductForm = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    basePrice: 0,
    description: '',
    features: [''],
    specifications: [{ key: '', value: '' }],
    images: [''],
    variants: [
      {
        size: '',
        color: { name: '', code: '' },
        price: 0,
        stock: 0,
        sku: ''
      }
    ]
  });

  // File input ref
  const fileInputRef = useRef();

  // File state
  const [files, setFiles] = useState([]);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Fetch product data if in edit mode
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);
        const productData = response.data;
        
        // Format the data for the form
        setFormData({
          name: productData.name || '',
          brand: productData.brand || '',
          category: productData.category || '',
          basePrice: productData.basePrice || 0,
          description: productData.description || '',
          features: productData.features?.length ? productData.features : [''],
          specifications: productData.specifications ? Object.entries(productData.specifications).map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }],
          images: productData.images?.length ? productData.images : [''],
          variants: productData.variants?.length 
            ? productData.variants.map(v => ({
                size: v.size || '',
                color: { name: v.color?.name || '', code: v.color?.code || '' },
                price: v.price || 0,
                stock: v.stock || 0,
                sku: v.sku || ''
              }))
            : [{ size: '', color: { name: '', code: '' }, price: 0, stock: 0, sku: '' }]
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product data. Please try again.');
        setLoading(false);
      }
    };

    if (isEditMode && isAuthenticated && isAdmin) {
      fetchProduct();
    }
  }, [isEditMode, id, isAuthenticated, isAdmin]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle array field changes (features, images)
  const handleArrayChange = (index, value, field) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  // Add new item to array fields
  const handleAddArrayItem = (field) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      if (field === 'features' || field === 'images') {
        newArray.push('');
      } else if (field === 'specifications') {
        newArray.push({ key: '', value: '' });
      } else if (field === 'variants') {
        newArray.push({ size: '', color: { name: '', code: '' }, price: 0, stock: 0, sku: '' });
      }
      return { ...prev, [field]: newArray };
    });
  };

  // Remove item from array fields
  const handleRemoveArrayItem = (index, field) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      // Ensure there's always at least one item
      if (newArray.length === 0) {
        if (field === 'features' || field === 'images') {
          newArray.push('');
        } else if (field === 'specifications') {
          newArray.push({ key: '', value: '' });
        } else if (field === 'variants') {
          newArray.push({ size: '', color: { name: '', code: '' }, price: 0, stock: 0, sku: '' });
        }
      }
      return { ...prev, [field]: newArray };
    });
  };

  // Handle specification changes
  const handleSpecChange = (index, field, value) => {
    setFormData(prev => {
      const newSpecs = [...prev.specifications];
      newSpecs[index] = { ...newSpecs[index], [field]: value };
      return { ...prev, specifications: newSpecs };
    });
  };

  // Handle variant changes
  const handleVariantChange = (index, field, value) => {
    setFormData(prev => {
      const newVariants = [...prev.variants];
      if (field === 'colorName' || field === 'colorCode') {
        newVariants[index] = {
          ...newVariants[index],
          color: {
            ...newVariants[index].color,
            [field === 'colorName' ? 'name' : 'code']: value
          }
        };
      } else {
        newVariants[index] = {
          ...newVariants[index],
          [field]: field === 'price' || field === 'stock' ? Number(value) : value
        };
      }
      return { ...prev, variants: newVariants };
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Validate form data
      if (!formData.name || !formData.brand || !formData.category) {
        setError('Please fill in all required fields');
        setSubmitting(false);
        return;
      }
      
      // Filter out empty values from arrays
      const cleanedData = {
        ...formData,
        features: formData.features.filter(f => f.trim()),
        images: formData.images.filter(i => i.trim()),
        specifications: Object.fromEntries(formData.specifications.filter(s => s.key.trim() && s.value.trim()).map(s => [s.key, s.value])),
        variants: formData.variants.filter(v =>
          v.size.trim() && v.color.name.trim() && v.color.code.trim() && v.price > 0 && v.stock >= 0 && v.sku.trim()
        )
      };
      
      if (cleanedData.variants.length === 0) {
        setError('At least one valid variant is required');
        setSubmitting(false);
        return;
      }
      
      let response;
      if (files.length > 0) {
        // Use multipart/form-data
        const fd = new FormData();
        Object.entries(cleanedData).forEach(([key, value]) => {
          if (key === 'features' || key === 'images') {
            value.forEach(val => fd.append(key, val));
          } else if (key === 'specifications' || key === 'variants') {
            fd.append(key, JSON.stringify(value));
          } else {
            fd.append(key, value);
          }
        });
        files.forEach(file => fd.append('images', file));
        if (isEditMode) {
          response = await updateProduct(id, fd, true); // true for multipart
        } else {
          response = await createProduct(fd, true);
        }
      } else {
        if (isEditMode) {
          response = await updateProduct(id, cleanedData);
        } else {
          response = await createProduct(cleanedData);
        }
      }
      
      setSuccessMessage(isEditMode ? 'Product updated successfully' : 'Product created successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
        if (isEditMode) {
          // Navigate back to products list after successful edit
          navigate('/admin/products');
        }
      }, 3000);
      
      // Reset form for new product creation
      if (!isEditMode) {
        setFormData({
          name: '',
          brand: '',
          category: '',
          basePrice: 0,
          description: '',
          features: [''],
          specifications: [{ key: '', value: '' }],
          images: [''],
          variants: [{ size: '', color: { name: '', code: '' }, price: 0, stock: 0, sku: '' }]
        });
        setFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
      
      setSubmitting(false);
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Failed to save product. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Spinner fullScreen size="large" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 mt-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-cyan-300 drop-shadow mb-2">{isEditMode ? 'Edit Product' : 'Add Product'}</h1>
          <p className="text-blue-100/80 text-lg">{isEditMode ? 'Update the product details below.' : 'Fill out the form to add a new product.'}</p>
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

        {/* Product Form */}
        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl border border-cyan-200/20 rounded-2xl shadow-xl p-8 max-w-3xl mx-auto space-y-6">
          {/* Name, Brand, Category, Base Price */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div>
              <label className="block text-cyan-100 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl bg-white/10 border border-cyan-400/30 text-cyan-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-cyan-300/50"
                placeholder="Product name"
                required
              />
            </div>
            <div>
              <label className="block text-cyan-100 mb-1">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full rounded-xl bg-white/10 border border-cyan-400/30 text-cyan-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-cyan-300/50"
                placeholder="Brand"
                required
              />
            </div>
            <div>
              <label className="block text-cyan-100 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl bg-white/10 border border-cyan-400/30 text-cyan-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-cyan-300/50"
                required
              >
                <option value="">Select Category</option>
                <option value="fan">Fan</option>
                <option value="ac">AC</option>
              </select>
            </div>
            <div>
              <label className="block text-cyan-100 mb-1">Base Price</label>
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleChange}
                className="w-full rounded-xl bg-white/10 border border-cyan-400/30 text-cyan-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-cyan-300/50"
                placeholder="Base Price"
                min={0}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-cyan-100 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-xl bg-white/10 border border-cyan-400/30 text-cyan-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-cyan-300/50"
              placeholder="Description"
              rows={2}
            />
          </div>

          {/* Features (Array) */}
          <div>
            <label className="block text-cyan-100 mb-1">Features</label>
            {formData.features.map((feature, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={e => handleArrayChange(idx, e.target.value, 'features')}
                  className="flex-1 rounded-xl bg-white/10 border border-cyan-400/30 text-cyan-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-cyan-300/50"
                  placeholder={`Feature ${idx + 1}`}
                />
                <button type="button" onClick={() => handleRemoveArrayItem(idx, 'features')} className="bg-red-500 hover:bg-red-700 text-white rounded px-3 py-1">-</button>
              </div>
            ))}
            <button type="button" onClick={() => handleAddArrayItem('features')} className="mt-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold px-4 py-1 rounded shadow transition-colors">Add Feature</button>
          </div>

          {/* Specifications (Key-Value Map) */}
          <div>
            <label className="block text-cyan-100 mb-1">Specifications</label>
            {formData.specifications.map((spec, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={spec.key}
                  onChange={e => handleSpecChange(idx, 'key', e.target.value)}
                  className="flex-1 rounded-xl bg-white/10 border border-cyan-400/30 text-cyan-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-cyan-300/50"
                  placeholder="Spec Key"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={e => handleSpecChange(idx, 'value', e.target.value)}
                  className="flex-1 rounded-xl bg-white/10 border border-cyan-400/30 text-cyan-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-cyan-300/50"
                  placeholder="Spec Value"
                />
                <button type="button" onClick={() => handleRemoveArrayItem(idx, 'specifications')} className="bg-red-500 hover:bg-red-700 text-white rounded px-3 py-1">-</button>
              </div>
            ))}
            <button type="button" onClick={() => handleAddArrayItem('specifications')} className="mt-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold px-4 py-1 rounded shadow transition-colors">Add Specification</button>
          </div>

          {/* Images (Array) */}
          <div>
            <label className="block text-cyan-100 mb-1">Images (URLs)</label>
            {formData.images.map((img, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={img}
                  onChange={e => handleArrayChange(idx, e.target.value, 'images')}
                  className="flex-1 rounded-xl bg-white/10 border border-cyan-400/30 text-cyan-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-cyan-300/50"
                  placeholder={`Image URL ${idx + 1}`}
                />
                <button type="button" onClick={() => handleRemoveArrayItem(idx, 'images')} className="bg-red-500 hover:bg-red-700 text-white rounded px-3 py-1">-</button>
              </div>
            ))}
            <button type="button" onClick={() => handleAddArrayItem('images')} className="mt-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold px-4 py-1 rounded shadow transition-colors">Add Image</button>
            <div className="mt-4">
              <label className="block text-cyan-100 mb-1">Or Upload Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="block w-full text-cyan-100 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
              />
              {files.length > 0 && (
                <div className="mt-2 text-xs text-cyan-200">{files.length} file(s) selected</div>
              )}
            </div>
          </div>

          {/* Variants (Array of objects) */}
          <div>
            <label className="block text-cyan-100 mb-1">Variants</label>
            {formData.variants.map((variant, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-6 gap-2 mb-2">
                <input
                  type="text"
                  value={variant.size}
                  onChange={e => handleVariantChange(idx, 'size', e.target.value)}
                  className="rounded-xl bg-white/10 border border-cyan-400/30 text-cyan-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-cyan-300/50"
                  placeholder="Size"
                />
                <input
                  type="text"
                  value={variant.color.name}
                  onChange={e => handleVariantChange(idx, 'colorName', e.target.value)}
                  className="rounded-xl bg-white/10 border border-cyan-400/30 text-cyan-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-cyan-300/50"
                  placeholder="Color Name"
                />
                <input
                  type="text"
                  value={variant.color.code}
                  onChange={e => handleVariantChange(idx, 'colorCode', e.target.value)}
                  className="rounded-xl bg-white/10 border border-cyan-400/30 text-cyan-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-cyan-300/50"
                  placeholder="Color Code"
                />
                <input
                  type="number"
                  value={variant.price}
                  onChange={e => handleVariantChange(idx, 'price', e.target.value)}
                  className="rounded-xl bg-white/10 border border-cyan-400/30 text-cyan-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-cyan-300/50"
                  placeholder="Price"
                  min={0}
                />
                <input
                  type="number"
                  value={variant.stock}
                  onChange={e => handleVariantChange(idx, 'stock', e.target.value)}
                  className="rounded-xl bg-white/10 border border-cyan-400/30 text-cyan-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-cyan-300/50"
                  placeholder="Stock"
                  min={0}
                />
                <input
                  type="text"
                  value={variant.sku}
                  onChange={e => handleVariantChange(idx, 'sku', e.target.value)}
                  className="rounded-xl bg-white/10 border border-cyan-400/30 text-cyan-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder:text-cyan-300/50"
                  placeholder="SKU"
                />
                <button type="button" onClick={() => handleRemoveArrayItem(idx, 'variants')} className="bg-red-500 hover:bg-red-700 text-white rounded px-3 py-1">-</button>
              </div>
            ))}
            <button type="button" onClick={() => handleAddArrayItem('variants')} className="mt-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold px-4 py-1 rounded shadow transition-colors">Add Variant</button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button type="submit" disabled={submitting} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-8 py-2 rounded-xl shadow transition-colors">
              {submitting ? 'Saving...' : isEditMode ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default ProductForm;
