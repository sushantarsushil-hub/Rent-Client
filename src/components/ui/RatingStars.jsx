import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 5, reviewsCount = null, size = 'sm', showNumeric = true }) => {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <div className="inline-flex items-center gap-1">
      <Star className={`${iconSize} text-amber-500 fill-amber-500 shrink-0`} />
      {showNumeric && (
        <span className="text-xs font-bold text-slate-800 ml-0.5">
          {Number(rating).toFixed(1)}
        </span>
      )}
      {reviewsCount !== null && (
        <span className="text-xs font-normal text-slate-500">({reviewsCount})</span>
      )}
    </div>
  );
};

export default RatingStars;
