'use client';

import RoleBasedRoute from '../../../components/common/RoleBasedRoute';
import OwnerHome from '../../../views/dashboard/owner/OwnerHome';

export default function OwnerDashboardPage() {
  return (
    <RoleBasedRoute allowedRoles={['owner', 'host', 'admin']}>
      <OwnerHome />
    </RoleBasedRoute>
  );
}
