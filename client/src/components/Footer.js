import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">Zuvee</h3>
              <p className="text-gray-400 mb-4">
                Premium quality fans and air conditioners for your home and office. We provide the best cooling solutions for all your needs.
              </p>
              <div className="flex space-x-4">
                <SocialIcon icon={<FaFacebook />} href="https://facebook.com" />
                <SocialIcon icon={<FaTwitter />} href="https://twitter.com" />
                <SocialIcon icon={<FaInstagram />} href="https://instagram.com" />
                <SocialIcon icon={<FaYoutube />} href="https://youtube.com" />
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <FooterLink to="/">Home</FooterLink>
                <FooterLink to="/products">Products</FooterLink>
                <FooterLink to="/about">About Us</FooterLink>
                <FooterLink to="/contact">Contact</FooterLink>
                <FooterLink to="/faq">FAQ</FooterLink>
              </ul>
            </motion.div>
          </div>

          {/* Categories */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                <FooterLink to="/products?category=fan">Fans</FooterLink>
                <FooterLink to="/products?category=ac">Air Conditioners</FooterLink>
                <FooterLink to="/products?new=true">New Arrivals</FooterLink>
                <FooterLink to="/products?bestseller=true">Best Sellers</FooterLink>
                <FooterLink to="/products?sale=true">Special Offers</FooterLink>
              </ul>
            </motion.div>
          </div>

          {/* Contact Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaMapMarkerAlt className="text-blue-400 mt-1 mr-3" />
                  <span className="text-gray-400">123 Cooling Street, Comfort City, 10001</span>
                </li>
                <li className="flex items-center">
                  <FaPhone className="text-blue-400 mr-3" />
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center">
                  <FaEnvelope className="text-blue-400 mr-3" />
                  <span className="text-gray-400">support@zuvee.com</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Zuvee. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-gray-500 text-sm hover:text-gray-300 transition duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-500 text-sm hover:text-gray-300 transition duration-300">
                Terms of Service
              </Link>
              <Link to="/shipping" className="text-gray-500 text-sm hover:text-gray-300 transition duration-300">
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Social Media Icon Component
const SocialIcon = ({ icon, href }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-gray-800 p-2 rounded-full text-gray-400 hover:text-white hover:bg-blue-600 transition-colors duration-300"
    whileHover={{ y: -3 }}
    whileTap={{ scale: 0.9 }}
  >
    {icon}
  </motion.a>
);

// Footer Link Component
const FooterLink = ({ to, children }) => (
  <li>
    <Link 
      to={to} 
      className="text-gray-400 hover:text-blue-400 transition-colors duration-300 block"
    >
      <motion.span
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
    </Link>
  </li>
);

export default Footer;
