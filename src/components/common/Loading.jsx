import React from 'react';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className={`${sizeClasses[size]} border-primary border-t-transparent rounded-full`}
      />
      {text && <p className="text-sm font-medium text-base-content/70 animate-pulse">{text}</p>}
    </div>
  );
};

export const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 bg-base-100/80 backdrop-blur-md z-50 flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.9, 1.1, 1], opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        className="p-4 bg-primary/10 rounded-full text-primary mb-4"
      >
        <Building2 className="w-12 h-12" />
      </motion.div>
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
      <h3 className="text-lg font-semibold text-base-content">Rentify Platform</h3>
      <p className="text-sm text-base-content/60">Loading properties & details...</p>
    </div>
  );
};

export const PropertyCardSkeleton = () => {
  return (
    <div className="card bg-base-100 shadow-sm border border-base-200 animate-pulse">
      <div className="h-48 bg-base-300 w-full rounded-t-2xl"></div>
      <div className="card-body p-5 space-y-3">
        <div className="h-4 bg-base-300 rounded w-1/3"></div>
        <div className="h-6 bg-base-300 rounded w-3/4"></div>
        <div className="h-4 bg-base-300 rounded w-1/2"></div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-base-300 rounded w-1/4"></div>
          <div className="h-8 bg-base-300 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
