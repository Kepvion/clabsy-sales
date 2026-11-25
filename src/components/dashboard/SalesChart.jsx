import React, { useState } from 'react';
import { formatINR } from '../../utils/formatters';

export function SalesChart() {
  const [activeTab, setActiveTab] = useState('revenue'); // 'revenue' | 'plots'
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const monthlyData = [
    { month: 'May', revenueCr: 2.4, targetCr: 2.0, plots: 3 },
    { month: 'Jun', revenueCr: 3.1, targetCr: 2.5, plots: 4 },
    { month: 'Jul', revenueCr: 2.8, targetCr: 2.8, plots: 3 },
    { month: 'Aug', revenueCr: 4.5, targetCr: 3.5, plots: 6 },
    { month: 'Sep', revenueCr: 5.2, targetCr: 4.0, plots: 7 },
    { month: 'Oct', revenueCr: 6.8, targetCr: 5.0, plots: 9 } // Current month peak
  ];

  const maxRevenue = 8.0;
  const maxPlots = 10;

  return (
    <div className="enterprise-card p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 tracking-tight">Sales & Bookings Performance</h2>
          <p className="text-xs text-slate-500">Monthly booking volume and realization against quarterly targets.</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('revenue')}
            className={`px-2.5 py-1 rounded-md transition font-medium ${
              activeTab === 'revenue'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Booking Value (₹ Cr)
          </button>
          <button
            onClick={() => setActiveTab('plots')}
            className={`px-2.5 py-1 rounded-md transition font-medium ${
              activeTab === 'plots'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Plots Allotted (Qty)
          </button>
        </div>
      </div>

      {/* Highlights summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 my-4 p-3.5 rounded-lg bg-slate-50 border border-slate-200">
        <div>
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Oct Realization</span>
          <p className="text-lg font-semibold text-slate-900 mt-0.5 num-tabular">₹6.80 Cr</p>
          <span className="text-[11px] text-emerald-700 font-medium">+36% vs Target</span>
        </div>
        <div>
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">YTD Volume</span>
          <p className="text-lg font-semibold text-slate-900 mt-0.5 num-tabular">₹24.8 Cr</p>
          <span className="text-[11px] text-slate-600">32 Plots Allotted</span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Average Ticket Size</span>
          <p className="text-lg font-semibold text-slate-900 mt-0.5 num-tabular">₹77.5 L</p>
          <span className="text-[11px] text-slate-600">1,850 sq.ft median</span>
        </div>
      </div>

      {/* Chart Canvas / Visual Bar Graph */}
      <div className="relative pt-6 pb-2">
        <div className="h-48 sm:h-56 flex items-end justify-between gap-2 sm:gap-6 px-2">
          {monthlyData.map((item, idx) => {
            const isHovered = hoveredIndex === idx;
            const heightPercent =
              activeTab === 'revenue'
                ? (item.revenueCr / maxRevenue) * 100
                : (item.plots / maxPlots) * 100;

            const targetHeightPercent =
              activeTab === 'revenue' ? (item.targetCr / maxRevenue) * 100 : null;

            return (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip */}
                <div
                  className={`absolute -top-3 transform -translate-x-1/2 bg-slate-900 text-white text-[11px] py-1 px-2.5 rounded-lg shadow-lg pointer-events-none transition-all duration-150 z-10 whitespace-nowrap ${
                    isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                  style={{
                    left: `${((idx + 0.5) / monthlyData.length) * 100}%`
                  }}
                >
                  <div className="font-semibold">{item.month} 2026</div>
                  <div>Revenue: ₹{item.revenueCr} Cr</div>
                  <div>Plots: {item.plots} units</div>
                  {activeTab === 'revenue' && (
                    <div className="text-emerald-300 text-[10px]">Target: ₹{item.targetCr} Cr</div>
                  )}
                </div>

                {/* Bars Container */}
                <div className="w-full max-w-[42px] relative flex items-end justify-center h-full">
                  {/* Background grid guide line */}
                  <div className="absolute inset-x-0 bottom-0 top-0 border-x border-slate-100 -z-10" />

                  {/* Target reference mark */}
                  {targetHeightPercent && (
                    <div
                      className="absolute w-full border-t-2 border-dashed border-slate-300 z-10"
                      style={{ bottom: `${targetHeightPercent}%` }}
                      title={`Target: ₹${item.targetCr} Cr`}
                    />
                  )}

                  {/* Primary Bar */}
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      idx === monthlyData.length - 1
                        ? 'bg-blue-600 group-hover:bg-blue-500 shadow-md shadow-blue-500/20'
                        : 'bg-slate-700/80 group-hover:bg-blue-600'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                {/* Month Label */}
                <span
                  className={`mt-3 text-xs font-medium transition ${
                    idx === monthlyData.length - 1
                      ? 'text-blue-600 font-bold'
                      : 'text-slate-500 group-hover:text-slate-800'
                  }`}
                >
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-xs bg-blue-600" />
            <span>Actual Bookings (₹ Cr)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-slate-400" />
            <span>Quarterly Target</span>
          </div>
        </div>
      </div>
    </div>
  );
}
