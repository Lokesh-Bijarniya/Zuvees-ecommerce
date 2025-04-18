import React from 'react';
import { motion } from 'framer-motion';

const Spinner = ({ fullScreen, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  const spinner = (
    <div className="relative flex justify-center items-center">
      <motion.div
        className={`${sizeClasses[size]} border-4 border-cyan-200/20 rounded-full`}
        style={{ borderTopColor: 'rgb(103 232 249)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 flex justify-center items-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Spinner;
