'use client';

import React, { useState } from 'react';
import { Search, CreditCard, Calendar, User, Building, ShieldCheck, UserCircle } from 'lucide-react';
import SectionTitle from '../../../components/common/SectionTitle';
import { Table, TableRow, TableCell } from '../../../components/ui/Table';
import Pagination from '../../../components/ui/Pagination';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorState from '../../../components/common/ErrorState';
import EmptyState from '../../../components/common/EmptyState';
import { useAdminTransactions } from '../../../api/adminService';
import { formatCurrency, formatDate } from '../../../utils/formatters';

export const AdminTransactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data: rawTransactions = [], isLoading, isError, refetch } = useAdminTransactions();

  
  const transactions = rawTransactions.map((tx) => {
    const rawStatus = tx.paymentStatus || tx.status || 'succeeded';
    const paymentStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
    
    
    const cleanId = tx.id && tx.id.startsWith('pi_')
      ? `TXN-${tx.id.slice(-8).toUpperCase()}`
      : tx.id || 'TXN-88401';

    return {
      ...tx,
      displayId: cleanId,
      paymentStatus,
    };
  });

  if (isLoading) {
    return (
      <div className="py-16 text-center">
        <LoadingSpinner size="lg" text="Loading financial transaction logs..." />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load transactions"
        description="Could not retrieve financial transaction history."
        onRetry={refetch}
      />
    );
  }

  
  const filteredTransactions = transactions.filter((t) => {
    const q = searchTerm.toLowerCase();
    return (
      (t.displayId || '').toLowerCase().includes(q) ||
      (t.id || '').toLowerCase().includes(q) ||
      (t.propertyName || '').toLowerCase().includes(q) ||
      (t.tenantName || '').toLowerCase().includes(q) ||
      (t.ownerName || '').toLowerCase().includes(q) ||
      (t.paymentStatus || '').toLowerCase().includes(q)
    );
  });

 
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  
  const PaymentStatusBadge = ({ status }) => {
    const normalized = (status || '').toLowerCase();
    const isSuccess = normalized === 'succeeded' || normalized === 'completed' || normalized === 'paid';
    const isFailed = normalized === 'failed' || normalized === 'cancelled' || normalized === 'declined';

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${
          isSuccess
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : isFailed
            ? 'bg-rose-50 text-rose-700 border-rose-200'
            : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        {status}
      </span>
    );
  };

  const tableHeaders = [
    'Transaction ID',
    'Property Name',
    'Tenant Name',
    'Owner Name',
    'Amount',
    'Payment Status',
    'Date',
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SectionTitle
          badge="Financial Ledger"
          title="Financial Transactions Log"
          subtitle="Audit verified payment transactions, platform revenue, and stay payouts."
        />

        
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by ID, property, tenant, owner..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-9 pr-4 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-2xs"
          />
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <EmptyState
          title="No matching transactions found"
          description={
            searchTerm
              ? 'Try refining your search terms.'
              : 'There are currently no recorded financial transactions.'
          }
        />
      ) : (
        <>
          
          <div className="hidden lg:block">
            <Table headers={tableHeaders}>
              {paginatedTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  
                  <TableCell className="font-mono text-xs font-extrabold text-blue-700">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      {tx.displayId}
                    </span>
                  </TableCell>

                  
                  <TableCell>
                    <p className="font-bold text-slate-900 text-xs flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="line-clamp-1">{tx.propertyName}</span>
                    </p>
                  </TableCell>

                  
                  <TableCell className="text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      {tx.tenantName}
                    </span>
                  </TableCell>

                  
                  <TableCell className="text-xs font-bold text-slate-600">
                    <span className="flex items-center gap-1">
                      <UserCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {tx.ownerName}
                    </span>
                  </TableCell>

                  {/* 5. Amount */}
                  <TableCell className="font-extrabold text-sm text-emerald-700">
                    {formatCurrency(tx.amount)}
                  </TableCell>

                  {/* 6. Payment Status */}
                  <TableCell>
                    <PaymentStatusBadge status={tx.paymentStatus} />
                  </TableCell>

                  {/* 7. Date */}
                  <TableCell className="text-xs text-slate-600 font-bold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(tx.date)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </div>

          {/* Mobile Cards View */}
          <div className="lg:hidden space-y-4">
            {paginatedTransactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="font-mono text-xs font-extrabold text-blue-700">{tx.displayId}</span>
                  <PaymentStatusBadge status={tx.paymentStatus} />
                </div>

                <div className="space-y-1 text-xs">
                  <p className="font-extrabold text-slate-900 text-sm">{tx.propertyName}</p>
                  <p className="text-slate-600 font-bold">Tenant: {tx.tenantName}</p>
                  <p className="text-slate-600 font-bold">Owner: {tx.ownerName}</p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {formatDate(tx.date)}
                  </span>
                  <span className="font-extrabold text-emerald-700 text-base">
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredTransactions.length}
            limit={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default AdminTransactions;
