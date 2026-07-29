'use client';

import RoleBasedRoute from '../../../../components/common/RoleBasedRoute';
import TenantFavorites from '../../../../views/dashboard/tenant/TenantFavorites';

export default function TenantFavoritesPage() {
  return (
    <RoleBasedRoute allowedRoles={['tenant']}>
      <TenantFavorites />
    </RoleBasedRoute>
  );
}
