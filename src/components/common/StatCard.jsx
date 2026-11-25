import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function StatCard({
  title,
  value,
  subtext,
  trend,
  trendDirection = 'up',
  icon: Icon,
  iconColor = 'text-stone-700 bg-stone-100 border-stone-200/80',
  onClick
}) {
  return (
    <div
      onClick={onClick}
      className={`enterprise-card p-5 group ${
        onClick ? 'cursor-pointer hover:border-[#c5a880]/60 active:scale-[0.99]' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-lg border shadow-2xs ${iconColor}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="font-serif-luxury text-3xl font-medium tracking-tight text-stone-900 num-tabular">{value}</div>
      </div>

      {(trend || subtext) && (
        <div className="mt-2.5 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center text-[11px] font-semibold ${
                trendDirection === 'up' ? 'text-emerald-800' : 'text-rose-700'
              }`}
            >
              {trendDirection === 'up' ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {trend}
            </span>
          )}
          {subtext && <span className="text-stone-500 truncate text-[11px] font-light">{subtext}</span>}
        </div>
      )}
    </div>
  );
}
