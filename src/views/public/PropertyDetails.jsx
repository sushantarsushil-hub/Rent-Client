'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import {
  MapPin,
  ShieldCheck,
  Bed,
  Bath,
  Maximize2,
  Heart,
  Wifi,
  Tv,
  Car,
  Coffee,
  CheckCircle,
  CreditCard,
  Send,
  Mail,
  Star,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import RatingStars from '../../components/ui/RatingStars';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import BookingModal from '../../components/booking/BookingModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useQueryClient } from '@tanstack/react-query';
import ErrorState from '../../components/common/ErrorState';
import NotFound from './NotFound';
import { useAppRouter } from '../../hooks/useAppRouter';
import { useAuth } from '../../providers/AuthProvider';
import {
  usePropertyDetails,
  submitPropertyReview,
} from '../../api/propertyService';
import { toggleFavoriteProperty, useTenantFavorites } from '../../api/tenantService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { showToast } from '../../utils/toast';

export const PropertyDetails = ({ idOverride }) => {
  const router = useAppRouter();
  const queryClient = useQueryClient();
  const params = useParams();
  const urlId = params?.id;
  const id = idOverride || urlId || 'prop-1';

  const { isAuthenticated, user } = useAuth();
  const { data: property, isLoading, isError, refetch } = usePropertyDetails(id);

  const isTenant = isAuthenticated && (user?.role || '').toLowerCase() === 'tenant';
  const { data: userFavorites = [] } = useTenantFavorites({ enabled: isTenant });

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    if (isTenant && Array.isArray(userFavorites) && property) {
      const targetId = String(property.id || property._id || id);
      const exists = userFavorites.some((fav) => String(fav.id || fav._id) === targetId);
      setIsFavorite(exists);
    }
  }, [isTenant, userFavorites, property, id]);

  
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      rating: 5,
      comment: '',
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading property details..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <ErrorState
          title="Unable to load property"
          description="We couldn't fetch details for this property. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!property) {
    return <NotFound />;
  }

  const galleryImages =
    property.gallery || (property.image ? [property.image] : ['https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80']);
  const reviewsList = property.reviewsList || [];

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/properties/${id}`)}`);
      return;
    }

    if (!isTenant) {
      showToast.info('Favorite saving is exclusive to Tenant accounts.');
      return;
    }

    if (isFavoriteLoading) return;

    setIsFavoriteLoading(true);
    try {
      await toggleFavoriteProperty(property.id || id, isFavorite);
      const nextState = !isFavorite;
      setIsFavorite(nextState);
      queryClient.invalidateQueries({ queryKey: ['tenant', 'favorites'] });

      if (nextState) {
        showToast.success('Property saved to your Favorites!');
      } else {
        showToast.info('Property removed from your Favorites.');
      }
    } catch (_err) {
      showToast.error('Failed to update favorites. Please try again.');
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const handleOpenBookingModal = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/properties/${id}`)}`);
      return;
    }
    setIsBookingModalOpen(true);
  };

  
  const onReviewSubmit = async (formData) => {
    if (!isAuthenticated) {
      showToast.error('Please log in as an eligible tenant to submit a review.');
      router.push(`/login?redirect=${encodeURIComponent(`/properties/${id}`)}`);
      return;
    }

    try {
      await submitPropertyReview(property.id, {
        rating: Number(formData.rating),
        comment: formData.comment,
        name: user?.name,
        email: user?.email,
      });

      showToast.success('Thank you! Your review has been submitted successfully.');
      reset({ rating: 5, comment: '' });
      refetch();
    } catch (err) {
      const errMsg =
        err?.response?.data?.message || 'Failed to publish review. Only eligible tenants can review this property.';
      showToast.error(errMsg);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <StatusBadge status={property.status || 'Available'} />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {property.type || property.propertyType || 'Property'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">{property.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
            <RatingStars rating={property.rating} reviewsCount={property.reviews} showNumeric />
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              {property.location}
            </span>
          </div>
        </div>

        
        <div className="shrink-0">
          <Button
            variant="outline"
            size="md"
            isLoading={isFavoriteLoading}
            onClick={handleToggleFavorite}
            className={isFavorite ? 'border-rose-300 bg-rose-50 text-rose-600 font-bold' : 'font-bold'}
          >
            <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
            {isFavorite ? 'Saved in Favorites' : 'Add to Favorites'}
          </Button>
        </div>
      </div>

      
      <div className="space-y-3">
        <div className="h-64 sm:h-80 md:h-[480px] w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-xs">
          <img
            src={galleryImages[activeImageIndex] || galleryImages[0]}
            alt={property.title}
            className="w-full h-full object-cover transition-all duration-300"
          />
        </div>

        {galleryImages.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {galleryImages.map((img, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveImageIndex(index)}
                className={`w-16 h-14 sm:w-24 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  activeImageIndex === index
                    ? 'border-blue-600 shadow-md scale-105'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

     
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          
          <div className="grid grid-cols-3 gap-2 sm:gap-4 p-4 sm:p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs text-center">
            <div>
              <Bed className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <span className="text-xs font-extrabold block text-slate-900">
                {property.beds || property.bedrooms || 1} Bedrooms
              </span>
            </div>
            <div>
              <Bath className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <span className="text-xs font-extrabold block text-slate-900">
                {property.baths || property.bathrooms || 1} Bathrooms
              </span>
            </div>
            <div>
              <Maximize2 className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <span className="text-xs font-extrabold block text-slate-900">
                {property.sizeSqft || property.propertySize
                  ? (property.sizeSqft || property.propertySize).toLocaleString()
                  : '2,400'}{' '}
                sqft
              </span>
            </div>
          </div>

          
          <div className="space-y-3">
            <h3 className="text-xl font-black text-slate-900">Property Description</h3>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">{property.description}</p>
          </div>

          
          <div className="space-y-3 pt-6 border-t border-slate-200">
            <h3 className="text-xl font-black text-slate-900">Included Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 p-3.5 bg-white rounded-2xl border border-slate-200">
                <Wifi className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">High-speed Wi-Fi</span>
              </div>
              <div className="flex items-center gap-2.5 p-3.5 bg-white rounded-2xl border border-slate-200">
                <Tv className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">Smart Cable TV</span>
              </div>
              <div className="flex items-center gap-2.5 p-3.5 bg-white rounded-2xl border border-slate-200">
                <Car className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">Private Parking Garage</span>
              </div>
              <div className="flex items-center gap-2.5 p-3.5 bg-white rounded-2xl border border-slate-200">
                <Coffee className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">Coffee Bar</span>
              </div>
            </div>
          </div>

         
          {property.extraFeatures && property.extraFeatures.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-slate-200">
              <h3 className="text-xl font-black text-slate-900">Extra Property Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {property.extraFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          
          <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-lg font-black text-slate-900">Property Host Information</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={
                    property.host?.avatar ||
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
                  }
                  alt={property.host?.name || 'Host'}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-blue-600 shrink-0"
                />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{property.host?.name || 'Sarah Jenkins'}</h4>
                  <p className="text-xs text-slate-500 font-bold flex items-center gap-1">
                    <Mail className="w-3 h-3 text-blue-600" /> {property.host?.email || 'sarah.host@rentify.com'}
                  </p>
                </div>
              </div>
              {property.host?.superhost && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-black rounded-full border border-blue-200 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Verified Superhost
                </span>
              )}
            </div>
          </div>

          
          <div className="space-y-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">Guest Reviews ({reviewsList.length})</h3>
              <RatingStars rating={property.rating} showNumeric />
            </div>

            
            {reviewsList.length === 0 ? (
              <div className="p-8 bg-white rounded-3xl border border-slate-200/90 text-center space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-extrabold text-slate-700">No guest reviews submitted yet.</p>
                <p className="text-[11px] text-slate-400 font-medium">Be the first eligible tenant to leave a review!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviewsList.map((rev) => (
                  <div key={rev.id || rev._id} className="p-5 bg-white rounded-3xl border border-slate-200/90 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xs border border-blue-200">
                          {rev.name ? rev.name[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <h5 className="text-xs font-extrabold text-slate-900">{rev.name || 'Tenant Guest'}</h5>
                          <p className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5 mt-0.5">
                            {rev.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400" /> {rev.email}
                              </span>
                            )}
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" /> {formatDate(rev.date || rev.createdAt)}
                            </span>
                          </p>
                        </div>
                      </div>
                      <RatingStars rating={rev.rating || 5} showNumeric={false} />
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}

            
            <div className="p-6 bg-white rounded-3xl border border-slate-200/90 space-y-5 shadow-2xs">
              <div>
                <h4 className="text-base font-black text-slate-900">Leave a Property Review</h4>
                <p className="text-xs text-slate-500 font-medium">
                  Share your stay experience regarding property condition, location accuracy, and host communication.
                </p>
              </div>

              <form onSubmit={handleSubmit(onReviewSubmit)} className="space-y-5">
                
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-2">
                    Overall Rating (1 to 5 Stars)
                  </label>
                  <Controller
                    name="rating"
                    control={control}
                    rules={{ required: 'Please select a rating' }}
                    render={({ field: { value, onChange } }) => (
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((starVal) => (
                          <button
                            key={starVal}
                            type="button"
                            onClick={() => onChange(starVal)}
                            className={`p-2 rounded-2xl transition-all cursor-pointer flex items-center justify-center border ${
                              value >= starVal
                                ? 'bg-amber-50 border-amber-300 text-amber-500 scale-105 shadow-2xs'
                                : 'bg-slate-50 border-slate-200 text-slate-300 hover:text-amber-400'
                            }`}
                            title={`${starVal} Star${starVal > 1 ? 's' : ''}`}
                          >
                            <Star className={`w-5 h-5 ${value >= starVal ? 'fill-amber-400 text-amber-400' : ''}`} />
                          </button>
                        ))}
                        <span className="text-xs font-extrabold text-slate-700 ml-2">
                          {value} / 5 Stars
                        </span>
                      </div>
                    )}
                  />
                  {errors.rating && <p className="text-[11px] text-rose-600 font-bold mt-1">{errors.rating.message}</p>}
                </div>

                
                <div>
                  <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                    Your Review Comment
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your experience with this property..."
                    {...register('comment', {
                      required: 'Review comment is required',
                      minLength: { value: 10, message: 'Review comment must be at least 10 characters long' },
                    })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 resize-none"
                  />
                  {errors.comment && <p className="text-[11px] text-rose-600 font-bold mt-1">{errors.comment.message}</p>}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isSubmitting}
                    icon={Send}
                    className="font-extrabold"
                  >
                    Submit Property Review
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        
        <div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-lg sticky top-24 space-y-6">
            <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-3xl font-black text-slate-900">
                  {formatCurrency(property.price || property.rent || 0)}
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  {' '}
                  / {property.rentType?.toLowerCase().replace('per ', '') || 'night'}
                </span>
              </div>
              <RatingStars rating={property.rating} reviewsCount={property.reviews} />
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 font-bold border-b border-slate-100 pb-4">
              <div className="flex justify-between">
                <span>{formatCurrency(property.price || property.rent || 0)} x 3 nights</span>
                <span>{formatCurrency((property.price || property.rent || 0) * 3)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cleaning & Service fee</span>
                <span>{formatCurrency(75)}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Amount</span>
                <span>{formatCurrency((property.price || property.rent || 0) * 3 + 75)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              fullWidth
              icon={CreditCard}
              onClick={handleOpenBookingModal}
              className="py-3 font-extrabold shadow-lg shadow-blue-500/20"
            >
              Book Property
            </Button>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        property={property}
      />
    </div>
  );
};

export default PropertyDetails;
