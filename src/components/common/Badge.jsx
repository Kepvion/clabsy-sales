import React from 'react';

export function Badge({ status, size = 'sm', children }) {
  const normalized = (status || children || '').toString().toLowerCase().trim();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (normalized === 'available') {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium';
    dotColor = 'bg-emerald-500';
  } else if (normalized === 'reserved') {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-200 font-medium';
    dotColor = 'bg-amber-500';
  } else if (normalized === 'sold') {
    colorClasses = 'bg-slate-100 text-slate-500 border-slate-200 font-medium';
    dotColor = 'bg-slate-400';
  } else if (normalized === 'new') {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200 font-medium';
    dotColor = 'bg-blue-500';
  } else if (normalized === 'contacted') {
    colorClasses = 'bg-sky-50 text-sky-700 border-sky-200 font-medium';
    dotColor = 'bg-sky-500';
  } else if (normalized.includes('site visit') || normalized === 'confirmed') {
    colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200 font-medium';
    dotColor = 'bg-indigo-500';
  } else if (normalized.includes('negotiation')) {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-200 font-medium';
    dotColor = 'bg-amber-500';
  } else if (normalized === 'booked' || normalized === 'completed') {
    colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-medium';
    dotColor = 'bg-emerald-600';
  } else if (normalized === 'lost' || normalized === 'cancelled') {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200 font-medium';
    dotColor = 'bg-rose-500';
  }

  const sizeClasses = size === 'xs'
    ? 'text-[11px] px-1.5 py-0.2'
    : size === 'md'
    ? 'text-xs px-2.5 py-1'
    : 'text-xs px-2 py-0.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${colorClasses} ${sizeClasses} transition-all`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{children || status}</span>
    </span>
  );
}
