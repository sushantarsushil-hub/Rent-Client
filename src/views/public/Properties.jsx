'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, RotateCcw } from 'lucide-react';
import SectionTitle from '../../components/common/SectionTitle';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import PropertyCard from '../../components/ui/PropertyCard';
import Pagination from '../../components/ui/Pagination';
import Button from '../../components/ui/Button';
import { PropertyCardSkeleton } from '../../components/common/SkeletonLoader';
import { usePropertiesList } from '../../api/propertyService';

export const Properties = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filterState, setFilterState] = useState({
    search: searchParams.get('search') || searchParams.get('location') || '',
    propertyType: searchParams.get('propertyType') || 'All',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '',
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 6,
  });

  // Sync state when URL query parameters change externally
  useEffect(() => {
    setFilterState({
      search: searchParams.get('search') || searchParams.get('location') || '',
      propertyType: searchParams.get('propertyType') || 'All',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sort: searchParams.get('sort') || '',
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 6,
    });
  }, [searchParams]);

  const { search, propertyType, minPrice, maxPrice, sort, page, limit } = filterState;

  // Query Backend with queryParams via TanStack Query
  const queryParams = { search, propertyType, minPrice, maxPrice, sort, page, limit };
  const { data: response, isLoading, isError, error, refetch } = usePropertiesList(queryParams);

  const properties = response?.data || [];
  const paginationMeta = response?.pagination || { currentPage: page, totalPages: 1, totalItems: properties.length };

  const pushUrlParams = (newFilters) => {
    const params = new URLSearchParams();
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.propertyType && newFilters.propertyType !== 'All') {
      params.set('propertyType', newFilters.propertyType);
    }
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.sort) params.set('sort', newFilters.sort);
    if (newFilters.page > 1) params.set('page', newFilters.page.toString());
    if (newFilters.limit && newFilters.limit !== 6) params.set('limit', newFilters.limit.toString());

    router.push(`/properties?${params.toString()}`);
  };

  const handleParamChange = (key, value) => {
    const nextFilters = { ...filterState, [key]: value, page: 1 };
    setFilterState(nextFilters);
    pushUrlParams(nextFilters);
  };

  const handlePageChange = (newPage) => {
    const nextFilters = { ...filterState, page: newPage };
    setFilterState(nextFilters);
    pushUrlParams(nextFilters);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      search: '',
      propertyType: 'All',
      minPrice: '',
      maxPrice: '',
      sort: '',
      page: 1,
      limit: 6,
    };
    setFilterState(defaultFilters);
    router.push('/properties');
  };

  const isFiltered = !!(search || (propertyType && propertyType !== 'All') || minPrice || maxPrice || sort);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SectionTitle
        badge="Approved Properties"
        title="All Rental Listings"
        subtitle="Search, filter, and sort verified urban properties available for immediate booking."
      />

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 items-center">
          {/* 1. Location / Keyword Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-blue-600 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleParamChange('search', e.target.value)}
              placeholder="Search by location..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* 2. Property Type Dropdown */}
          <div>
            <select
              value={propertyType}
              onChange={(e) => handleParamChange('propertyType', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer appearance-none"
            >
              <option value="All">All Property Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Penthouse">Penthouse</option>
              <option value="House">House</option>
              <option value="Loft">Loft</option>
              <option value="Chalet">Chalet</option>
            </select>
          </div>

          {/* 3. Minimum Price */}
          <div>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => handleParamChange('minPrice', e.target.value)}
              placeholder="Min Price ($)"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* 4. Maximum Price */}
          <div>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => handleParamChange('maxPrice', e.target.value)}
              placeholder="Max Price ($)"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* 5. Sort Options */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => handleParamChange('sort', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer appearance-none"
            >
              <option value="">Sort By Price</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Indicator & Button */}
        {isFiltered && (
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-500">
              Active filters applied
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              icon={RotateCcw}
              className="text-xs text-slate-600 hover:text-slate-900 font-bold"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {/* 1. Loading Skeleton Grid */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {Array.from({ length: limit || 6 }).map((_, idx) => (
            <PropertyCardSkeleton key={idx} />
          ))}
        </div>
      )}

      {/* 2. Error State */}
      {isError && !isLoading && (
        <ErrorState
          title="Unable to load property listings"
          description="Failed to fetch property catalog from server."
          error={error}
          onRetry={refetch}
        />
      )}

      {/* 3. Empty State */}
      {!isLoading && !isError && properties.length === 0 && (
        <EmptyState
          title="No approved properties match your criteria"
          description="Try clearing or adjusting your search filters to find available rental properties."
          actionText="Clear All Filters"
          onAction={handleResetFilters}
        />
      )}

      {/* 4. Success Property Grid (3 columns desktop, 2 columns tablet, 1 column mobile) */}
      {!isLoading && !isError && properties.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {properties.map((property) => (
              <PropertyCard key={property.id || property._id} property={property} />
            ))}
          </div>

          {/* Pagination Controls */}
          {paginationMeta.totalPages > 1 && (
            <Pagination
              currentPage={paginationMeta.currentPage || page}
              totalPages={paginationMeta.totalPages || 1}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Properties;
