'use client';

import RoleBasedRoute from '../../../../components/common/RoleBasedRoute';
import AdminTransactions from '../../../../views/dashboard/admin/AdminTransactions';

export default function AdminTransactionsPage() {
  return (
    <RoleBasedRoute allowedRoles={['admin']}>
      <AdminTransactions />
    </RoleBasedRoute>
  );
}
