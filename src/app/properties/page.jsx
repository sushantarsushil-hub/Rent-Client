'use client';

import React, { Suspense } from 'react';
import Properties from '../../views/public/Properties';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function PropertiesPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading catalog properties..." />}>
      <Properties />
    </Suspense>
  );
}
