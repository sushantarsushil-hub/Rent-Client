'use client';

import RoleBasedRoute from '../../../../components/common/RoleBasedRoute';
import AdminProperties from '../../../../views/dashboard/admin/AdminProperties';

export default function AdminPropertiesPage() {
  return (
    <RoleBasedRoute allowedRoles={['admin']}>
      <AdminProperties />
    </RoleBasedRoute>
  );
}
