import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DollarSign, Users, Building, CalendarCheck, ShieldCheck, Sparkles } from 'lucide-react';
import SectionTitle from '../../../components/common/SectionTitle';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorState from '../../../components/common/ErrorState';
import { useAuth } from '../../../providers/AuthProvider';
import { useAdminMetrics } from '../../../api/adminService';
import { formatCurrency } from '../../../utils/formatters';

export const AdminHome = () => {
  const { user } = useAuth();
  const shouldReduceMotion = useReducedMotion();
  const { data: metrics, isLoading, isError, refetch } = useAdminMetrics();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading platform administration overview..." />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load admin overview"
        description="Could not connect to administrator backend services."
        onRetry={refetch}
      />
    );
  }

  const { totalRevenue, totalUsers, totalProperties, totalBookings, activeStays } = metrics || {};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      
      <motion.div
        variants={cardVariants}
        className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-blue-800/50 shadow-md space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-900/60 text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-700/50">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Platform Administrator Console</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
          System Overview, {user?.name || 'Administrator'}!
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-2xl">
          Monitor platform metrics, moderate new property submissions, manage user roles, and review total booking volume.
        </p>
      </motion.div>

      
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <motion.div variants={cardVariants} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Platform Revenue</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totalRevenue)}</h3>
            <span className="text-xs font-semibold text-emerald-600 mt-1 block">Gross Volume</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
            <DollarSign className="w-6 h-6" />
          </div>
        </motion.div>

       
        <motion.div variants={cardVariants} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Registered Users</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalUsers} Accounts</h3>
            <span className="text-xs font-semibold text-blue-700 mt-1 block">Tenants, Owners & Admins</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
            <Users className="w-6 h-6" />
          </div>
        </motion.div>

       
        <motion.div variants={cardVariants} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Properties Listed</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalProperties} Properties</h3>
            <span className="text-xs font-semibold text-amber-600 mt-1 block">Approved & Pending</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl border border-amber-100">
            <Building className="w-6 h-6" />
          </div>
        </motion.div>

        
        <motion.div variants={cardVariants} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Reservations</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalBookings} Bookings</h3>
            <span className="text-xs font-semibold text-indigo-600 mt-1 block">{activeStays} Active Stays</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </motion.div>
      </motion.div>

      
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <SectionTitle
            badge="Console"
            title="Administrator Quick Actions"
            subtitle="Access moderation features and platform controls."
          />
          <ShieldCheck className="w-6 h-6 text-blue-700" />
        </div>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          Use the left sidebar navigation to review new property submissions (`My Properties Moderation`), update user account roles (`Tenant`, `Owner`, `Admin`), view all bookings across the platform, and monitor financial transactions.
        </p>
      </div>
    </motion.div>
  );
};

export default AdminHome;
