'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { CalendarCheck, Heart, DollarSign, Building2, ArrowRight } from 'lucide-react';
import StatusBadge from '../../../components/ui/StatusBadge';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorState from '../../../components/common/ErrorState';
import { useAuth } from '../../../providers/AuthProvider';
import { useTenantBookings, useTenantFavorites } from '../../../api/tenantService';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export const TenantHome = () => {
  const { user } = useAuth();
  const shouldReduceMotion = useReducedMotion();
  const { data: bookings = [], isLoading: isLoadingBookings, isError: isErrorBookings, refetch: refetchBookings } = useTenantBookings();
  const { data: favorites = [], isLoading: isLoadingFavs } = useTenantFavorites();

  const isLoading = isLoadingBookings || isLoadingFavs;

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <LoadingSpinner size="lg" text="Loading tenant dashboard summary..." />
      </div>
    );
  }

  if (isErrorBookings) {
    return (
      <ErrorState
        title="Failed to load dashboard metrics"
        description="Unable to retrieve your booking and favorite statistics."
        onRetry={refetchBookings}
      />
    );
  }

  const totalSpent = bookings.reduce((acc, b) => acc + (b.amount || b.amountPaid || 0), 0);
  const recentBookings = bookings.slice(0, 5);

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
      {/* Welcome Banner */}
      <motion.div
        variants={cardVariants}
        className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 border border-blue-800/40"
      >
        <div className="space-y-2 text-center sm:text-left">
          <span className="px-3 py-1 bg-blue-800/60 text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-700/50 inline-block">
            Tenant Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">Welcome Back, {user?.name || 'Tenant'}!</h1>
          <p className="text-xs text-slate-300 font-medium max-w-lg">
            Manage your rental reservations, view saved favorite properties, and track payment history.
          </p>
        </div>

        <div className="shrink-0">
          <Link href="/properties">
            <Button variant="primary" size="sm" icon={ArrowRight}>
              Browse Properties
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div variants={cardVariants} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Bookings</p>
            <h3 className="text-3xl font-black text-slate-900">{bookings.length}</h3>
            <p className="text-[11px] text-slate-500 font-medium">Reservations</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center border border-blue-100 shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </motion.div>

        <Link href="/dashboard/tenant/favorites">
          <motion.div variants={cardVariants} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between hover:shadow-md transition-all group cursor-pointer border-l-4 border-l-rose-500">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-rose-600 transition-colors">Saved Favorites</p>
              <h3 className="text-3xl font-black text-slate-900">{favorites.length}</h3>
              <p className="text-[11px] text-slate-500 font-medium">Click to view saved wishlist</p>
            </div>
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center border border-rose-100 shrink-0 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 fill-rose-500" />
            </div>
          </motion.div>
        </Link>

        <motion.div variants={cardVariants} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Spent</p>
            <h3 className="text-3xl font-black text-slate-900">{formatCurrency(totalSpent)}</h3>
            <p className="text-[11px] text-slate-500 font-medium">Rental transactions</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center border border-emerald-100 shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
        </motion.div>
      </motion.div>

      {/* Saved Favorites Quick Preview Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="text-lg font-bold text-slate-900">Saved Favorite Properties</h3>
          </div>
          <Link href="/dashboard/tenant/favorites" className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1">
            View All Saved Favorites ({favorites.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-2">
            <p className="text-xs text-slate-600 font-medium">You haven't saved any favorite properties yet.</p>
            <Link href="/properties">
              <span className="inline-block text-xs font-extrabold text-blue-700 hover:underline">
                Explore Property Catalog & Save Favorites →
              </span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.slice(0, 3).map((prop) => (
              <div
                key={prop.id || prop._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-rose-300 transition-colors"
              >
                <div className="relative aspect-[16/9] w-full bg-slate-100">
                  <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {prop.type || 'Property'}
                  </span>
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{prop.title}</h4>
                  <p className="text-xs text-slate-500 font-medium truncate">{prop.location}</p>
                  <p className="text-sm font-black text-rose-600 pt-1">{formatCurrency(prop.price)}</p>
                </div>
                <div className="p-3 bg-slate-50 border-t border-slate-100">
                  <Link href={`/properties/${prop.id || prop._id}`}>
                    <Button variant="outline" size="sm" fullWidth className="text-xs font-bold">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Bookings Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Recent Booking Reservations</h3>
          <Link href="/dashboard/tenant/bookings" className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1">
            View All Bookings <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider">
                <tr>
                  <th className="p-4">Property</th>
                  <th className="p-4">Booking Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Booking Status</th>
                  <th className="p-4 text-right">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-blue-700 shrink-0" />
                      <span>{b.propertyName}</span>
                    </td>
                    <td className="p-4 text-slate-600">{formatDate(b.bookingDate)}</td>
                    <td className="p-4 font-extrabold text-slate-900">{formatCurrency(b.amount || b.amountPaid)}</td>
                    <td className="p-4">
                      <StatusBadge status={b.bookingStatus} />
                    </td>
                    <td className="p-4 text-right">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-bold border border-emerald-200">
                        {b.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {recentBookings.map((b) => (
            <div key={b.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-700" /> {b.propertyName}
                </span>
                <StatusBadge status={b.bookingStatus} />
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500 font-medium">{formatDate(b.bookingDate)}</span>
                <span className="font-extrabold text-slate-900">{formatCurrency(b.amount || b.amountPaid)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TenantHome;
