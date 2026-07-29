'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Menu, X, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth, getDashboardPath } from '../../providers/AuthProvider';
import Button from '../ui/Button';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname() || '/';

  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Properties', path: '/properties' },
  ];

  const userDashboardPath = getDashboardPath(user?.role);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
         
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="p-2.5 bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white rounded-2xl shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Building2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Rent<span className="text-blue-600">ify</span>
            </span>
          </Link>

          
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-2xs border border-blue-200/80 font-black'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100/80'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            
            {mounted && isAuthenticated && (
              <Link
                href={userDashboardPath}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-150 flex items-center gap-1.5 ${
                  pathname.startsWith('/dashboard')
                    ? 'bg-blue-50 text-blue-700 border border-blue-200/80 font-black'
                    : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100/80'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
            )}
          </nav>

          
          <div className="hidden md:flex items-center space-x-3">
            {mounted && isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-2xl border border-slate-200/90 bg-slate-50/80 hover:bg-slate-100/90 transition-all hover:border-blue-300 shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  aria-expanded={isProfileMenuOpen}
                  aria-label="User Account Menu"
                >
                  <img
                    src={user?.photo || user?.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'}
                    alt={user?.name || 'User Profile'}
                    className="w-8 h-8 rounded-xl object-cover border-2 border-blue-600 shadow-2xs"
                  />
                  <span className="text-xs font-black text-slate-800 max-w-[110px] truncate">
                    {user?.name || 'Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                
                {isProfileMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200/90 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setIsProfileMenuOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-slate-100 space-y-1">
                      <p className="text-xs font-black text-slate-900 truncate">{user?.name || 'User Account'}</p>
                      <p className="text-[10px] text-slate-500 font-medium truncate">{user?.email || 'user@example.com'}</p>
                      <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full border border-blue-200/80 uppercase">
                        {user?.role || 'Tenant'} Portal
                      </span>
                    </div>

                    <Link
                      href={userDashboardPath}
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-extrabold text-slate-800 hover:bg-blue-50/80 hover:text-blue-700 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-blue-600" />
                      Go to Dashboard
                    </Link>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-extrabold text-rose-600 hover:bg-rose-50 border-t border-slate-100 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out Account
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-extrabold text-slate-800">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm" className="shadow-md shadow-blue-500/20">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

         
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                pathname === link.path
                  ? 'bg-blue-50 text-blue-700 font-extrabold border border-blue-200/80'
                  : 'text-slate-800 hover:bg-slate-100/80'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {mounted && isAuthenticated ? (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="px-3.5 py-2 flex items-center gap-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <img
                  src={user?.photo || user?.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'}
                  alt={user?.name || 'User Profile'}
                  className="w-9 h-9 rounded-xl object-cover border-2 border-blue-600"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-black text-slate-900 truncate">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium truncate">{user?.role} Account</p>
                </div>
              </div>

              <Link
                href={userDashboardPath}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-extrabold text-blue-700 bg-blue-50 border border-blue-200/80"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard ({user?.role || 'Tenant'})
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-extrabold text-rose-600 bg-rose-50 border border-rose-200 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out Account
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" fullWidth size="md">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" fullWidth size="md">
                  Register Account
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
