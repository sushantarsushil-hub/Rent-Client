import React from 'react';
import { Sparkles } from 'lucide-react';

export const SectionHeading = ({
  badge,
  title,
  subtitle,
  center = false,
  action = null,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-end justify-between gap-4 ${
        center ? 'text-center items-center justify-center' : ''
      } ${className}`}
    >
      <div className={`space-y-2 max-w-2xl ${center ? 'mx-auto' : ''}`}>
        {badge && (
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[11px] font-extrabold uppercase tracking-wider border border-blue-200/80 shadow-2xs ${
              center ? 'mx-auto' : ''
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{badge}</span>
          </div>
        )}
        {title && (
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="shrink-0 pt-2 md:pt-0">{action}</div>}
    </div>
  );
};

export default SectionHeading;
