'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Building, CalendarCheck, TrendingUp, Sparkles, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorState from '../../../components/common/ErrorState';
import EmptyState from '../../../components/common/EmptyState';
import { useAuth } from '../../../providers/AuthProvider';
import { useOwnerMetrics } from '../../../api/ownerService';
import { formatCurrency } from '../../../utils/formatters';

const containerVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const OwnerHome = () => {
  const { user } = useAuth();
  const { data: metrics, isLoading, isError, refetch } = useOwnerMetrics();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-36 bg-slate-100 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
        <div className="h-80 bg-slate-100 rounded-2xl animate-pulse flex items-center justify-center">
          <LoadingSpinner text="Fetching host analytics & 12-month chart..." />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load owner metrics"
        description="Could not fetch revenue analytics from backend."
        onRetry={refetch}
      />
    );
  }

  const {
    totalEarnings = 0,
    totalProperties = 0,
    totalBookings = 0,
    monthlyEarnings = [],
  } = metrics || {};

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-7xl mx-auto"
    >
      
      <motion.div
        variants={cardVariants}
        className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-md space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-900/60 text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-700/50">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Owner Dashboard & Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
          Welcome Back, {user?.name || 'Property Owner'}!
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
          Here is your performance overview, total booking earnings, property listings count, and 12-month revenue trend.
        </p>
      </motion.div>

      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <motion.div
          variants={cardVariants}
          className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex items-center justify-between hover:shadow-md transition-all duration-200"
        >
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Earnings</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{formatCurrency(totalEarnings)}</h3>
            <span className="text-xs font-bold text-emerald-600 mt-1 block">Sum of all successful booking payments</span>
          </div>
          <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 shrink-0">
            <DollarSign className="w-7 h-7" />
          </div>
        </motion.div>

       
        <motion.div
          variants={cardVariants}
          className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex items-center justify-between hover:shadow-md transition-all duration-200"
        >
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Properties</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{totalProperties}</h3>
            <span className="text-xs font-bold text-blue-600 mt-1 block">Properties created by owner</span>
          </div>
          <div className="p-4 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 shrink-0">
            <Building className="w-7 h-7" />
          </div>
        </motion.div>

       
        <motion.div
          variants={cardVariants}
          className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs flex items-center justify-between hover:shadow-md transition-all duration-200"
        >
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Bookings</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{totalBookings}</h3>
            <span className="text-xs font-bold text-amber-600 mt-1 block">Confirmed bookings across all properties</span>
          </div>
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100 shrink-0">
            <CalendarCheck className="w-7 h-7" />
          </div>
        </motion.div>
      </div>

      
      <motion.div
        variants={cardVariants}
        className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-600" />
              Monthly Earnings Chart (Last 12 Months)
            </h3>
            <p className="text-xs text-slate-500 font-bold mt-0.5">
              Revenue line chart generated from successful booking payments for {user?.name || 'current owner'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-blue-700 bg-blue-50 px-4 py-2 rounded-full border border-blue-200 w-fit">
            <TrendingUp className="w-4 h-4 text-blue-600" /> 12-Month Revenue History
          </div>
        </div>

        {monthlyEarnings.length === 0 ? (
          <EmptyState
            title="No monthly earnings data yet"
            description="Monthly revenue data will automatically populate as successful tenant booking payments are processed."
          />
        ) : (
          <div className="h-72 sm:h-96 w-full min-w-0 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyEarnings} margin={{ top: 15, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="#cbd5e1" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} fontWeight={600} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} fontWeight={600} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 700,
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                  }}
                  formatter={(value) => [formatCurrency(value), 'Monthly Earnings']}
                />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#2563eb"
                  strokeWidth={3.5}
                  dot={{ r: 5, fill: '#2563eb', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 8, fill: '#1d4ed8', strokeWidth: 3, stroke: '#ffffff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default OwnerHome;
