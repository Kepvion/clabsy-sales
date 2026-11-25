import React, { useState } from 'react';
import { Badge } from '../common/Badge';
import { formatLakhs, formatArea, formatINR } from '../../utils/formatters';
import {
  Compass,
  Trees,
  Waves,
  Sparkles,
  ShieldCheck,
  Building,
  Maximize2,
  BookmarkCheck,
  CalendarCheck,
  Layers,
  Info,
  ArrowRight
} from 'lucide-react';

export function PlotMapGrid({ plots, onSelectPlot }) {
  const [selectedPhase, setSelectedPhase] = useState('ALL');
  const [hoveredPlot, setHoveredPlot] = useState(null);

  // Filter by phase if selected
  const displayPlots = selectedPhase === 'ALL'
    ? plots
    : plots.filter((p) => (p.phase || '').toLowerCase().includes(selectedPhase.toLowerCase()));

  // Groups of plots by layout avenues
  const bougainvilleaAvenue = displayPlots.filter(p => p.plotNumber.startsWith('A-'));
  const valleyGreensAvenue = displayPlots.filter(p => p.plotNumber.startsWith('E-'));
  const royalOrchardAvenue = displayPlots.filter(p => p.plotNumber.startsWith('R-'));

  const activeInspectorPlot = hoveredPlot || displayPlots.find(p => p.status === 'Available') || displayPlots[0];

  const renderPlotCell = (plot) => {
    const isHovered = hoveredPlot?.id === plot.id;
    let cardBorder = 'border-stone-200 hover:border-emerald-700/60 hover:bg-emerald-50/20 bg-white';
    let statusBadge = (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
        Available
      </span>
    );

    if (plot.status === 'Reserved') {
      cardBorder = 'border-[#ecd8bd] bg-[#faf6f0] hover:border-[#c5a880]';
      statusBadge = (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-900 bg-amber-100/70 px-1.5 py-0.5 rounded border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          Reserved
        </span>
      );
    } else if (plot.status === 'Sold') {
      cardBorder = 'border-stone-200 bg-stone-100/80 opacity-60 cursor-not-allowed';
      statusBadge = (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-stone-500 bg-stone-200/80 px-1.5 py-0.5 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
          Allotted
        </span>
      );
    }

    return (
      <div
        key={plot.id}
        onClick={() => {
          setHoveredPlot(plot);
          onSelectPlot(plot);
        }}
        onMouseEnter={() => setHoveredPlot(plot)}
        className={`p-3 rounded-lg border transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs flex flex-col justify-between min-h-[110px] ${cardBorder} ${
          isHovered ? 'ring-2 ring-stone-900 border-transparent shadow-sm' : ''
        }`}
      >
        {/* Plot Top Info */}
        <div>
          <div className="flex items-start justify-between gap-1">
            <span className="font-serif-luxury font-semibold text-sm text-stone-900 tracking-tight">{plot.plotNumber}</span>
            <div className="flex items-center gap-1">
              {plot.isCorner && (
                <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-stone-900 text-stone-100 uppercase tracking-wider">
                  Corner
                </span>
              )}
            </div>
          </div>
          <span className="text-[10px] text-stone-500 block mt-0.5 font-light">
            {plot.facing} Facing
          </span>
        </div>

        {/* Plot Bottom Pricing */}
        <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between">
          <span className="text-[11px] font-medium text-stone-600 num-tabular">{plot.areaSqFt} sq.ft</span>
          <span className="text-[11px] font-semibold text-stone-900 num-tabular">
            {formatLakhs(plot.totalPriceLakhs)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="enterprise-card p-5 sm:p-6 space-y-4">
      {/* CAD Map Header & Legend */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-stone-100 text-[#8c6832] border border-stone-200">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="font-serif-luxury text-base font-medium text-stone-900 tracking-tight">
              Township Master Layout Plan & Freehold Inventory
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-0.5 font-light">
            Survey No. 418/A • DTCP Approved Layout with 60ft Grand Arterial Boulevard and Landscaped Buffers.
          </p>
        </div>

        {/* Legend & Phase Selector */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Phase Filter */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg text-xs border border-stone-200">
            {['ALL', 'Bougainvillea', 'Valley Greens', 'Mango Grove'].map((ph) => (
              <button
                key={ph}
                onClick={() => setSelectedPhase(ph)}
                className={`px-3 py-1 rounded-md transition text-[11px] font-medium ${
                  selectedPhase === ph
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {ph === 'ALL' ? 'All Precincts' : ph}
              </button>
            ))}
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
              <span className="text-stone-600 font-medium">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
              <span className="text-stone-600 font-medium">Reserved</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
              <span className="text-stone-600 font-medium">Allotted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Architectural Master Plan Canvas */}
      <div className="p-4 sm:p-6 rounded-xl cad-grid-light border border-stone-300 relative overflow-hidden shadow-inner">
        {/* North Orientation Compass Indicator */}
        <div className="absolute top-4 right-4 z-10 flex flex-col items-center p-2 rounded-lg bg-white/95 border border-stone-200 shadow-2xs backdrop-blur-xs">
          <Compass className="w-5 h-5 text-[#8c6832]" />
          <span className="text-[9px] font-semibold text-stone-800 uppercase mt-0.5 tracking-wider">N</span>
        </div>

        {/* Grand Entrance Boulevard Banner */}
        <div className="mb-4 p-3 rounded-lg bg-white border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-800" />
            <span className="font-medium text-stone-800">
              Main Entrance Plaza • 24/7 Security Gatehouse & RERA Registry Post
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#8c6832] font-semibold tracking-wider">
            60 FT GRAND BOULEVARD (MAIN ARTERIAL ARTERY)
          </span>
        </div>

        {/* 60ft Grand Boulevard Asphalt Lane Marking */}
        <div className="road-divider-yellow my-3 opacity-90" title="60ft Arterial Road Centerline" />

        {/* Avenue 1: Bougainvillea Court */}
        {(selectedPhase === 'ALL' || selectedPhase === 'Bougainvillea') && (
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between px-1">
              <span className="font-serif-luxury text-sm font-semibold text-stone-900 tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#8c6832]" />
                Precinct 1: Bougainvillea Court (Greenfield Palm Meadows)
              </span>
              <span className="text-[10px] text-stone-500 font-mono">40 FT Wide Palm Avenue Road</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {bougainvilleaAvenue.map(renderPlotCell)}
            </div>

            {/* Avenue Road Markings */}
            <div className="road-divider my-2 opacity-60" />
          </div>
        )}

        {/* Central Amenities Zone: Sensory Park & Clubhouse */}
        <div className="my-6 p-5 rounded-xl bg-[#f2f6f3] border border-[#d2dfd5] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-lg bg-emerald-900/10 text-emerald-900 border border-emerald-800/20 shrink-0">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif-luxury text-base font-semibold text-stone-900">Central Sensory Botanical Park & Water Amphitheatre</h4>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded badge-forest">
                  3.2 Acres Green Buffer
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5 font-light">
                Preserved canopy trees, heritage organic orchards, eco-lake waterfront boardwalk, and children play meadow
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-emerald-900/15 pt-3 md:pt-0 md:pl-5 shrink-0">
            <div className="p-2.5 rounded-lg bg-stone-900/10 text-stone-800 border border-stone-800/20 shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-serif-luxury text-sm font-semibold text-stone-900">The Palm Pavilion Clubhouse</h5>
              <p className="text-[11px] text-stone-500 font-light">Infinity Pool • Tennis Courts • Wellness Spa</p>
            </div>
          </div>
        </div>

        {/* Avenue 2: Valley Greens Enclave */}
        {(selectedPhase === 'ALL' || selectedPhase === 'Valley Greens') && (
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between px-1">
              <span className="font-serif-luxury text-sm font-semibold text-stone-900 tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-700" />
                Precinct 2: Valley Greens Enclave (Greenfield Emerald Hills)
              </span>
              <span className="text-[10px] text-stone-500 font-mono">40 FT Lakefront Promenade</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {valleyGreensAvenue.map(renderPlotCell)}
            </div>

            {/* Lakefront Avenue Marking */}
            <div className="road-divider my-2 opacity-60" />
          </div>
        )}

        {/* Avenue 3: Mango Grove Enclave */}
        {(selectedPhase === 'ALL' || selectedPhase === 'Mango Grove') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="font-serif-luxury text-sm font-semibold text-stone-900 tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#8c6832]" />
                Precinct 3: Mango Grove Signature Parcels (Greenfield Royal Orchard)
              </span>
              <span className="text-[10px] text-stone-500 font-mono">45 FT Heritage Orchard Avenue</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {royalOrchardAvenue.map(renderPlotCell)}
            </div>
          </div>
        )}

        {/* Live Parcel Inspector HUD */}
        {activeInspectorPlot && (
          <div className="mt-6 p-5 rounded-xl bg-white border border-stone-300 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2.5 rounded-lg bg-stone-100 text-[#8c6832] border border-stone-200 shrink-0">
                <Maximize2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif-luxury font-semibold text-base sm:text-lg text-stone-900 tracking-tight">
                    Parcel Dossier: Plot {activeInspectorPlot.plotNumber}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                      activeInspectorPlot.status === 'Available'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : activeInspectorPlot.status === 'Reserved'
                        ? 'badge-gold'
                        : 'bg-stone-100 text-stone-600 border border-stone-200'
                    }`}
                  >
                    {activeInspectorPlot.status}
                  </span>
                  {activeInspectorPlot.isCorner && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200">
                      Corner Premium (+{activeInspectorPlot.cornerPremiumPercent}%)
                    </span>
                  )}
                </div>
                <div className="text-xs text-stone-600 mt-1 flex flex-wrap items-center gap-3 font-light">
                  <span>Dimensions: {activeInspectorPlot.dimensions} ({activeInspectorPlot.areaSqFt} sq.ft / {activeInspectorPlot.areaSqYd} sq.yd)</span>
                  <span>•</span>
                  <span>Orientation: {activeInspectorPlot.facing} Facing</span>
                  <span>•</span>
                  <span>Base Rate: ₹{activeInspectorPlot.pricePerSqFt}/sq.ft</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-stone-200">
              <div className="text-left md:text-right">
                <span className="text-[10px] text-stone-500 uppercase block font-medium">Agreement Value</span>
                <span className="font-serif-luxury text-xl font-semibold text-stone-900 num-tabular">
                  {formatLakhs(activeInspectorPlot.totalPriceLakhs)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onSelectPlot(activeInspectorPlot)}
                className="px-4 py-2.5 rounded-lg text-xs font-semibold text-stone-950 bg-[#c5a880] hover:bg-[#b59567] transition shadow-xs flex items-center gap-1.5 active:scale-95"
              >
                <span>Inspect Parcel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* South Perimeter Infrastructure */}
        <div className="mt-5 pt-3 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-500 gap-2">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-[#8c6832]" />
            <span>Underground Stormwater Drainage & High-Speed Fiber Ducting</span>
          </div>
          <span className="text-[11px] text-stone-500 font-mono">
            Survey No. 418/A • DTCP Approved & RERA Registered Layout
          </span>
        </div>
      </div>
    </div>
  );
}
