'use client';

import React from 'react';
import Link from 'next/link';
import { FileQuestion, Home, LayoutDashboard } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth, getDashboardPath } from '../../providers/AuthProvider';

export const NotFound = () => {
  const { user } = useAuth();
  const userDashboard = getDashboardPath(user?.role);

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 text-center bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-md space-y-6">
        <div className="w-16 h-16 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mx-auto border border-blue-200 shadow-2xs">
          <FileQuestion className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-extrabold uppercase tracking-wider border border-blue-200 inline-block">
            404 Error
          </span>
          <h1 className="text-3xl font-black text-slate-900">Page Not Found</h1>
          <p className="text-xs text-slate-600 font-normal leading-relaxed">
            The page or property listing you are searching for does not exist or has been relocated.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/" className="flex-1">
            <Button variant="primary" fullWidth icon={Home} size="sm">
              Return Home
            </Button>
          </Link>
          <Link href={userDashboard} className="flex-1">
            <Button variant="outline" fullWidth icon={LayoutDashboard} size="sm">
              My Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
