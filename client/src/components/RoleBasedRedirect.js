import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedRedirect = ({ children }) => {
  const { isAdmin, isRider, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect after authentication is checked
    if (!loading) {
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else if (isRider) {
        navigate('/rider/dashboard');
      }
    }
  }, [isAdmin, isRider, loading, navigate]);

  // If loading or not admin/rider, render children (regular content)
  return loading || (!isAdmin && !isRider) ? children : null;
};

export default RoleBasedRedirect;
