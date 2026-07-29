'use client';

import RoleBasedRoute from '../../../../components/common/RoleBasedRoute';
import AddProperty from '../../../../views/dashboard/owner/AddProperty';

export default function AddPropertyPage() {
  return (
    <RoleBasedRoute allowedRoles={['owner', 'host', 'admin']}>
      <AddProperty />
    </RoleBasedRoute>
  );
}
