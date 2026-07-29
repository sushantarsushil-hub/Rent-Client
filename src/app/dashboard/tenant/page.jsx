'use client';

import RoleBasedRoute from '../../../components/common/RoleBasedRoute';
import TenantHome from '../../../views/dashboard/tenant/TenantHome';

export default function TenantDashboardPage() {
  return (
    <RoleBasedRoute allowedRoles={['tenant']}>
      <TenantHome />
    </RoleBasedRoute>
  );
}
