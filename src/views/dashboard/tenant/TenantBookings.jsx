'use client';

import React, { useState } from 'react';
import SectionTitle from '../../../components/common/SectionTitle';
import StatusBadge from '../../../components/ui/StatusBadge';
import { Table, TableRow, TableCell } from '../../../components/ui/Table';
import Pagination from '../../../components/ui/Pagination';
import EmptyState from '../../../components/common/EmptyState';
import ErrorState from '../../../components/common/ErrorState';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { useTenantBookings } from '../../../api/tenantService';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { Calendar, MapPin, CreditCard } from 'lucide-react';

export const TenantBookings = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: bookings = [], isLoading, isError, refetch } = useTenantBookings();

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <LoadingSpinner size="lg" text="Fetching your stay reservations..." />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load bookings"
        description="Could not retrieve your stay reservations from the server."
        onRetry={refetch}
      />
    );
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        title="No bookings found"
        description="You have not reserved any property stays yet. Explore listings to book your next trip!"
      />
    );
  }

  const totalPages = Math.ceil(bookings.length / itemsPerPage) || 1;
  const paginatedBookings = bookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const tableHeaders = ['Property Name', 'Booking Date', 'Amount Paid', 'Booking Status', 'Payment Status'];

  return (
    <div className="space-y-8">
      <SectionTitle
        badge="My Stays"
        title="My Bookings"
        subtitle="Manage and view your stay reservations, payment statuses, and transaction amounts."
      />

      {/* Desktop Responsive Table View */}
      <div className="hidden md:block">
        <Table headers={tableHeaders}>
          {paginatedBookings.map((b) => (
            <TableRow key={b.id || b._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={b.image || 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=200&q=80'}
                    alt={b.propertyName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{b.propertyName}</p>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-600" /> {b.location}
                    </span>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="text-xs text-slate-700 font-bold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {formatDate(b.bookingDate)}
                </div>
              </TableCell>

              <TableCell className="font-black text-sm text-slate-900">
                {formatCurrency(b.amountPaid || b.amount || 0)}
              </TableCell>

              <TableCell>
                <StatusBadge status={b.bookingStatus || 'Confirmed'} />
              </TableCell>

              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                    (b.paymentStatus || '').toLowerCase() === 'paid'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  <CreditCard className="w-3 h-3 mr-1" />
                  {b.paymentStatus || 'Paid'}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </div>

      {/* Mobile Responsive Cards View */}
      <div className="md:hidden space-y-4">
        {paginatedBookings.map((b) => (
          <div key={b.id || b._id} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={b.image || 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=200&q=80'}
                alt={b.propertyName}
                className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{b.propertyName}</h4>
                <p className="text-xs text-slate-500 font-medium">{b.location}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3">
              <div>
                <span className="text-slate-400 font-bold block">Booking Date</span>
                <span className="font-bold text-slate-800">{formatDate(b.bookingDate)}</span>
              </div>

              <div>
                <span className="text-slate-400 font-bold block">Amount Paid</span>
                <span className="font-black text-slate-900">{formatCurrency(b.amountPaid || b.amount || 0)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <StatusBadge status={b.bookingStatus || 'Confirmed'} />
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  (b.paymentStatus || '').toLowerCase() === 'paid'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {b.paymentStatus || 'Paid'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={bookings.length}
        limit={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default TenantBookings;
