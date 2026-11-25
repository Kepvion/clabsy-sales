import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import {
  Compass,
  Maximize2,
  BookmarkCheck,
  CalendarCheck,
  CheckCircle2,
  Building,
  MapPin,
  ShieldCheck,
  FileText,
  IndianRupee
} from 'lucide-react';
import { formatINR, formatLakhs, formatArea } from '../../utils/formatters';

export function PlotDetailsModal({ plot, isOpen, onClose }) {
  const { navigateTo, projects } = useApp();

  if (!plot) return null;

  const project = projects.find((p) => p.id === plot.projectId);
  const areaInfo = formatArea(plot.areaSqFt);

  // Price calculations
  const baseCost = Math.round(plot.areaSqFt * (plot.pricePerSqFt - (project?.infrastructureChargesPerSqFt || 250)));
  const infraCost = Math.round(plot.areaSqFt * (project?.infrastructureChargesPerSqFt || 250));
  const clubhouseCost = project?.clubhouseCharges || 150000;
  const plcCost = plot.isCorner ? Math.round((baseCost * (plot.cornerPremiumPercent || 10)) / 100) : 0;
  const calculatedTotal = baseCost + infraCost + clubhouseCost + plcCost;

  const handleBookPlot = () => {
    onClose();
    navigateTo('booking', { plotId: plot.id });
  };

  const handleScheduleVisit = () => {
    onClose();
    navigateTo('site-visits', { plotId: plot.id });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Plot ${plot.plotNumber} — ${plot.projectName}`}
      subtitle={`${plot.phase || 'Master Layout'} • RERA Approved`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Top Status & Price Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200/90 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Badge status={plot.status} size="md" />
              {plot.isCorner && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Corner Plot (+{plot.cornerPremiumPercent}%)
                </span>
              )}
              {plot.isParkFacing && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Park Facing
                </span>
              )}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Plot Dimensions: <strong className="text-slate-800">{plot.dimensions}</strong> ({areaInfo.combined})
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] text-slate-400 uppercase font-medium">All-Inclusive Price</span>
            <div className="text-2xl font-bold text-slate-900">
              {formatLakhs(plot.totalPriceLakhs)}
            </div>
            <span className="text-xs text-slate-500">₹{plot.pricePerSqFt} / sq.ft</span>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Facing Direction</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              {plot.facing} Facing
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Road Width</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">
              {plot.roadWidthFt} ft Wide Road
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Plot Area</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">
              {plot.areaSqFt} sq.ft
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Square Yards</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">
              {plot.areaSqYd} sq.yd
            </span>
          </div>
        </div>

        {/* Cost Sheet Breakdown */}
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Transparent Pricing Breakdown
            </span>
            <span className="text-[11px] text-slate-500">Standard Greenfield Estates Schedule</span>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-slate-600">Base Land Value ({plot.areaSqFt} sq.ft)</span>
              <span className="font-medium text-slate-900">{formatINR(baseCost)}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-slate-600">Infrastructure Development Charges</span>
              <span className="font-medium text-slate-900">{formatINR(infraCost)}</span>
            </div>
            {plcCost > 0 && (
              <div className="flex items-center justify-between px-4 py-2.5 bg-blue-50/40">
                <span className="text-blue-900">Corner / Prime Location Charges (PLC)</span>
                <span className="font-medium text-blue-900">{formatINR(plcCost)}</span>
              </div>
            )}
            <div className="flex items-center justify-between px-4 py-2.5">
              <span className="text-slate-600">Clubhouse & Community Amenities Fee</span>
              <span className="font-medium text-slate-900">{formatINR(clubhouseCost)}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 font-bold text-sm">
              <span className="text-slate-900">Total Agreement Value</span>
              <span className="text-blue-700 font-bold">{formatLakhs(plot.totalPriceLakhs)}</span>
            </div>
          </div>
        </div>

        {/* Status specific context */}
        {plot.status === 'Reserved' && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <div>
              <strong>Currently Under Reservation:</strong> Held by {plot.reservedBy || 'Customer'} on {plot.reservedDate || 'recently'}.
            </div>
          </div>
        )}

        {plot.status === 'Sold' && (
          <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700">
            <strong>Sold & Registered:</strong> Allotted to {plot.soldTo || 'Customer'} on {plot.soldDate || 'recently'}.
          </div>
        )}

        {/* Features list */}
        {plot.features && (
          <div>
            <span className="text-xs font-semibold text-slate-700 block mb-2">
              Plot Highlights & Infrastructure
            </span>
            <div className="flex flex-wrap gap-2">
              {plot.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {feat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Close
          </button>

          {plot.status === 'Available' && (
            <>
              <button
                type="button"
                onClick={handleScheduleVisit}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition flex items-center gap-1.5"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Schedule Visit</span>
              </button>

              <button
                type="button"
                onClick={handleBookPlot}
                className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>Book This Plot Now</span>
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
