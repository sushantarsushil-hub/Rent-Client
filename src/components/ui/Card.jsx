import React from 'react';

export const Card = ({ children, className = '', hoverable = true }) => {
  return (
    <div
      className={`bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden transition-all duration-300 ${
        hoverable ? 'hover:shadow-lg hover:-translate-y-0.5' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => {
  return <div className={`p-5 border-b border-base-200 ${className}`}>{children}</div>;
};

export const CardBody = ({ children, className = '' }) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = '' }) => {
  return <div className={`p-5 border-t border-base-200 bg-base-50/50 ${className}`}>{children}</div>;
};

export default Card;
