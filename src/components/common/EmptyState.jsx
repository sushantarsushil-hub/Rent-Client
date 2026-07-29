import React from 'react';
import { FolderOpen } from 'lucide-react';
import Button from '../ui/Button';

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No properties or records found',
  description = 'There are no items matching your criteria at this moment.',
  actionText = null,
  onAction = null,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-4 ${className}`}
    >
      <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center border border-slate-200 shadow-2xs">
        <Icon className="w-7 h-7 shrink-0 stroke-[2.2]" />
      </div>
      <div className="space-y-1.5 max-w-md">
        <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">{description}</p>
      </div>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-2 font-bold">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
