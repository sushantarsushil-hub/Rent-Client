'use client';

import React, { useState } from 'react';
import SectionTitle from '../../../components/common/SectionTitle';
import StatusBadge from '../../../components/ui/StatusBadge';
import { Table, TableRow, TableCell } from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorState from '../../../components/common/ErrorState';
import EmptyState from '../../../components/common/EmptyState';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import { useOwnerBookingRequests, respondBookingRequest } from '../../../api/ownerService';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { showToast } from '../../../utils/toast';
import { Check, X, Calendar, Phone, Mail, User, Building } from 'lucide-react';

export const BookingRequests = () => {
  const { data: requests = [], isLoading, isError, refetch } = useOwnerBookingRequests();
  const [processingId, setProcessingId] = useState(null);
  const [pendingAction, setPendingAction] = useState(null); // { request, action: 'Approved' | 'Rejected' }

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <LoadingSpinner size="lg" text="Loading booking requests for your properties..." />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load booking requests"
        description="Could not fetch tenant booking applications from the server."
        onRetry={refetch}
      />
    );
  }

  const handleConfirmAction = async () => {
    if (!pendingAction) return;

    const { request, action } = pendingAction;
    setProcessingId(request.id);

    try {
      await respondBookingRequest(request.id, action);
      refetch();

      if (action === 'Approved') {
        showToast.success(`Booking request for "${request.propertyTitle}" has been APPROVED!`);
      } else {
        showToast.info(`Booking request for "${request.propertyTitle}" has been REJECTED.`);
      }
      setPendingAction(null);
    } catch (err) {
      showToast.error('Failed to update booking status. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  if (requests.length === 0) {
    return (
      <EmptyState
        title="No booking requests found"
        description="There are currently no tenant booking requests for your listed properties."
      />
    );
  }

  const tableHeaders = [
    'Tenant Information',
    'Property Information',
    'Booking Date',
    'Booking Amount',
    'Status',
    'Actions',
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <SectionTitle
        badge="Inquiries & Applications"
        title="Booking Requests"
        subtitle="Review booking applications from tenants for your properties. Approve or reject incoming reservation requests."
      />

      {/* Table Format (Desktop) */}
      <div className="hidden md:block">
        <Table headers={tableHeaders}>
          {requests.map((req) => (
            <TableRow key={req.id}>
              {/* 1. Tenant Information */}
              <TableCell>
                <div className="space-y-0.5">
                  <p className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600 shrink-0" /> {req.tenantName}
                  </p>
                  <p className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-slate-400 shrink-0" /> {req.tenantEmail}
                  </p>
                  <p className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" /> {req.tenantPhone}
                  </p>
                </div>
              </TableCell>

              {/* 2. Property Information */}
              <TableCell>
                <div className="space-y-0.5">
                  <p className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" /> {req.propertyTitle}
                  </p>
                  <span className="text-[10px] font-mono font-bold text-slate-400 block">ID: {req.id}</span>
                </div>
              </TableCell>

              {/* 3. Move-in / Booking Date */}
              <TableCell className="text-xs text-slate-700 font-bold">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {formatDate(req.moveInDate)}
                </span>
              </TableCell>

              {/* 4. Booking Amount */}
              <TableCell className="font-black text-sm text-slate-900">
                {formatCurrency(req.amount)}
              </TableCell>

              {/* 5. Booking Status */}
              <TableCell>
                <StatusBadge status={req.status} />
              </TableCell>

              {/* 6. Actions (Approve / Reject) */}
              <TableCell align="right">
                {(req.status || '').toLowerCase() === 'pending' ? (
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Check}
                      isLoading={processingId === req.id}
                      disabled={processingId === req.id}
                      onClick={() => setPendingAction({ request: req, action: 'Approved' })}
                      className="font-extrabold shadow-xs"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={X}
                      isLoading={processingId === req.id}
                      disabled={processingId === req.id}
                      onClick={() => setPendingAction({ request: req, action: 'Rejected' })}
                      className="text-rose-600 border-rose-200 hover:bg-rose-50 font-bold"
                    >
                      Reject
                    </Button>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 font-bold italic">
                    {(req.status || '').toLowerCase() === 'approved' ? 'Approved' : 'Rejected'}
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </div>

      {/* Cards Format (Mobile) */}
      <div className="md:hidden space-y-4">
        {requests.map((req) => (
          <div key={req.id} className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" /> {req.tenantName}
                </h4>
                <p className="text-xs text-slate-500 font-bold">{req.tenantEmail}</p>
                <p className="text-xs text-slate-500 font-bold">{req.tenantPhone}</p>
              </div>
              <StatusBadge status={req.status} />
            </div>

            <div className="space-y-1 text-xs font-bold">
              <p className="text-slate-900 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" /> Property: {req.propertyTitle}
              </p>
              <p className="text-slate-600 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Move-in: {formatDate(req.moveInDate)}
              </p>
              <p className="text-slate-900 font-black text-sm pt-1">
                Amount: {formatCurrency(req.amount)}
              </p>
            </div>

            {(req.status || '').toLowerCase() === 'pending' && (
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  icon={Check}
                  isLoading={processingId === req.id}
                  disabled={processingId === req.id}
                  onClick={() => setPendingAction({ request: req, action: 'Approved' })}
                  className="font-extrabold"
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  icon={X}
                  isLoading={processingId === req.id}
                  disabled={processingId === req.id}
                  onClick={() => setPendingAction({ request: req, action: 'Rejected' })}
                  className="text-rose-600 border-rose-200 font-bold"
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Confirmation Modal for Approval or Rejection */}
      <ConfirmDialog
        isOpen={!!pendingAction}
        title={pendingAction?.action === 'Approved' ? 'Approve Booking Request?' : 'Reject Booking Request?'}
        message={`Are you sure you want to ${pendingAction?.action === 'Approved' ? 'approve' : 'reject'} the booking request from ${pendingAction?.request?.tenantName} for "${pendingAction?.request?.propertyTitle}"?`}
        confirmText={pendingAction?.action === 'Approved' ? 'Approve Booking' : 'Reject Booking'}
        isDanger={pendingAction?.action === 'Rejected'}
        isLoading={!!processingId}
        onConfirm={handleConfirmAction}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
};

export default BookingRequests;
