'use client';

import RoleBasedRoute from '../../../../components/common/RoleBasedRoute';
import AdminBookings from '../../../../views/dashboard/admin/AdminBookings';

export default function AdminBookingsPage() {
  return (
    <RoleBasedRoute allowedRoles={['admin']}>
      <AdminBookings />
    </RoleBasedRoute>
  );
}
