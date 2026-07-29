'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axiosInstance from '../../api/axiosInstance';
import { API_ENDPOINTS } from '../../api/endpoints';
import { useAuth } from '../../providers/AuthProvider';
import { showToast } from '../../utils/toast';

const OAuthSuccess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const processOAuth = async () => {
      const token = searchParams.get('token');
      if (!token) {
        showToast.error('OAuth authentication token missing.');
        router.push('/login');
        return;
      }

      try {
        localStorage.setItem('rentify_token', token);
        const res = await axiosInstance.get(API_ENDPOINTS.AUTH.ME, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data && res.data.data && res.data.data.user) {
          const user = res.data.data.user;
          login(user, token);
          
          const role = (user.role || '').toLowerCase();
          if (role === 'admin') router.push('/dashboard/admin');
          else if (role === 'owner' || role === 'host') router.push('/dashboard/owner');
          else router.push('/dashboard/tenant');
        } else {
          throw new Error('User profile invalid');
        }
      } catch (err) {
        showToast.error('Failed to complete Google authentication.');
        router.push('/login');
      }
    };

    processOAuth();
  }, [searchParams, router, login]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-semibold">Completing Social Authentication...</h2>
      <p className="text-slate-400 text-sm mt-2">Please wait while we log you in securely.</p>
    </div>
  );
};

export default OAuthSuccess;
