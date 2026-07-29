import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from '../ui/Button';

export const ErrorState = ({
  title = 'Unable to load data',
  description = 'An error occurred while communicating with the server.',
  error = null,
  onRetry = null,
  className = '',
}) => {
  const errorMessage = error?.message || error?.toString() || description;

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-3xl border border-rose-100/90 shadow-2xs space-y-4 ${className}`}
    >
      <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center border border-rose-100 shadow-2xs">
        <AlertCircle className="w-7 h-7 shrink-0 stroke-[2.2]" />
      </div>
      <div className="space-y-1.5 max-w-md">
        <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-600 font-medium leading-relaxed">{errorMessage}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} icon={RefreshCw} className="mt-2 font-bold">
          Retry Connection
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
