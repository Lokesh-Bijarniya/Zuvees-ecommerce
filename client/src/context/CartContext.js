import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const { user } = useAuth();

  // Load cart from backend on initial render
  useEffect(() => {
    const fetchCart = async () => {
      if (!user || !user._id) return;
      try {
        const res = await api.get('/cart', { withCredentials: true });
        if (res.data && Array.isArray(res.data.items)) {
          setCartItems(res.data.items);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.error('Failed to load cart:', err);
      }
    };
    fetchCart();
  }, [user]);

  // Update totals whenever cart changes
  useEffect(() => {
    // Calculate totals
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const price = cartItems.reduce(
      (total, item) => total + item.variant.price * item.quantity, 
      0
    );
    
    setTotalItems(itemCount);
    setTotalPrice(price);
  }, [cartItems]);

  // Add item to cart
  const addToCart = async (product, variant, quantity = 1) => {
    console.log("addToCart called", { product, variant, quantity, user });
    
    if (!user || !user._id) return; // Only for logged-in users
  
    try {
      const res = await api.post('/cart', {
        product: product._id,
        variant,
        quantity
      }, { withCredentials: true });
  
      if (res.data && Array.isArray(res.data.items)) {
        setCartItems(res.data.items);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error('Failed to add to cart:', err);
      // Optionally show error to user
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId, variantColor, variantSize) => {
    if (!user || !user._id) return;
    try {
      const res = await api.delete('/cart/item', {
        data: {
          product: productId,
          variant: { color: { name: variantColor }, size: variantSize }
        },
        withCredentials: true
      });
      if (res.data && Array.isArray(res.data.items)) {
        setCartItems(res.data.items);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error('Failed to remove item from cart:', err);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, variantColor, variantSize, quantity) => {
    if (!user || !user._id) return;
    if (quantity <= 0) {
      await removeFromCart(productId, variantColor, variantSize);
      return;
    }
    try {
      const res = await api.post('/cart', {
        product: productId,
        variant: { color: { name: variantColor }, size: variantSize },
        quantity
      }, { withCredentials: true });
      if (res.data && Array.isArray(res.data.items)) {
        setCartItems(res.data.items);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error('Failed to update cart quantity:', err);
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!user || !user._id) return;
    try {
      const res = await api.delete('/cart', { withCredentials: true });
      if (res.data && Array.isArray(res.data.items)) {
        setCartItems(res.data.items);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalPrice,
        totalItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartContext;
