import React from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { Compass, Maximize2, BookmarkCheck, ChevronRight } from 'lucide-react';
import { formatLakhs, formatArea } from '../../utils/formatters';

export function PlotCard({ plot, onSelectPlot }) {
  const { navigateTo } = useApp();
  const areaInfo = formatArea(plot.areaSqFt);

  const handleQuickBook = (e) => {
    e.stopPropagation();
    navigateTo('booking', { plotId: plot.id });
  };

  return (
    <div
      onClick={() => onSelectPlot(plot)}
      className="enterprise-card p-4 sm:p-5 cursor-pointer flex flex-col justify-between group relative"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition tracking-tight">
                Plot {plot.plotNumber}
              </span>
              <Badge status={plot.status} size="xs" />
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">{plot.projectName}</p>
          </div>

          <div className="text-right">
            <span className="text-base font-semibold text-slate-900 block num-tabular">
              {formatLakhs(plot.totalPriceLakhs)}
            </span>
            <span className="text-[10px] text-slate-500 num-tabular">₹{plot.pricePerSqFt}/sq.ft</span>
          </div>
        </div>

        {/* Badges / Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
            <Compass className="w-3 h-3 text-blue-500" />
            {plot.facing} Facing
          </span>

          {plot.isCorner && (
            <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
              Corner Plot
            </span>
          )}

          {plot.isParkFacing && (
            <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
              Park Facing
            </span>
          )}
        </div>

        {/* Dimensions & Area */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Dimensions</span>
            <span className="font-semibold text-slate-700">{plot.dimensions}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Super Area</span>
            <span className="font-semibold text-slate-800">{areaInfo.combined}</span>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          <span>View Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </span>

        {plot.status === 'Available' ? (
          <button
            onClick={handleQuickBook}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-2xs active:scale-95 flex items-center gap-1"
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Book</span>
          </button>
        ) : (
          <span className="text-[11px] text-slate-400 font-medium">
            {plot.status === 'Reserved' ? `Held for ${plot.reservedBy?.split(' ')[0] || 'Buyer'}` : 'Allotted'}
          </span>
        )}
      </div>
    </div>
  );
}
