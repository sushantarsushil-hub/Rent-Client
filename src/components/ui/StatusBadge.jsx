import React from 'react';
import { CheckCircle2, Clock, XCircle, Sparkles } from 'lucide-react';

export const StatusBadge = ({ status = 'Approved', className = '' }) => {
  const normalized = (status || '').toLowerCase();

  const badgeConfig = {
    approved: {
      label: 'Approved',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-300/80 shadow-xs shadow-emerald-500/10',
      icon: CheckCircle2,
      dot: 'bg-emerald-500',
    },
    available: {
      label: 'Available',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-300/80 shadow-xs shadow-emerald-500/10',
      icon: CheckCircle2,
      dot: 'bg-emerald-500',
    },
    pending: {
      label: 'Pending Review',
      bg: 'bg-amber-50 text-amber-800 border-amber-300/80 shadow-xs shadow-amber-500/10',
      icon: Clock,
      dot: 'bg-amber-500 animate-pulse',
    },
    rejected: {
      label: 'Rejected',
      bg: 'bg-rose-50 text-rose-800 border-rose-300/80 shadow-xs shadow-rose-500/10',
      icon: XCircle,
      dot: 'bg-rose-500',
    },
    confirmed: {
      label: 'Confirmed',
      bg: 'bg-blue-50 text-blue-800 border-blue-300/80 shadow-xs shadow-blue-500/10',
      icon: CheckCircle2,
      dot: 'bg-blue-500',
    },
    completed: {
      label: 'Completed',
      bg: 'bg-slate-100 text-slate-800 border-slate-300 shadow-2xs',
      icon: Sparkles,
      dot: 'bg-slate-500',
    },
  };

  const config = badgeConfig[normalized] || {
    label: status,
    bg: 'bg-indigo-50 text-indigo-800 border-indigo-300 shadow-2xs',
    icon: Sparkles,
    dot: 'bg-indigo-500',
  };

  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold border transition-all ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <IconComponent className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
