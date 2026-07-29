'use client';

import RoleBasedRoute from '../../../../components/common/RoleBasedRoute';
import AdminUsers from '../../../../views/dashboard/admin/AdminUsers';

export default function AdminUsersPage() {
  return (
    <RoleBasedRoute allowedRoles={['admin']}>
      <AdminUsers />
    </RoleBasedRoute>
  );
}
