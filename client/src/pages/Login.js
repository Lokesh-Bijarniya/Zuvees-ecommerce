import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGoogle, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { loginWithGoogle, isAuthenticated, user, checkEmail } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    console.log("Auth user object:", user);
    if (isAuthenticated && user) {
      if (user.role === "rider") {
        navigate("/rider/dashboard");
      } else if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Handle email check before login
  const handleEmailCheck = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setEmailError('Please enter your email address');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    try {
      setIsCheckingEmail(true);
      setEmailError('');
      setGeneralError('');
      
      const response = await checkEmail(email);
      
      if (response.success) {
        // Email is approved, proceed with Google login
        loginWithGoogle();
      } else {
        setEmailError('This email is not approved for access');
      }
    } catch (err) {
      console.error('Email check error:', err);
      if (err.response && err.response.status === 403) {
        setEmailError('This email is not approved for access');
      } else {
        setGeneralError('An error occurred. Please try again.');
      }
    } finally {
      setIsCheckingEmail(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white">
      <motion.div 
        className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-blue-200/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <motion.h2 
              className="text-3xl font-bold text-cyan-200"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Login to Zuvee
            </motion.h2>
            <motion.p 
              className="mt-2 text-blue-100/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Access your account to shop fans and ACs
            </motion.p>
          </div>
          {generalError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {generalError}
            </div>
          )}
          <form onSubmit={handleEmailCheck} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-cyan-200 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                className={`appearance-none block w-full px-3 py-2 border ${emailError ? 'border-red-500' : 'border-blue-200/20'} rounded-md shadow-sm bg-gray-900/40 text-cyan-100 placeholder-blue-100/50 focus:outline-none focus:ring-cyan-400 focus:border-cyan-400`}
                placeholder="you@example.com"
              />
              {emailError && (
                <p className="mt-2 text-sm text-red-400">{emailError}</p>
              )}
              <p className="mt-2 text-xs text-blue-100/60">
                We'll check if your email is approved before proceeding.
              </p>
            </div>
            <div>
              <motion.button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2"
                disabled={isCheckingEmail}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isCheckingEmail ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Checking...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FaLock className="mr-2" />
                    Continue with Email
                  </span>
                )}
              </motion.button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-blue-200/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900/80 text-blue-100/60">Or</span>
              </div>
            </div>
            <div>
              <motion.button
                type="button"
                onClick={loginWithGoogle}
                className="w-full flex justify-center items-center py-2 px-4 border border-blue-200/20 rounded-md shadow-lg bg-gray-900/40 text-sm font-medium text-cyan-100 hover:bg-gray-900/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaGoogle className="mr-2 text-red-500" />
                Sign in with Google
              </motion.button>
            </div>
          </form>
          <div className="mt-6">
            <div className="text-center text-sm">
              <p className="text-blue-100/80">
                By signing in, you agree to our{' '}
                <Link to="/terms" className="font-medium text-cyan-400 hover:text-cyan-200">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="font-medium text-cyan-400 hover:text-cyan-200">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
