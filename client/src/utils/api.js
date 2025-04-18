import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5050/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Product API calls
export const getProducts = async () => {
  try {
    const res = await api.get('/products');
    return res.data;
  } catch (err) {
    console.error('Error fetching products:', err);
    throw err;
  }
};

export const getProduct = async (id) => {
  try {
    const res = await api.get(`/products/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching product ${id}:`, err);
    throw err;
  }
};

// Alias for getProduct to match the import in ProductForm.js
export const getProductById = getProduct;

export const createProduct = async (productData) => {
  try {
    const res = await api.post('/products', productData);
    return res.data;
  } catch (err) {
    console.error('Error creating product:', err);
    throw err;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const res = await api.put(`/products/${id}`, productData);
    return res.data;
  } catch (err) {
    console.error(`Error updating product ${id}:`, err);
    throw err;
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error deleting product ${id}:`, err);
    throw err;
  }
};

// Order API calls
export const createOrder = async (orderData) => {
  try {
    const res = await api.post('/orders', orderData);
    return res.data;
  } catch (err) {
    console.error('Error creating order:', err);
    throw err;
  }
};

export const getMyOrders = async () => {
  try {
    const res = await api.get('/orders');
    return res.data;
  } catch (err) {
    console.error('Error fetching orders:', err);
    throw err;
  }
};

export const getOrder = async (id) => {
  try {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching order ${id}:`, err);
    throw err;
  }
};

// Alias for getOrder to match the import in OrderDetail.js
export const getOrderById = getOrder;

export const updateOrderToPaid = async (id, paymentData) => {
  try {
    const res = await api.put(`/orders/${id}/pay`, paymentData);
    return res.data;
  } catch (err) {
    console.error(`Error updating order ${id} to paid:`, err);
    throw err;
  }
};

export const cancelOrder = async (id) => {
  try {
    const res = await api.put(`/orders/${id}/cancel`);
    return res.data;
  } catch (err) {
    console.error(`Error cancelling order ${id}:`, err);
    throw err;
  }
};

// Admin API calls
export const getAllOrders = async () => {
  try {
    const res = await api.get('/admin/orders');
    return res.data;
  } catch (err) {
    console.error('Error fetching all orders:', err);
    throw err;
  }
};

export const updateOrderStatus = async (id, statusData) => {
  try {
    const res = await api.put(`/admin/orders/${id}`, statusData);
    return res.data;
  } catch (err) {
    console.error(`Error updating order ${id} status:`, err);
    throw err;
  }
};

export const getAllRiders = async () => {
  try {
    const res = await api.get('/admin/riders');
    return res.data;
  } catch (err) {
    console.error('Error fetching riders:', err);
    throw err;
  }
};

export const getApprovedEmails = async () => {
  try {
    const res = await api.get('/admin/approved-emails');
    return res.data;
  } catch (err) {
    console.error('Error fetching approved emails:', err);
    throw err;
  }
};

export const addApprovedEmail = async (emailData) => {
  try {
    const res = await api.post('/admin/approved-emails', emailData);
    return res.data;
  } catch (err) {
    console.error('Error adding approved email:', err);
    throw err;
  }
};

export const deleteApprovedEmail = async (id) => {
  try {
    const res = await api.delete(`/admin/approved-emails/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error deleting approved email ${id}:`, err);
    throw err;
  }
};

// Rider API calls
export const getRiderOrders = async () => {
  try {
    const res = await api.get('/rider/orders');
    return res.data;
  } catch (err) {
    console.error('Error fetching rider orders:', err);
    throw err;
  }
};

export const getRiderOrderDetails = async (id) => {
  try {
    const res = await api.get(`/rider/orders/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching rider order ${id}:`, err);
    throw err;
  }
};

export const updateRiderOrderStatus = async (id, statusData) => {
  try {
    const res = await api.put(`/rider/orders/${id}`, statusData);
    return res.data;
  } catch (err) {
    console.error(`Error updating rider order ${id} status:`, err);
    throw err;
  }
};

export default api;
