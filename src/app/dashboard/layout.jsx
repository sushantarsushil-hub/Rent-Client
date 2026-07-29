'use client';

import React, { useState } from 'react';
import Sidebar from '../../components/navigation/Sidebar';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../providers/AuthProvider';
import Button from '../../components/ui/Button';

export default function NextDashboardLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Sidebar
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        <div className="lg:pl-64 flex flex-col flex-1">
          {/* Top Bar Header */}
          <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-8 shadow-2xs">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 ml-auto">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900">{user?.name || 'User'}</p>
                <span className="text-[10px] font-bold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded">
                  {user?.role || 'Tenant'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                icon={LogOut}
                className="text-slate-600 hover:text-rose-600 hover:bg-rose-50"
              >
                Logout
              </Button>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
