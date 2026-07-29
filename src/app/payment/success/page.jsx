'use client';

import React, { Suspense } from 'react';
import PaymentSuccess from '../../../views/public/PaymentSuccess';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Verifying payment..." />}>
      <PaymentSuccess />
    </Suspense>
  );
}
