'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function LogoLoader({ size = 'md', className = '' }) {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const logoSizes = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`relative flex items-center justify-center ${sizes[size]} ${className}`}>
      {/* Outer spinning ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-2 border-indigo-500/10 border-t-indigo-500 rounded-[30%] opacity-40"
      />
      
      {/* Middle pulsing ring */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-2 bg-indigo-500/5 rounded-full blur-xl"
      />

      {/* The Logo */}
      <motion.img
        src="/logo.png"
        alt="Loading..."
        className={`${logoSizes[size]} object-contain relative z-10`}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
