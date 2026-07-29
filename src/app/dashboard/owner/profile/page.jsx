'use client';

import RoleBasedRoute from '../../../../components/common/RoleBasedRoute';
import OwnerProfile from '../../../../views/dashboard/owner/OwnerProfile';

export default function OwnerProfilePage() {
  return (
    <RoleBasedRoute allowedRoles={['owner', 'host', 'admin']}>
      <OwnerProfile />
    </RoleBasedRoute>
  );
}
