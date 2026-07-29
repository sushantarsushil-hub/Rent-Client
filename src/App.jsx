import React from 'react';
import { RouterProvider } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import { QueryProvider } from './providers/QueryProvider';
import { AuthProvider } from './providers/AuthProvider';
import { router } from './routes/router';

function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;
