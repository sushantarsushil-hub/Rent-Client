import React from 'react';
import { Building2 } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

export const PageLoader = ({ text = 'Loading Rentify Marketplace...' }) => {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center space-y-4">
      <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 shadow-xs">
        <Building2 className="w-8 h-8" />
      </div>
      <LoadingSpinner size="lg" color="text-blue-700" />
      <p className="text-sm font-semibold text-slate-700 tracking-tight">{text}</p>
    </div>
  );
};

export default PageLoader;
