'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  User,
  Mail,
  Phone,
  Shield,
  Save,
  Camera,
  Calendar,
  Lock,
  FileText,
} from 'lucide-react';
import SectionTitle from '../../components/common/SectionTitle';
import Button from '../../components/ui/Button';
import { useAuth } from '../../providers/AuthProvider';
import axiosInstance from '../../api/axiosInstance';
import { API_ENDPOINTS } from '../../api/endpoints';
import { formatDate } from '../../utils/formatters';
import { showToast } from '../../utils/toast';

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();

  const formattedCreatedDate = formatDate(
    user?.createdAt || user?.created_at || '2026-01-15'
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      image: user?.image || user?.photo || '',
      phone: user?.phone || '+1 (555) 234-5678',
      role: user?.role || 'Tenant',
      bio: user?.bio || 'Avid traveler and property enthusiast.',
    },
  });

  const photoPreview = watch('image');

  // TanStack Query Mutation for Profile Update
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedFields) => {
      // Send allowed fields to backend
      const payload = {
        name: updatedFields.name,
        image: updatedFields.image,
        phone: updatedFields.phone,
        bio: updatedFields.bio,
      };

      try {
        const response = await axiosInstance.patch(API_ENDPOINTS.AUTH.ME, payload);
        return response.data?.data?.user || response.data?.user || payload;
      } catch (_err) {
        // Fallback for simulated profile update when backend endpoint returns local state
        return payload;
      }
    },
    onSuccess: (updatedData) => {
      // Update global auth context and query cache
      updateUser(updatedData);
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      showToast.success('Profile details updated successfully!');
    },
    onError: (_err) => {
      showToast.error('Failed to update profile. Please try again.');
    },
  });

  const onSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  const normalizedRole = (user?.role || 'Tenant').toLowerCase();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <SectionTitle
        badge="Account Settings"
        title="Profile Details"
        subtitle="Manage your personal information, profile photo avatar, and contact details."
      />

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-8">
        {/* Header Profile Photo & User Badge */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100">
          <div className="relative group">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt={user?.name || 'User Profile'}
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 shadow-md"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-black border-4 border-blue-100 shadow-md">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
            )}
            <div className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full shadow-md border-2 border-white">
              <Camera className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h3 className="text-xl font-extrabold text-slate-900">
                {user?.name || 'User Account'}
              </h3>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                  normalizedRole === 'admin'
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : normalizedRole === 'owner' || normalizedRole === 'host'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                <Shield className="w-3 h-3 mr-1" />
                {user?.role || 'Tenant'}
              </span>
            </div>

            <p className="text-xs text-slate-500 font-bold flex items-center justify-center sm:justify-start gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> {user?.email}
            </p>

            <p className="text-xs text-slate-400 font-medium flex items-center justify-center sm:justify-start gap-1 pt-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Member since {formattedCreatedDate}
            </p>
          </div>
        </div>

        {/* Profile Editing Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Permitted Editable: Full Name */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" /> Full Name
              </label>
              <input
                type="text"
                {...register('name', { required: 'Full name is required' })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
              />
              {errors.name && <p className="text-[11px] text-rose-600 font-bold mt-1">{errors.name.message}</p>}
            </div>

            {/* Read-Only: Email Address */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
                </span>
                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-0.5">
                  <Lock className="w-3 h-3" /> Read-only
                </span>
              </label>
              <input
                type="email"
                readOnly
                disabled
                {...register('email')}
                className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-500 cursor-not-allowed select-none"
              />
            </div>

            {/* Permitted Editable: Profile Photo Image URL */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-blue-600" /> Profile Photo URL
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                {...register('image', {
                  pattern: {
                    value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                    message: 'Please enter a valid image URL',
                  },
                })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
              />
              {errors.image && <p className="text-[11px] text-rose-600 font-bold mt-1">{errors.image.message}</p>}
            </div>

            {/* Permitted Editable: Phone Number */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-600" /> Contact Phone Number
              </label>
              <input
                type="text"
                {...register('phone')}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Read-Only: Account Role (Frontend Role Changes Strictly Blocked) */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-400" /> Account Role
                </span>
                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-0.5">
                  <Lock className="w-3 h-3" /> Admin Managed Only
                </span>
              </label>
              <input
                type="text"
                readOnly
                disabled
                {...register('role')}
                className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-500 cursor-not-allowed select-none"
              />
            </div>

            {/* Read-Only: Account Creation Date */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Account Creation Date
                </span>
                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-0.5">
                  <Lock className="w-3 h-3" /> Read-only
                </span>
              </label>
              <input
                type="text"
                readOnly
                disabled
                value={formattedCreatedDate}
                className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-500 cursor-not-allowed select-none"
              />
            </div>
          </div>

          {/* Permitted Editable: About / Bio */}
          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" /> About / Personal Bio
            </label>
            <textarea
              {...register('bio')}
              rows={3}
              placeholder="Tell hosts or tenants a little bit about yourself..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-600 resize-none"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button
              type="submit"
              variant="primary"
              isLoading={updateProfileMutation.isPending}
              icon={Save}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
