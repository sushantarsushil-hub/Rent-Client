import React from 'react';

export const PropertyCardSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden animate-pulse">
      <div className="aspect-[4/3] w-full bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-1/3 bg-slate-200 rounded-md" />
        <div className="h-5 w-3/4 bg-slate-200 rounded-md" />
        <div className="h-3 w-1/2 bg-slate-200 rounded-md" />
        <div className="pt-2 flex justify-between items-center">
          <div className="h-6 w-1/3 bg-slate-200 rounded-md" />
          <div className="h-9 w-28 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 4 }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden animate-pulse">
      <div className="bg-slate-100 h-10 w-full" />
      <div className="divide-y divide-slate-100/90">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 w-1/3">
              <div className="w-10 h-10 bg-slate-200 rounded-xl shrink-0" />
              <div className="space-y-1.5 w-full">
                <div className="h-4 w-3/4 bg-slate-200 rounded-md" />
                <div className="h-3 w-1/2 bg-slate-200 rounded-md" />
              </div>
            </div>
            <div className="h-4 w-1/6 bg-slate-200 rounded-md" />
            <div className="h-6 w-20 bg-slate-200 rounded-full" />
            <div className="h-8 w-24 bg-slate-200 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const DashboardCardSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs animate-pulse flex items-center justify-between">
      <div className="space-y-2 w-2/3">
        <div className="h-3 w-1/2 bg-slate-200 rounded-md" />
        <div className="h-7 w-3/4 bg-slate-200 rounded-md" />
        <div className="h-3 w-2/3 bg-slate-200 rounded-md" />
      </div>
      <div className="w-12 h-12 bg-slate-200 rounded-2xl shrink-0" />
    </div>
  );
};

export const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  if (type === 'table') return <TableSkeleton rows={count} />;
  if (type === 'dashboard') return <DashboardCardSkeleton />;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default SkeletonLoader;
