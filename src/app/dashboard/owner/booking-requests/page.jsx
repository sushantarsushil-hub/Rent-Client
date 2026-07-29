'use client';

import RoleBasedRoute from '../../../../components/common/RoleBasedRoute';
import BookingRequests from '../../../../views/dashboard/owner/BookingRequests';

export default function BookingRequestsPage() {
  return (
    <RoleBasedRoute allowedRoles={['owner', 'host', 'admin']}>
      <BookingRequests />
    </RoleBasedRoute>
  );
}
