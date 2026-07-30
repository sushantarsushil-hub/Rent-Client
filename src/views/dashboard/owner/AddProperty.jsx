'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Building,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Maximize2,
  Image as ImageIcon,
  ListPlus,
  Send,
  CheckSquare,
  UserCheck,
  Mail,
  Clock,
} from 'lucide-react';
import SectionTitle from '../../../components/common/SectionTitle';
import Button from '../../../components/ui/Button';
import { createProperty } from '../../../api/ownerService';
import { useAuth } from '../../../providers/AuthProvider';
import { useAppRouter } from '../../../hooks/useAppRouter';
import { showToast } from '../../../utils/toast';

const AMENITY_OPTIONS = [
  'High-Speed Wi-Fi',
  'Air Conditioning',
  'Private Parking',
  'Swimming Pool',
  'Fitness Gym',
  'Coffee Bar',
  'Pet Friendly',
  'Washer & Dryer',
  'Balcony / Terrace',
  'Elevator Access',
];

const PROPERTY_TYPES = [
  'Villa',
  'Apartment',
  'Penthouse',
  'House',
  'Loft',
  'Chalet',
  'Studio',
  'Commercial',
  'Townhouse',
];

export const AddProperty = () => {
  const router = useAppRouter();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      propertyType: 'Apartment',
      rentType: 'Monthly',
      bedrooms: 2,
      bathrooms: 2,
      propertySize: 1200,
      amenities: ['High-Speed Wi-Fi', 'Air Conditioning', 'Private Parking'],
    },
  });

  const onSubmit = async (formData) => {
    try {
      const mainImage = formData.image?.trim();
      const extraImagesRaw = formData.additionalImages
        ? formData.additionalImages.split('\n').map((s) => s.trim()).filter(Boolean)
        : [];
      const imagesList = mainImage
        ? [mainImage, ...extraImagesRaw]
        : ['https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80'];

      const propertyPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        propertyType: formData.propertyType || 'Apartment',
        rent: Number(formData.rent),
        rentType: formData.rentType || 'Monthly',
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        propertySize: Number(formData.propertySize),
        amenities: Array.isArray(formData.amenities)
          ? formData.amenities
          : [formData.amenities].filter(Boolean),
        images: imagesList,
        extraFeatures: formData.extraFeaturesRaw
          ? formData.extraFeaturesRaw.split(',').map((s) => s.trim()).filter(Boolean)
          : ['Keyless Entry', 'High-Speed Wi-Fi'],
        status: 'pending', 
      };

      await createProperty(propertyPayload);

      showToast.success('Property listing submitted successfully! Status is set to PENDING for admin review.');
      router.push('/dashboard/owner/properties');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit property listing. Please try again.';
      showToast.error(msg);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <SectionTitle
        badge="Property Management"
        title="Add New Property Listing"
        subtitle="Fill in the property details below to submit your listing for platform approval."
      />

     
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-6 rounded-3xl border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user?.photo || user?.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'}
            alt={user?.name || 'Owner Avatar'}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500 shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-blue-300 uppercase tracking-wider flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-blue-400" /> Logged-In Property Owner
              </span>
            </div>
            <h3 className="text-lg font-black text-white">{user?.name || 'Property Owner'}</h3>
            <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> {user?.email || 'owner@example.com'}
            </p>
          </div>
        </div>
        <div className="bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700/80 flex items-center gap-2 text-xs font-bold text-slate-200">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>New Property Initial Status: <span className="text-amber-400 font-extrabold uppercase">Pending</span></span>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="md:col-span-2">
              <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-1.5 ml-1">
                <Building className="w-3.5 h-3.5 text-blue-600" /> Property Title
              </label>
              <input
                type="text"
                placeholder="e.g. Modern Penthouse with Panoramic City Views"
                {...register('title', { required: 'Property title is required' })}
                className={`w-full bg-slate-50 border rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none ${
                  errors.title ? 'border-rose-500' : 'border-slate-200 focus:border-blue-600'
                }`}
              />
              {errors.title && <p className="text-[11px] font-medium text-rose-600 mt-1 ml-1">{errors.title.message}</p>}
            </div>

            
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-1.5 ml-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> Location (City, State / Address)
              </label>
              <input
                type="text"
                placeholder="e.g. Downtown, Austin, TX"
                {...register('location', { required: 'Location is required' })}
                className={`w-full bg-slate-50 border rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none ${
                  errors.location ? 'border-rose-500' : 'border-slate-200 focus:border-blue-600'
                }`}
              />
              {errors.location && <p className="text-[11px] font-medium text-rose-600 mt-1 ml-1">{errors.location.message}</p>}
            </div>

            
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1 ml-1">Property Type</label>
              <select
                {...register('propertyType', { required: 'Property type is required' })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

           
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-1.5 ml-1">
                <DollarSign className="w-3.5 h-3.5 text-blue-600" /> Rent Amount ($)
              </label>
              <input
                type="number"
                placeholder="e.g. 1850"
                {...register('rent', {
                  required: 'Rent amount is required',
                  min: { value: 1, message: 'Rent amount must be greater than $0' },
                })}
                className={`w-full bg-slate-50 border rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none ${
                  errors.rent ? 'border-rose-500' : 'border-slate-200 focus:border-blue-600'
                }`}
              />
              {errors.rent && <p className="text-[11px] font-medium text-rose-600 mt-1 ml-1">{errors.rent.message}</p>}
            </div>

           
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1 ml-1">Rent Type</label>
              <select
                {...register('rentType', { required: 'Rent type is required' })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="Monthly">Monthly</option>
                <option value="Weekly">Weekly</option>
                <option value="Daily">Daily</option>
              </select>
            </div>

            
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-1.5 ml-1">
                <Bed className="w-3.5 h-3.5 text-blue-600" /> Bedrooms
              </label>
              <input
                type="number"
                {...register('bedrooms', {
                  required: 'Bedrooms count is required',
                  min: { value: 0, message: 'Bedrooms count cannot be negative' },
                })}
                className={`w-full bg-slate-50 border rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none ${
                  errors.bedrooms ? 'border-rose-500' : 'border-slate-200 focus:border-blue-600'
                }`}
              />
              {errors.bedrooms && <p className="text-[11px] font-medium text-rose-600 mt-1 ml-1">{errors.bedrooms.message}</p>}
            </div>

            
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-1.5 ml-1">
                <Bath className="w-3.5 h-3.5 text-blue-600" /> Bathrooms
              </label>
              <input
                type="number"
                {...register('bathrooms', {
                  required: 'Bathrooms count is required',
                  min: { value: 0, message: 'Bathrooms count cannot be negative' },
                })}
                className={`w-full bg-slate-50 border rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none ${
                  errors.bathrooms ? 'border-rose-500' : 'border-slate-200 focus:border-blue-600'
                }`}
              />
              {errors.bathrooms && <p className="text-[11px] font-medium text-rose-600 mt-1 ml-1">{errors.bathrooms.message}</p>}
            </div>

           
            <div className="md:col-span-2">
              <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-1.5 ml-1">
                <Maximize2 className="w-3.5 h-3.5 text-blue-600" /> Property Size (sqft)
              </label>
              <input
                type="number"
                placeholder="e.g. 1550"
                {...register('propertySize', {
                  required: 'Property size is required',
                  min: { value: 10, message: 'Property size must be valid' },
                })}
                className={`w-full bg-slate-50 border rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none ${
                  errors.propertySize ? 'border-rose-500' : 'border-slate-200 focus:border-blue-600'
                }`}
              />
              {errors.propertySize && <p className="text-[11px] font-medium text-rose-600 mt-1 ml-1">{errors.propertySize.message}</p>}
            </div>

           
            <div className="md:col-span-2">
              <label className="block text-xs font-extrabold text-slate-700 mb-1 ml-1">Description</label>
              <textarea
                rows={3}
                placeholder="Provide a comprehensive description of the property, surrounding area, and features..."
                {...register('description', { required: 'Description is required' })}
                className={`w-full bg-slate-50 border rounded-2xl p-3.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none ${
                  errors.description ? 'border-rose-500' : 'border-slate-200 focus:border-blue-600'
                }`}
              />
              {errors.description && <p className="text-[11px] font-medium text-rose-600 mt-1 ml-1">{errors.description.message}</p>}
            </div>

            
            <div className="md:col-span-2">
              <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-1.5 ml-1">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" /> Primary Image URL
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800"
                {...register('image', {
                  required: 'Primary property image URL is required',
                  pattern: {
                    value: /^https?:\/\/.+$/,
                    message: 'Must be a valid HTTP or HTTPS image URL',
                  },
                })}
                className={`w-full bg-slate-50 border rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none ${
                  errors.image ? 'border-rose-500' : 'border-slate-200 focus:border-blue-600'
                }`}
              />
              {errors.image && <p className="text-[11px] font-medium text-rose-600 mt-1 ml-1">{errors.image.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-1.5 ml-1">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" /> Additional Gallery Image URLs (One URL per line)
              </label>
              <textarea
                rows={2}
                placeholder={`https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800\nhttps://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800`}
                {...register('additionalImages')}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>

           
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-extrabold text-slate-700 flex items-center gap-1.5 ml-1">
                <CheckSquare className="w-3.5 h-3.5 text-blue-600" /> Amenities
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                {AMENITY_OPTIONS.map((amenity) => (
                  <label key={amenity} className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                    <input
                      type="checkbox"
                      value={amenity}
                      {...register('amenities')}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            
            <div className="md:col-span-2">
              <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-1.5 ml-1">
                <ListPlus className="w-3.5 h-3.5 text-blue-600" /> Extra Features (Comma Separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Smart Lock, EV Charging Station, Ocean View, Private Balcony"
                {...register('extraFeaturesRaw')}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500">
              Submitted listings are assigned status: <span className="text-amber-600 font-extrabold uppercase">Pending</span>
            </span>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              icon={Send}
              className="px-6 font-extrabold shadow-lg shadow-blue-500/20 w-full sm:w-auto"
            >
              Add Property Listing
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
