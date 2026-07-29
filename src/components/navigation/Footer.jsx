'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';
import { FacebookIcon, LinkedinIcon, InstagramIcon, XIcon } from '../ui/SocialIcons';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="p-2.5 bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white rounded-2xl shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                <Building2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Rent<span className="text-blue-500">ify</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm">
              Modern Urban Rental & Booking Marketplace. Connecting tenants with verified property hosts for seamless, secure real estate rentals worldwide.
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="p-2 bg-slate-900 hover:bg-blue-600 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-all duration-200"
                aria-label="Visit Facebook Profile"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="p-2 bg-slate-900 hover:bg-blue-700 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-all duration-200"
                aria-label="Visit LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="p-2 bg-slate-900 hover:bg-pink-600 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-all duration-200"
                aria-label="Visit Instagram Profile"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-all duration-200"
                aria-label="Visit X Profile"
              >
                <XIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Marketplace</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-blue-400 transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-400 transition-colors">
                  Sign In Account
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-blue-400 transition-colors">
                  Register Account
                </Link>
              </li>
            </ul>
          </div>

          
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform Legal</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="#" className="hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-400 transition-colors">
                  Host Protection Policy
                </Link>
              </li>
            </ul>
          </div>

          
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Contact & Support</h4>
            <div className="space-y-2 text-xs text-slate-400 font-medium">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" /> San Francisco, CA 94105
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" /> support@rentify.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" /> +1 (800) 555-RENT
              </p>
            </div>
          </div>
        </div>

       
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} Rentify Platform Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 font-medium">
            <Link href="#" className="hover:text-slate-400 transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link href="#" className="hover:text-slate-400 transition-colors">
              Terms
            </Link>
            <span>•</span>
            <Link href="#" className="hover:text-slate-400 transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
