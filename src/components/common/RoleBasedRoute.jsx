'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../providers/AuthProvider';
import PageLoader from './PageLoader';
import Forbidden from '../../views/public/Forbidden';

export const RoleBasedRoute = ({ allowedRoles = [], children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || '/';

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname || '/')}`);
    }
  }, [loading, isAuthenticated, router, pathname]);

  if (loading) {
    return <PageLoader text="Verifying authentication and role permissions..." />;
  }

  if (!isAuthenticated) {
    return <PageLoader text="Redirecting to login portal..." />;
  }

  const userRole = (user?.role || '').toLowerCase();
  const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

  
  const isAuthorized =
    allowedRoles.length === 0 ||
    normalizedAllowed.includes(userRole) ||
    userRole === 'admin';

  if (!isAuthorized) {
    return <Forbidden />;
  }

  return children;
};

export default RoleBasedRoute;
