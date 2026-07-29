'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems,
  limit,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pages = getPageNumbers();

 
  const startItem = totalItems && limit ? (currentPage - 1) * limit + 1 : null;
  const endItem = totalItems && limit ? Math.min(currentPage * limit, totalItems) : null;

  return (
    <nav
      aria-label="Pagination Navigation"
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/90 pt-6 mt-8 ${className}`}
    >
      
      <div className="text-xs text-slate-500 font-semibold">
        {totalItems && startItem && endItem ? (
          <>
            Showing <span className="font-extrabold text-slate-900">{startItem}</span> -{' '}
            <span className="font-extrabold text-slate-900">{endItem}</span> of{' '}
            <span className="font-extrabold text-slate-900">{totalItems}</span> items
          </>
        ) : (
          <>
            Page <span className="font-extrabold text-slate-900">{currentPage}</span> of{' '}
            <span className="font-extrabold text-slate-900">{totalPages}</span>
          </>
        )}
      </div>

      
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange && currentPage > 1 && onPageChange(currentPage - 1)}
          icon={ChevronLeft}
          aria-label="Previous Page"
          className="font-bold text-xs"
        >
          Previous
        </Button>

        
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-8 h-8 flex items-center justify-center text-xs font-bold text-slate-400"
                >
                  ...
                </span>
              );
            }

            const isCurrent = currentPage === p;

            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange && onPageChange(p)}
                aria-current={isCurrent ? 'page' : undefined}
                className={`w-8.5 h-8.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange && currentPage < totalPages && onPageChange(currentPage + 1)}
          aria-label="Next Page"
          className="font-bold text-xs"
        >
          Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </nav>
  );
};

export default Pagination;
