'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../providers/AuthProvider';

export function Providers({ children }) {
  
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, 
            gcTime: 10 * 60 * 1000, 
            retry: 1, 
            refetchOnWindowFocus: false, 
            refetchOnReconnect: 'always', 
          },
          mutations: {
            retry: 0, 
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0f172a',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '600',
              borderRadius: '16px',
              padding: '12px 18px',
              boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default Providers;
