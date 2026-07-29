'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Home, LayoutDashboard } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth, getDashboardPath } from '../../providers/AuthProvider';

export const Forbidden = () => {
  const { user } = useAuth();
  const userDashboard = getDashboardPath(user?.role);

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 text-center bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-md space-y-6">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200 shadow-2xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-extrabold uppercase tracking-wider border border-amber-200 inline-block">
            403 Forbidden
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Access Restricted</h1>
          <p className="text-xs text-slate-600 font-normal leading-relaxed">
            Your current account role <span className="font-bold text-slate-900">({user?.role || 'Guest'})</span> does not have authorization to view this protected dashboard route.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href={userDashboard} className="flex-1">
            <Button variant="primary" fullWidth icon={LayoutDashboard} size="sm">
              My Dashboard
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="outline" fullWidth icon={Home} size="sm">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
