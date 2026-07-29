'use client';

import React from 'react';
import { AlertTriangle, Home, LayoutDashboard, RefreshCw } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth, getDashboardPath } from '../../providers/AuthProvider';

export const ErrorPage = ({
  title = 'Unexpected Application Error',
  description = 'Something went wrong while processing your request. Please try refreshing or return to dashboard.',
  error = null,
  resetErrorBoundary = null,
}) => {
  let userRole = 'tenant';
  try {
    const auth = useAuth();
    if (auth?.user?.role) {
      userRole = auth.user.role;
    }
  } catch (_e) {
    // Fallback if rendered outside Auth context
  }

  const dashboardPath = getDashboardPath(userRole);

  const handleReload = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 text-center bg-slate-50/50">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-lg space-y-6">
        {/* Warning Icon Badge */}
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200 shadow-2xs">
          <AlertTriangle className="w-8 h-8 stroke-[2.2]" />
        </div>

        {/* Title and message */}
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-black uppercase tracking-wider border border-rose-200">
            System Error Notice
          </span>
          <h1 className="text-2xl font-black text-slate-900">{title}</h1>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">{description}</p>
        </div>

        {/* Error Trace details */}
        {error && (
          <details className="text-left bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <summary className="font-bold text-slate-700 cursor-pointer select-none">
              Technical Error Details
            </summary>
            <p className="mt-2 font-mono text-[11px] text-rose-600 break-words leading-relaxed">
              {error.message || error.toString()}
            </p>
          </details>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="primary"
            fullWidth
            onClick={handleReload}
            icon={RefreshCw}
            size="sm"
            className="font-bold"
          >
            Try Again
          </Button>

          <Button
            variant="outline"
            fullWidth
            onClick={() => (window.location.href = dashboardPath)}
            icon={LayoutDashboard}
            size="sm"
            className="font-bold"
          >
            Dashboard
          </Button>

          <Button
            variant="ghost"
            fullWidth
            onClick={() => (window.location.href = '/')}
            icon={Home}
            size="sm"
            className="font-bold text-slate-600"
          >
            Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
