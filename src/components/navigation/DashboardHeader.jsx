'use client';

import React from 'react';
import { Menu, LogOut, ExternalLink } from 'lucide-react';
import { useAppRouter } from '../../hooks/useAppRouter';
import { useAuth } from '../../providers/AuthProvider';

const DashboardHeader = ({ onOpenMobileSidebar }) => {
  const { user, logout } = useAuth();
  const router = useAppRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const userRole = (user?.role || 'tenant').toLowerCase();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between">
      
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>Rentify Platform</span>
          <span>/</span>
          <span className="font-extrabold text-slate-900 uppercase tracking-wider">{userRole} Dashboard</span>
        </div>
      </div>

      
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/')}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Public Site
        </button>

        
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0 border border-blue-200">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="hidden md:block text-left text-xs">
            <p className="font-extrabold text-slate-900 leading-tight">{user?.name || 'User'}</p>
            <p className="text-[10px] text-slate-500 font-bold capitalize">{userRole}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout Account"
            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors cursor-pointer ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
