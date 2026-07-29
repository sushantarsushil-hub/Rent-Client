'use client';

import RoleBasedRoute from '../../../components/common/RoleBasedRoute';
import AdminHome from '../../../views/dashboard/admin/AdminHome';

export default function AdminDashboardPage() {
  return (
    <RoleBasedRoute allowedRoles={['admin']}>
      <AdminHome />
    </RoleBasedRoute>
  );
}
