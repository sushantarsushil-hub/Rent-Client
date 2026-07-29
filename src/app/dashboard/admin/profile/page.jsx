'use client';

import RoleBasedRoute from '../../../../components/common/RoleBasedRoute';
import AdminProfile from '../../../../views/dashboard/admin/AdminProfile';

export default function AdminProfilePage() {
  return (
    <RoleBasedRoute allowedRoles={['admin']}>
      <AdminProfile />
    </RoleBasedRoute>
  );
}
