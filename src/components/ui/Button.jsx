import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  
  const baseStyles =
    'inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] select-none';

  
  const variants = {
    primary:
      'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/40 focus:ring-indigo-500 border border-indigo-400/20',
    secondary:
      'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900 border border-indigo-200/80 shadow-2xs focus:ring-indigo-500',
    outline:
      'bg-white border-2 border-slate-300 hover:border-indigo-600 text-slate-800 hover:text-indigo-600 hover:bg-indigo-50/50 shadow-2xs focus:ring-indigo-500',
    ghost:
      'bg-transparent text-slate-700 hover:text-indigo-700 hover:bg-indigo-50/80 focus:ring-indigo-500',
    danger:
      'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white shadow-md shadow-rose-500/25 hover:shadow-lg hover:shadow-rose-500/40 focus:ring-rose-500 border border-rose-400/20',
    success:
      'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/40 focus:ring-emerald-500 border border-emerald-400/20',
  };

  
  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-xs font-bold gap-2',
    lg: 'px-7 py-3.5 text-sm font-extrabold gap-2.5',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0 stroke-[2.2]" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0 stroke-[2.2]" />}
        </>
      )}
    </button>
  );
};

export default Button;
