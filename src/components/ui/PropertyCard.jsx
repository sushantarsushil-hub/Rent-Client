'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { MapPin, Bed, Bath, Maximize2, ArrowRight, Heart } from 'lucide-react';
import RatingStars from './RatingStars';
import StatusBadge from './StatusBadge';
import Button from './Button';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../providers/AuthProvider';
import { showToast } from '../../utils/toast';
import { toggleFavoriteProperty, useTenantFavorites } from '../../api/tenantService';

export const PropertyCard = ({ property }) => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const isTenant = isAuthenticated && (user?.role || '').toLowerCase() === 'tenant';
  const { data: userFavorites = [] } = useTenantFavorites({ enabled: isTenant });

  const [isFavorite, setIsFavorite] = useState(property?.isFavorite || false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const propId = property?.id || property?._id;

  useEffect(() => {
    if (isTenant && Array.isArray(userFavorites)) {
      const exists = userFavorites.some(
        (fav) => String(fav.id || fav._id) === String(propId)
      );
      setIsFavorite(exists);
    }
  }, [isTenant, userFavorites, propId]);

  if (!property) return null;

  const {
    id,
    title,
    location: propertyLocation,
    price,
    rentType = 'Per Month',
    rating,
    reviews,
    image,
    type,
    beds,
    baths,
    sizeSqft,
    status = 'available',
  } = property;

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/properties/${propId}`)}`);
      return;
    }

    if (!isTenant) {
      showToast.info('Favorite saving is exclusive to Tenant accounts.');
      return;
    }

    if (isFavoriteLoading) return;

    setIsFavoriteLoading(true);
    try {
      await toggleFavoriteProperty(propId, isFavorite);
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

  const handleViewDetails = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/properties/${id}`)}`);
    } else {
      router.push(`/properties/${id}`);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group flex flex-col h-full bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 overflow-hidden"
    >
      
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

       
        <div className="absolute top-3 left-3 right-3 sm:top-3.5 sm:left-3.5 sm:right-3.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap max-w-[calc(100%-2.75rem)] pointer-events-auto">
            {type && (
              <span className="bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-xl shadow-md border border-white/10 tracking-wide uppercase truncate max-w-[120px]">
                {type}
              </span>
            )}
            {status && (
              <StatusBadge status={status} size="sm" />
            )}
          </div>

          <button
            type="button"
            onClick={handleFavoriteToggle}
            className={`pointer-events-auto p-2 rounded-2xl backdrop-blur-md transition-all shadow-md cursor-pointer shrink-0 ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-rose-500/30 scale-110'
                : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white'
            }`}
            aria-label="Save Property to Favorites"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        
        {rating && (
          <div className="absolute bottom-3 right-3 sm:bottom-3.5 sm:right-3.5 bg-white/95 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl shadow-md border border-slate-200/80">
            <RatingStars rating={rating} reviewsCount={reviews} showNumeric />
          </div>
        )}

        
        <div className="absolute bottom-3 left-3 sm:bottom-3.5 sm:left-3.5 bg-gradient-to-r from-blue-700 to-indigo-700 text-white px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-xl shadow-md text-xs font-black max-w-[50%] truncate">
          {formatCurrency(price)} <span className="text-[10px] font-normal opacity-90 hidden sm:inline">/ {rentType.toLowerCase().replace('per ', '')}</span>
        </div>
      </div>

      
      <div className="flex flex-col flex-1 p-5 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{propertyLocation}</span>
        </div>

        <h3 className="text-base font-extrabold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors leading-snug">
          {title}
        </h3>

       
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 font-semibold py-2 border-y border-slate-100/80">
          {beds && (
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-blue-500" /> {beds} Beds
            </span>
          )}
          {baths && (
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-blue-500" /> {baths} Baths
            </span>
          )}
          {sizeSqft && (
            <span className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-blue-500" /> {sizeSqft.toLocaleString()} sqft
            </span>
          )}
        </div>

        
        <div className="mt-auto pt-2">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={handleViewDetails}
            icon={ArrowRight}
            iconPosition="right"
            className="group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 font-bold"
          >
            View Property Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
