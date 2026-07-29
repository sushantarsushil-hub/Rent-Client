'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  Heart,
  User,
  Building,
  Building2,
  X,
  PlusCircle,
  FileSpreadsheet,
  Users,
  Receipt,
} from 'lucide-react';
import { useAuth } from '../../providers/AuthProvider';

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { user } = useAuth();
  const pathname = usePathname() || '';
  const role = (user?.role || '').toLowerCase();

  const tenantNavItems = [
    { name: 'Tenant Overview', path: '/dashboard/tenant', icon: LayoutDashboard },
    { name: 'My Bookings', path: '/dashboard/tenant/bookings', icon: CalendarCheck },
    { name: 'Saved Favorites', path: '/dashboard/tenant/favorites', icon: Heart },
    { name: 'Profile Settings', path: '/dashboard/tenant/profile', icon: User },
  ];

  const ownerNavItems = [
    { name: 'Owner Overview', path: '/dashboard/owner', icon: LayoutDashboard },
    { name: 'Add Property', path: '/dashboard/owner/add-property', icon: PlusCircle },
    { name: 'My Properties', path: '/dashboard/owner/properties', icon: Building },
    { name: 'Booking Requests', path: '/dashboard/owner/booking-requests', icon: FileSpreadsheet },
    { name: 'Profile Settings', path: '/dashboard/owner/profile', icon: User },
  ];

  const adminNavItems = [
    { name: 'Admin Overview', path: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'All Users', path: '/dashboard/admin/users', icon: Users },
    { name: 'All Properties', path: '/dashboard/admin/properties', icon: Building },
    { name: 'All Bookings', path: '/dashboard/admin/bookings', icon: CalendarCheck },
    { name: 'Transactions Log', path: '/dashboard/admin/transactions', icon: Receipt },
    { name: 'Profile Settings', path: '/dashboard/admin/profile', icon: User },
  ];

  const navItems = role === 'tenant' ? tenantNavItems : role === 'admin' ? adminNavItems : ownerNavItems;

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
         
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl shadow-md">
                <Building2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-black text-white">
                Rent<span className="text-indigo-400">ify</span>
              </span>
            </Link>
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          
          <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
            <div className="px-3 mb-3 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
              {user?.role || 'User'} Dashboard Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 font-black'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 stroke-[2.2]" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

         
          <div className="p-4 border-t border-slate-800 m-3 bg-slate-800/60 rounded-2xl border border-slate-700/50">
            <div className="flex items-center gap-3">
              <img
                src={user?.photo || user?.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'}
                alt={user?.name}
                className="w-10 h-10 rounded-xl object-cover border-2 border-indigo-500 shadow-xs"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'User'}</p>
                <span className="text-[10px] font-black text-indigo-300 bg-indigo-950/80 border border-indigo-800/80 px-2 py-0.5 rounded-full uppercase">
                  {user?.role || 'Tenant'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
