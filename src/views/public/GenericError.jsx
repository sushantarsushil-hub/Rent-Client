'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home, LayoutDashboard } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth, getDashboardPath } from '../../providers/AuthProvider';

export const GenericError = ({ error, resetErrorBoundary }) => {
  const { user } = useAuth();
  const userDashboard = getDashboardPath(user?.role);

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 text-center bg-slate-50">
      <div className="max-w-lg w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-md space-y-6">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200 shadow-2xs">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-extrabold uppercase tracking-wider border border-rose-200 inline-block">
            Runtime Error Caught
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Something Went Wrong</h1>
          <p className="text-xs text-slate-600 font-normal leading-relaxed">
            An unexpected application runtime exception occurred. We have safely caught this error to prevent system disruption.
          </p>
        </div>

        {error && (
          <details className="text-left bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <summary className="font-bold text-slate-700 cursor-pointer select-none">
              Technical Details & Message
            </summary>
            <p className="mt-2 font-mono text-[11px] text-rose-600 break-words">
              {error.toString()}
            </p>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {resetErrorBoundary && (
            <Button
              variant="primary"
              fullWidth
              onClick={resetErrorBoundary}
              icon={RefreshCw}
              size="sm"
            >
              Try Again
            </Button>
          )}

          <Link href={userDashboard} className="flex-1">
            <Button variant="outline" fullWidth icon={LayoutDashboard} size="sm">
              My Dashboard
            </Button>
          </Link>

          <Link href="/" className="flex-1">
            <Button variant="ghost" fullWidth icon={Home} size="sm">
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GenericError;
