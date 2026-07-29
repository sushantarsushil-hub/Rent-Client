'use client';

import RoleBasedRoute from '../../../../components/common/RoleBasedRoute';
import MyProperties from '../../../../views/dashboard/owner/MyProperties';

export default function MyPropertiesPage() {
  return (
    <RoleBasedRoute allowedRoles={['owner', 'host', 'admin']}>
      <MyProperties />
    </RoleBasedRoute>
  );
}
