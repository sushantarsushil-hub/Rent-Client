'use client';

import React, { Suspense } from 'react';
import Login from '../../views/auth/Login';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading login form..." />}>
      <Login />
    </Suspense>
  );
}
