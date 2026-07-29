'use client';

import React, { Suspense } from 'react';
import OAuthSuccess from '../../views/auth/OAuthSuccess';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function OAuthSuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Processing OAuth login..." />}>
      <OAuthSuccess />
    </Suspense>
  );
}
