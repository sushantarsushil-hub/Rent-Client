'use client';

import React, { useEffect } from 'react';
import GenericError from '../views/public/GenericError';
import { showToast } from '../utils/toast';

export default function AppError({ error, reset }) {
  useEffect(() => {
    console.error('Unhandled App Router Error:', error);
    showToast.error(error?.message || 'An unexpected application error occurred.');
  }, [error]);

  return <GenericError error={error} resetErrorBoundary={reset} />;
}
