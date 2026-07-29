'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, User, Image, UserPlus, ArrowLeft, ShieldCheck } from 'lucide-react';
import GoogleSocialButton from '../../components/auth/GoogleSocialButton';
import Button from '../../components/ui/Button';
import { useAuth, getDashboardPath } from '../../providers/AuthProvider';
import { showToast } from '../../utils/toast';
import axiosInstance from '../../api/axiosInstance';
import { API_ENDPOINTS } from '../../api/endpoints';

export const Register = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: 'tenant',
      photoURL: '',
    },
  });

  const passwordValue = watch('password', '');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, {
        name: data.name,
        email: data.email,
        password: data.password,
        photo: data.photoURL || '',
        role: data.role || 'tenant',
      });

      const { user, token } = response.data?.data || response.data || {};
      if (user && token) {
        login(user, token);
        showToast.success(`Registration successful! Welcome to Rentify, ${user.name}!`);
        router.push(getDashboardPath(user.role));
      } else {
        throw new Error('Registration response incomplete.');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Registration failed. Email may already be registered or network error.';
      showToast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white p-5 sm:p-8 lg:p-10 rounded-3xl border border-slate-200 shadow-md space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Return Home
          </Link>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
            New Account Registration
          </span>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Create Account</h2>
          <p className="text-xs text-slate-500 font-medium">
            Join Rentify as a tenant to book properties or as an owner to manage listings.
          </p>
        </div>

        
        <GoogleSocialButton text="Register with Google Account" />

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider relative">
            Or Register with Email
          </span>
        </div>

        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                disabled={isLoading}
                {...register('name', {
                  required: 'Full name is required',
                  minLength: { value: 3, message: 'Name must be at least 3 characters' },
                })}
                placeholder="Alex Morgan"
                className={`w-full bg-slate-50 border ${
                  errors.name ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-blue-700'
                } rounded-xl pl-10 pr-3 py-2.5 text-xs font-medium text-slate-800 focus:outline-none disabled:opacity-50`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.name.message}</p>
            )}
          </div>

         
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                disabled={isLoading}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address format',
                  },
                })}
                placeholder="alex.morgan@example.com"
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
            <label className="block text-xs font-bold text-slate-700 mb-1">Profile Photo URL (Optional)</label>
            <div className="relative">
              <Image className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="url"
                disabled={isLoading}
                {...register('photoURL')}
                placeholder="https://example.com/avatar.jpg"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-700 disabled:opacity-50"
              />
            </div>
          </div>

          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
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

         
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
            <div className="relative">
              <ShieldCheck className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                disabled={isLoading}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === passwordValue || 'Passwords do not match',
                })}
                placeholder="••••••••"
                className={`w-full bg-slate-50 border ${
                  errors.confirmPassword ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-blue-700'
                } rounded-xl pl-10 pr-10 py-2.5 text-xs font-medium text-slate-800 focus:outline-none disabled:opacity-50`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-[11px] font-medium text-rose-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" variant="primary" fullWidth isLoading={isLoading} icon={UserPlus} size="md" className="mt-2 shadow-md shadow-blue-500/20">
            Create Account & Sign In
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-600 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="font-extrabold text-blue-700 hover:underline">
              Sign In Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
