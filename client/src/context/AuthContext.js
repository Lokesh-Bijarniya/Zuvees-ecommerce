import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from API on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get('/auth/me', {
          withCredentials: true
        });
        
        if (res.data.success) {
          setUser(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        setError('Failed to authenticate user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Google login
  const loginWithGoogle = () => {
    window.location.href = 'https://zuvees-ecommerce.onrender.com/api/auth/google';
  };

  // Check if email is approved
  const checkEmail = async (email) => {
    try {
      const res = await api.post('/auth/check-email', { email });
      return res.data;
    } catch (err) {
      console.error('Email check failed:', err);
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      // Clear user state first
      setUser(null);
      
      // Clear any auth tokens from localStorage if they exist
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Call the logout endpoint to clear server-side session/cookies
      await api.get('/auth/logout', {
        withCredentials: true
      });
      
      // Redirect to home page
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Failed to logout');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        setUser,
        loginWithGoogle,
        checkEmail,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isRider: user?.role === 'rider',
        isCustomer: user?.role === 'customer'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
