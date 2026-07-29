'use client';

import React, { useState } from 'react';
import { Search, User, Mail, Building, CreditCard, Calendar, UserCircle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import SectionTitle from '../../../components/common/SectionTitle';
import StatusBadge from '../../../components/ui/StatusBadge';
import { Table, TableRow, TableCell } from '../../../components/ui/Table';
import Pagination from '../../../components/ui/Pagination';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorState from '../../../components/common/ErrorState';
import EmptyState from '../../../components/common/EmptyState';
import { useAdminBookings, updateAdminBookingStatus } from '../../../api/adminService';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { showToast } from '../../../utils/toast';

export const AdminBookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  const itemsPerPage = 8;

  const { data: bookings = [], isLoading, isError, refetch } = useAdminBookings();

  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      await updateAdminBookingStatus(bookingId, newStatus);
      showToast.success(`Booking status changed to '${newStatus}' successfully!`);
      refetch();
    } catch (err) {
      showToast.error(err?.response?.data?.message || `Failed to set status to ${newStatus}.`);
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <LoadingSpinner size="lg" text="Loading all platform bookings..." />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load bookings"
        description="Could not retrieve platform bookings from the server."
        onRetry={refetch}
      />
    );
  }

  
  const filteredBookings = bookings.filter((b) => {
    const q = searchTerm.toLowerCase();
    return (
      (b.tenantName || '').toLowerCase().includes(q) ||
      (b.propertyTitle || '').toLowerCase().includes(q) ||
      (b.ownerName || '').toLowerCase().includes(q) ||
      (b.bookingStatus || '').toLowerCase().includes(q) ||
      (b.paymentStatus || '').toLowerCase().includes(q) ||
      (b.id || '').toLowerCase().includes(q)
    );
  });

  
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  
  const PaymentBadge = ({ status }) => {
    const normalized = (status || '').toLowerCase();
    const isPaid = normalized === 'paid' || normalized === 'completed' || normalized === 'succeeded';
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${
          isPaid
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : normalized === 'failed' || normalized === 'cancelled'
            ? 'bg-rose-50 text-rose-700 border-rose-200'
            : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}
      >
        <CreditCard className="w-3 h-3" />
        {status}
      </span>
    );
  };

  
  const getTenantEmail = (b) =>
    b.tenantEmail || b.userInfo?.email || b.tenantId?.email || '';

  const tableHeaders = [
    'Tenant',
    'Tenant Email',
    'Property',
    'Owner',
    'Amount',
    'Booking Date',
    'Booking Status',
    'Payment Status',
    'Admin Actions',
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionTitle
          badge="Platform Management"
          title="All Platform Bookings"
          subtitle="Monitor tenant reservations and modify booking status (Approve, Reject, Pending) across all properties."
        />

        
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by tenant, property, status..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-9 pr-4 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-2xs"
          />
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <EmptyState
          title="No bookings found"
          description={
            searchTerm
              ? 'No bookings match your search criteria. Try adjusting your query.'
              : 'There are currently no recorded bookings on the platform.'
          }
        />
      ) : (
        <>
         
          <div className="hidden lg:block">
            <Table headers={tableHeaders}>
              {paginatedBookings.map((b) => {
                const isItemUpdating = updatingId === (b.id || b._id);
                const currentStatus = (b.bookingStatus || '').toLowerCase();

                return (
                  <TableRow key={b.id || b._id}>
                    
                    <TableCell>
                      <p className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        {b.tenantName}
                      </p>
                    </TableCell>

                    
                    <TableCell className="text-xs font-bold text-slate-600">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="line-clamp-1">{getTenantEmail(b) || '—'}</span>
                      </span>
                    </TableCell>

                    
                    <TableCell>
                      <p className="font-bold text-slate-900 text-xs flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="line-clamp-1">{b.propertyTitle}</span>
                      </p>
                    </TableCell>

                    
                    <TableCell className="text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1">
                        <UserCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {b.ownerName}
                      </span>
                    </TableCell>

                    
                    <TableCell className="font-extrabold text-sm text-slate-900">
                      {formatCurrency(b.amount)}
                    </TableCell>

                    
                    <TableCell className="text-xs text-slate-600 font-bold">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(b.bookingDate)}
                      </span>
                    </TableCell>

                    
                    <TableCell>
                      <StatusBadge status={b.bookingStatus} />
                    </TableCell>

                    
                    <TableCell>
                      <PaymentBadge status={b.paymentStatus} />
                    </TableCell>

                    
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(b.id || b._id, 'Approved')}
                          disabled={isItemUpdating || currentStatus === 'approved'}
                          className={`p-1.5 rounded-xl border text-[11px] font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                            currentStatus === 'approved'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 opacity-60 cursor-not-allowed'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white'
                          }`}
                          title="Approve Booking"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(b.id || b._id, 'Rejected')}
                          disabled={isItemUpdating || currentStatus === 'rejected'}
                          className={`p-1.5 rounded-xl border text-[11px] font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                            currentStatus === 'rejected'
                              ? 'bg-rose-100 text-rose-800 border-rose-300 opacity-60 cursor-not-allowed'
                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-600 hover:text-white'
                          }`}
                          title="Reject Booking"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(b.id || b._id, 'Pending')}
                          disabled={isItemUpdating || currentStatus === 'pending'}
                          className={`p-1.5 rounded-xl border text-[11px] font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                            currentStatus === 'pending'
                              ? 'bg-amber-100 text-amber-800 border-amber-300 opacity-60 cursor-not-allowed'
                              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-500 hover:text-white'
                          }`}
                          title="Set Status to Pending"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          Pending
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </Table>
          </div>

          
          <div className="lg:hidden space-y-4">
            {paginatedBookings.map((b) => {
              const isItemUpdating = updatingId === (b.id || b._id);
              const currentStatus = (b.bookingStatus || '').toLowerCase();

              return (
                <div
                  key={b.id || b._id}
                  className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3"
                >
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{b.tenantName}</h4>
                      <p className="text-xs text-slate-500 font-bold flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" /> {getTenantEmail(b) || '—'}
                      </p>
                    </div>
                    <StatusBadge status={b.bookingStatus} />
                  </div>

                  {/* Property + Owner */}
                  <div className="border-t border-slate-100 pt-3 space-y-1">
                    <p className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" /> {b.propertyTitle}
                    </p>
                    <p className="text-xs text-slate-500 font-bold flex items-center gap-1">
                      <UserCircle className="w-3 h-3 text-slate-400" /> Owner: {b.ownerName}
                    </p>
                  </div>

                  {/* Amount, Date, Payment */}
                  <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold block">Amount</span>
                      <span className="font-extrabold text-slate-900">{formatCurrency(b.amount)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block">Date</span>
                      <span className="font-bold text-slate-800">{formatDate(b.bookingDate)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block">Payment</span>
                      <PaymentBadge status={b.paymentStatus} />
                    </div>
                  </div>

                  {/* Mobile Admin Status Action Buttons */}
                  <div className="border-t border-slate-100 pt-3 flex items-center gap-2">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mr-auto">
                      Change Status:
                    </span>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(b.id || b._id, 'Approved')}
                      disabled={isItemUpdating || currentStatus === 'approved'}
                      className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200 hover:bg-emerald-600 hover:text-white"
                    >
                      Approve
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(b.id || b._id, 'Rejected')}
                      disabled={isItemUpdating || currentStatus === 'rejected'}
                      className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 font-extrabold text-xs border border-rose-200 hover:bg-rose-600 hover:text-white"
                    >
                      Reject
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusChange(b.id || b._id, 'Pending')}
                      disabled={isItemUpdating || currentStatus === 'pending'}
                      className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-700 font-extrabold text-xs border border-amber-200 hover:bg-amber-500 hover:text-white"
                    >
                      Pending
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredBookings.length}
            limit={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default AdminBookings;

