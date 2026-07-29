'use client';

import React from 'react';
import { Building2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoadingPage = ({ message = 'Loading platform content...' }) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-slate-50/50">
      <div className="relative flex flex-col items-center max-w-sm w-full bg-white p-10 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
        {/* Animated Glow Logo Container */}
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-30 animate-pulse" />
          <motion.div
            animate={{ scale: [0.95, 1.05, 0.95] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="relative w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30"
          >
            <Building2 className="w-8 h-8" />
          </motion.div>
        </div>

        {/* Loading Spinner ring */}
        <div className="relative w-10 h-10">
          <div className="w-10 h-10 border-3 border-blue-100 rounded-full" />
          <div className="absolute inset-0 w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>

        {/* Label & Description */}
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[11px] font-black uppercase tracking-wider border border-blue-200">
            <Sparkles className="w-3 h-3 text-blue-600" /> Rentify Experience
          </span>
          <h2 className="text-xl font-extrabold text-slate-900">Please Wait</h2>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
