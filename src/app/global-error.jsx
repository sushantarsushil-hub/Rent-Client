'use client';

import React from 'react';
import GenericError from '../views/public/GenericError';

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen flex items-center justify-center">
        <GenericError error={error} resetErrorBoundary={reset} />
      </body>
    </html>
  );
}
