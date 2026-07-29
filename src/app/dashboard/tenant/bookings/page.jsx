'use client';

import RoleBasedRoute from '../../../../components/common/RoleBasedRoute';
import TenantBookings from '../../../../views/dashboard/tenant/TenantBookings';

export default function TenantBookingsPage() {
  return (
    <RoleBasedRoute allowedRoles={['tenant']}>
      <TenantBookings />
    </RoleBasedRoute>
  );
}
