'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Search, MapPin, Building, DollarSign, RotateCcw } from 'lucide-react';
import Button from './Button';

export const SearchBar = ({ onSearch, defaultValues = {}, className = '' }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      location: defaultValues.location || defaultValues.search || '',
      propertyType: defaultValues.propertyType || 'All',
      minPrice: defaultValues.minPrice || '',
      maxPrice: defaultValues.maxPrice || '',
    },
  });

  const minPriceValue = watch('minPrice');

  const onSubmit = (data) => {
    const searchParams = {
      location: data.location ? data.location.trim() : '',
      propertyType: data.propertyType || 'All',
      minPrice: data.minPrice ? Number(data.minPrice) : '',
      maxPrice: data.maxPrice ? Number(data.maxPrice) : '',
    };

    if (onSearch) {
      onSearch(searchParams);
    } else {
      const params = new URLSearchParams();
      if (searchParams.location) params.set('search', searchParams.location);
      if (searchParams.propertyType && searchParams.propertyType !== 'All') {
        params.set('propertyType', searchParams.propertyType);
      }
      if (searchParams.minPrice) params.set('minPrice', searchParams.minPrice.toString());
      if (searchParams.maxPrice) params.set('maxPrice', searchParams.maxPrice.toString());

      router.push(`/properties?${params.toString()}`);
    }
  };

  const handleReset = () => {
    reset({
      location: '',
      propertyType: 'All',
      minPrice: '',
      maxPrice: '',
    });
    if (onSearch) {
      onSearch({
        location: '',
        propertyType: 'All',
        minPrice: '',
        maxPrice: '',
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`bg-white/95 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/10 space-y-4 max-w-5xl mx-auto ${className}`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
       
        <div>
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 ml-1">
            Destination / Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-blue-600 shrink-0" />
            <input
              type="text"
              {...register('location')}
              placeholder="e.g. San Francisco, New York..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        
        <div>
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 ml-1">
            Property Type
          </label>
          <div className="relative">
            <Building className="absolute left-3.5 top-3 w-4 h-4 text-blue-600 shrink-0 pointer-events-none z-10" />
            <select
              {...register('propertyType')}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer transition-all appearance-none"
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
        </div>

        
        <div>
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 ml-1">
            Minimum Price ($)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3.5 top-3 w-4 h-4 text-blue-600 shrink-0" />
            <input
              type="number"
              {...register('minPrice', {
                min: { value: 0, message: 'Price cannot be negative' },
              })}
              placeholder="e.g. 200"
              className={`w-full bg-slate-50 border ${
                errors.minPrice ? 'border-rose-500' : 'border-slate-200'
              } rounded-2xl pl-10 pr-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all`}
            />
          </div>
          {errors.minPrice && (
            <p className="mt-1 text-[10px] font-medium text-rose-600 ml-1">{errors.minPrice.message}</p>
          )}
        </div>

        
        <div>
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1 ml-1">
            Maximum Price ($)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3.5 top-3 w-4 h-4 text-blue-600 shrink-0" />
            <input
              type="number"
              {...register('maxPrice', {
                min: { value: 0, message: 'Price cannot be negative' },
                validate: (val) =>
                  !val ||
                  !minPriceValue ||
                  Number(val) >= Number(minPriceValue) ||
                  'Max price must be ≥ min price',
              })}
              placeholder="e.g. 2500"
              className={`w-full bg-slate-50 border ${
                errors.maxPrice ? 'border-rose-500' : 'border-slate-200'
              } rounded-2xl pl-10 pr-3 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all`}
            />
          </div>
          {errors.maxPrice && (
            <p className="mt-1 text-[10px] font-medium text-rose-600 ml-1">{errors.maxPrice.message}</p>
          )}
        </div>
      </div>

      
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleReset}
          icon={RotateCcw}
          className="w-full sm:w-auto text-slate-600 hover:text-slate-900 font-bold"
        >
          Reset Search
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          icon={Search}
          className="w-full sm:w-auto px-8 py-3 text-xs font-extrabold shadow-lg shadow-blue-500/20"
        >
          Search Rental Properties
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
