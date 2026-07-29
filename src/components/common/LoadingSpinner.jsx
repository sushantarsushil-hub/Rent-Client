import React from 'react';

export const LoadingSpinner = ({ size = 'md', color = 'text-blue-700', text = null }) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="inline-flex flex-col items-center justify-center space-y-2">
      <div
        className={`${sizeMap[size]} ${color} border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="loading"
      />
      {text && <span className="text-xs font-medium text-slate-500">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
