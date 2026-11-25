import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Grid3X3,
  Map,
  Filter,
  Search,
  Compass,
  Building,
  CheckCircle2,
  BookmarkCheck,
  X,
  Layers
} from 'lucide-react';
import { PlotCard } from './PlotCard';
import { PlotDetailsModal } from './PlotDetailsModal';
import { PlotMapGrid } from './PlotMapGrid';
import { formatLakhs } from '../../utils/formatters';

export function InventoryView() {
  const { plots, projects } = useApp();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [sizeFilter, setSizeFilter] = useState('ALL');
  const [facingFilter, setFacingFilter] = useState('ALL');

  const filteredPlots = useMemo(() => {
    return plots.filter((plot) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNum = plot.plotNumber.toLowerCase().includes(q);
        const matchesProj = plot.projectName.toLowerCase().includes(q);
        if (!matchesNum && !matchesProj) return false;
      }

      // Status
      if (statusFilter !== 'ALL' && plot.status !== statusFilter) return false;

      // Project
      if (projectFilter !== 'ALL' && plot.projectId !== projectFilter) return false;

      // Facing
      if (facingFilter !== 'ALL' && plot.facing !== facingFilter) return false;

      // Size
      if (sizeFilter !== 'ALL') {
        const sqft = plot.areaSqFt;
        if (sizeFilter === '1200' && sqft !== 1200) return false;
        if (sizeFilter === '1500' && sqft !== 1500) return false;
        if (sizeFilter === '2400' && sqft !== 2400) return false;
        if (sizeFilter === '3500+' && sqft < 3000) return false;
      }

      return true;
    });
  }, [plots, searchQuery, statusFilter, projectFilter, sizeFilter, facingFilter]);

  const handleSelectPlot = (plot) => {
    setSelectedPlot(plot);
    setIsDetailsOpen(true);
  };

  // Counts
  const availableCount = plots.filter((p) => p.status === 'Available').length;
  const reservedCount = plots.filter((p) => p.status === 'Reserved').length;
  const soldCount = plots.filter((p) => p.status === 'Sold').length;

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setProjectFilter('ALL');
    setSizeFilter('ALL');
    setFacingFilter('ALL');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    statusFilter !== 'ALL' ||
    projectFilter !== 'ALL' ||
    sizeFilter !== 'ALL' ||
    facingFilter !== 'ALL';

  return (
    <div className="space-y-6">
      {/* Top Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Plot Inventory & Master Layout</h2>
          <p className="text-xs text-slate-500">
            Real-time land inventory across Greenfield Estates active developments
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto border border-slate-200">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>Card Grid</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              viewMode === 'map'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Master Plan Map</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase">Total Inventory</span>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{plots.length} Plots</p>
          <span className="text-[11px] text-slate-400">Across 3 projects</span>
        </div>
        <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200 shadow-2xs">
          <span className="text-[11px] font-medium text-emerald-800 uppercase">Available Plots</span>
          <p className="text-xl font-bold text-emerald-700 mt-0.5">{availableCount} Plots</p>
          <span className="text-[11px] text-emerald-600 font-medium">Ready for immediate booking</span>
        </div>
        <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200 shadow-2xs">
          <span className="text-[11px] font-medium text-amber-800 uppercase">Reserved (On Hold)</span>
          <p className="text-xl font-bold text-amber-700 mt-0.5">{reservedCount} Plots</p>
          <span className="text-[11px] text-amber-600 font-medium">Under token agreement</span>
        </div>
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase">Sold & Registered</span>
          <p className="text-xl font-bold text-slate-700 mt-0.5">{soldCount} Plots</p>
          <span className="text-[11px] text-slate-500 font-medium">Allotments completed</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3.5">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-100">
          {[
            { id: 'ALL', label: 'All Statuses', count: plots.length },
            { id: 'Available', label: 'Available', count: availableCount },
            { id: 'Reserved', label: 'Reserved', count: reservedCount },
            { id: 'Sold', label: 'Sold', count: soldCount }
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dropdowns Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search plot # (e.g. A-101)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Project */}
          <div>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div>
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All Plot Sizes</option>
              <option value="1200">1,200 sq.ft (30 × 40)</option>
              <option value="1500">1,500 sq.ft (30 × 50)</option>
              <option value="2400">2,400 sq.ft (40 × 60)</option>
              <option value="3500+">3,500+ sq.ft (Mansion)</option>
            </select>
          </div>

          {/* Facing */}
          <div className="flex items-center gap-2">
            <select
              value={facingFilter}
              onChange={(e) => setFacingFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All Facing Directions</option>
              <option value="East">East Facing (Vaastu)</option>
              <option value="North">North Facing (Vaastu)</option>
              <option value="West">West Facing</option>
              <option value="South">South Facing</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-2.5 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition shrink-0"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content View (Grid or Map) */}
      {viewMode === 'map' ? (
        <PlotMapGrid plots={filteredPlots} onSelectPlot={handleSelectPlot} />
      ) : (
        <>
          {filteredPlots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlots.map((plot) => (
                <PlotCard key={plot.id} plot={plot} onSelectPlot={handleSelectPlot} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Grid3X3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No plots found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No plots match your selected filters. Try clearing your search or adjusting the size and facing filters.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </>
      )}

      {/* Plot Details Modal */}
      <PlotDetailsModal
        plot={selectedPlot}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
}
