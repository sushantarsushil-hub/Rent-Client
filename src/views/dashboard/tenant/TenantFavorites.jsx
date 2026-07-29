'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Eye, MapPin } from 'lucide-react';
import SectionTitle from '../../../components/common/SectionTitle';
import EmptyState from '../../../components/common/EmptyState';
import ErrorState from '../../../components/common/ErrorState';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import Button from '../../../components/ui/Button';
import { useTenantFavorites, removeFavoriteProperty } from '../../../api/tenantService';
import { formatCurrency } from '../../../utils/formatters';
import { showToast } from '../../../utils/toast';

export const TenantFavorites = () => {
  const router = useRouter();
  const { data: favorites, isLoading, isError, refetch } = useTenantFavorites();

  const [selectedRemoveId, setSelectedRemoveId] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleConfirmRemove = async () => {
    if (!selectedRemoveId) return;

    setIsRemoving(true);
    try {
      await removeFavoriteProperty(selectedRemoveId);
      showToast.info('Property removed from your saved favorites wishlist.');
      setSelectedRemoveId(null);
      refetch();
    } catch (err) {
      showToast.error('Failed to remove favorite item.');
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="space-y-8">
      <SectionTitle
        badge="Saved Wishlist"
        title="My Favorite Properties"
        subtitle="Manage your saved property listings for future stay bookings."
      />

      {isLoading && (
        <div className="py-16 text-center">
          <LoadingSpinner size="lg" text="Fetching your saved favorite properties..." />
        </div>
      )}

      {isError && !isLoading && (
        <ErrorState
          title="Unable to load favorites"
          description="Failed to retrieve saved favorites from backend."
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && favorites?.length === 0 && (
        <EmptyState
          title="No saved favorites yet"
          description="Click the 'Add to Favorites' heart button on any property listing to save it here."
          actionText="Explore Properties"
          onAction={() => router.push('/properties')}
        />
      )}

      {!isLoading && !isError && favorites?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative aspect-[4/3] w-full bg-slate-100">
                  <img src={prop.image} alt={prop.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                    {prop.type}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <span className="truncate">{prop.location}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">{prop.title}</h3>
                  <p className="text-lg font-black text-slate-900">
                    {formatCurrency(prop.price)} <span className="text-xs font-normal text-slate-500">/ night</span>
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-3 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Eye}
                  onClick={() => router.push(`/properties/${prop.id}`)}
                  className="flex-1"
                >
                  View
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={() => setSelectedRemoveId(prop.id)}
                  className="text-rose-600 hover:bg-rose-50 border border-rose-200 cursor-pointer"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!selectedRemoveId}
        title="Remove Favorite Property?"
        message="Are you sure you want to remove this property from your saved wishlist?"
        confirmText="Remove Favorite"
        isDanger
        isLoading={isRemoving}
        onConfirm={handleConfirmRemove}
        onCancel={() => setSelectedRemoveId(null)}
      />
    </div>
  );
};

export default TenantFavorites;
