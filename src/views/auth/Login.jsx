'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import GoogleSocialButton from '../../components/auth/GoogleSocialButton';
import Button from '../../components/ui/Button';
import { useAuth, getDashboardPath } from '../../providers/AuthProvider';
import { useAppRouter } from '../../hooks/useAppRouter';
import { showToast } from '../../utils/toast';
import axiosInstance from '../../api/axiosInstance';
import { API_ENDPOINTS } from '../../api/endpoints';

export const Login = () => {
  const { isAuthenticated, loading, user, login } = useAuth();
  const router = useAppRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const redirectPath = searchParams.get('redirect') || getDashboardPath(user?.role);
      router.replace(redirectPath);
    }
  }, [isAuthenticated, loading, user, router, searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
        email: data.email,
        password: data.password,
      });

      const { user: loggedInUser, token } = response.data?.data || response.data || {};
      if (loggedInUser && token) {
        login(loggedInUser, token);
        const redirectPath = searchParams.get('redirect') || getDashboardPath(loggedInUser.role);
        router.push(redirectPath);
      } else {
        throw new Error('Invalid login response from authentication service.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password credentials. Please try again.';
      showToast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    showToast.info('Password reset feature placeholder: Please contact support@rentify.com for account recovery.');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="max-w-md w-full bg-white p-5 sm:p-8 lg:p-10 rounded-3xl border border-slate-200 shadow-md space-y-6"
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Return Home
          </Link>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
            Account Sign In
          </span>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Welcome Back</h2>
          <p className="text-xs text-slate-500 font-medium">
            Sign in to manage your bookings, favorite listings, and property portal.
          </p>
        </div>

        
        <GoogleSocialButton text="Continue with Google Account" />

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider relative">
            Or Sign In With Email
          </span>
        </div>

        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                disabled={isLoading}
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address format',
                  },
                })}
                placeholder="name@example.com"
                className={`w-full bg-slate-50 border ${
                  errors.email ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-blue-700'
                } rounded-xl pl-10 pr-3 py-2.5 text-xs font-medium text-slate-800 focus:outline-none disabled:opacity-50`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.email.message}</p>
            )}
          </div>

          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">Password</label>
              <a
                href="#"
                onClick={handleForgotPassword}
                className="text-[11px] font-bold text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                disabled={isLoading}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                placeholder="••••••••"
                className={`w-full bg-slate-50 border ${
                  errors.password ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-blue-700'
                } rounded-xl pl-10 pr-10 py-2.5 text-xs font-medium text-slate-800 focus:outline-none disabled:opacity-50`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" variant="primary" fullWidth isLoading={isLoading} icon={LogIn} size="md" className="shadow-md shadow-blue-500/20">
            Sign In to Rentify
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-600 font-medium">
            Don't have an account yet?{' '}
            <Link href="/register" className="font-extrabold text-blue-700 hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
