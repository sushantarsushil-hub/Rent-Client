'use client';

import RoleBasedRoute from '../../../../components/common/RoleBasedRoute';
import TenantProfile from '../../../../views/dashboard/tenant/TenantProfile';

export default function TenantProfilePage() {
  return (
    <RoleBasedRoute allowedRoles={['tenant']}>
      <TenantProfile />
    </RoleBasedRoute>
  );
}
