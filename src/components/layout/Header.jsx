import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Search,
  Bell,
  RotateCcw,
  Plus,
  BookmarkCheck,
  Building,
  CheckCircle2,
  Calendar,
  X
} from 'lucide-react';
import { timeAgo } from '../../utils/formatters';

export function Header({ onOpenAddLead }) {
  const {
    activeView,
    navigateTo,
    company,
    projects,
    selectedProjectFilter,
    setSelectedProjectFilter,
    setIsMobileMenuOpen,
    resetDemoData,
    activities,
    globalSearch,
    setGlobalSearch,
    leads,
    plots
  } = useApp();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const getPageTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return { title: 'Executive Sales Dashboard', subtitle: 'Overview of plot bookings, active leads, and team performance' };
      case 'leads':
        return { title: 'Leads & Pipeline Management', subtitle: 'Track, qualify, and convert potential land buyers' };
      case 'inventory':
        return { title: 'Plot Inventory & Master Layout', subtitle: 'Real-time availability, layout dimensions, and pricing' };
      case 'customer-details':
        return { title: 'Customer 360 Profile', subtitle: 'Comprehensive buyer timeline, site visit history, and notes' };
      case 'booking':
        return { title: 'Plot Booking & Allotment', subtitle: 'Step-by-step reservation workflow and token receipt generation' };
      case 'site-visits':
        return { title: 'Site Visits & Chauffeur Schedule', subtitle: 'Manage customer transport and on-ground plot inspections' };
      default:
        return { title: 'Real Estate CRM', subtitle: 'Greenfield Estates Sales Portal' };
    }
  };

  const { title, subtitle } = getPageTitle();

  // Search results
  const filteredLeads = globalSearch.trim()
    ? leads.filter(
        (l) =>
          l.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
          l.phone.includes(globalSearch) ||
          l.email.toLowerCase().includes(globalSearch.toLowerCase())
      ).slice(0, 3)
    : [];

  const filteredPlots = globalSearch.trim()
    ? plots.filter(
        (p) =>
          p.plotNumber.toLowerCase().includes(globalSearch.toLowerCase()) ||
          p.projectName.toLowerCase().includes(globalSearch.toLowerCase())
      ).slice(0, 3)
    : [];

  const hasSearchResults = filteredLeads.length > 0 || filteredPlots.length > 0;

  return (
    <header className="sticky top-0 z-30 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#ebe6df] px-4 sm:px-6 lg:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 lg:hidden transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif-luxury text-base sm:text-lg font-medium text-stone-900 truncate tracking-wide">
                {title}
              </h1>

              {/* Project Filter Selector */}
              <div className="hidden sm:inline-flex items-center">
                <select
                  value={selectedProjectFilter}
                  onChange={(e) => setSelectedProjectFilter(e.target.value)}
                  className="text-[11px] font-medium bg-white hover:bg-stone-50 text-stone-800 py-1 pl-2.5 pr-7 rounded-lg border border-[#ebe6df] focus:outline-hidden focus:ring-1 focus:ring-[#c5a880] cursor-pointer transition shadow-2xs"
                >
                  <option value="ALL">All Townships (3)</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Live Corporate Badge */}
              <span className="hidden xl:inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full badge-gold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
                RERA Registered • Karnataka
              </span>
            </div>
            <p className="text-xs text-stone-500 truncate hidden md:block font-light">{subtitle}</p>
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search buyers, plots, survey IDs (e.g., A-104)..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-white border border-[#ebe6df] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#c5a880]/20 focus:border-[#c5a880] transition shadow-2xs text-stone-900 placeholder:text-stone-400"
            />
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Search Dropdown */}
          {isSearchFocused && globalSearch.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 text-xs">
              {hasSearchResults ? (
                <div className="space-y-2">
                  {filteredLeads.length > 0 && (
                    <div>
                      <div className="px-2 py-1 font-semibold text-slate-400 uppercase text-[10px]">
                        Matching Leads
                      </div>
                      {filteredLeads.map((lead) => (
                        <div
                          key={lead.id}
                          onMouseDown={() => {
                            navigateTo('customer-details', { customerId: lead.id });
                            setGlobalSearch('');
                          }}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                        >
                          <div>
                            <span className="font-semibold text-slate-900">{lead.name}</span>
                            <span className="ml-2 text-slate-500">{lead.phone}</span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                            {lead.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {filteredPlots.length > 0 && (
                    <div>
                      <div className="px-2 py-1 font-semibold text-slate-400 uppercase text-[10px] border-t border-slate-100 pt-1">
                        Matching Plots
                      </div>
                      {filteredPlots.map((plot) => (
                        <div
                          key={plot.id}
                          onMouseDown={() => {
                            navigateTo('inventory');
                            setGlobalSearch('');
                          }}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                        >
                          <div>
                            <span className="font-semibold text-slate-900">
                              Plot {plot.plotNumber}
                            </span>
                            <span className="ml-2 text-slate-500">{plot.projectName}</span>
                          </div>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full ${
                              plot.status === 'Available'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {plot.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 text-center text-slate-500">
                  No leads or plots found matching "{globalSearch}".
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Book Plot Button */}
          <button
            onClick={() => navigateTo('booking')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-stone-800 border border-[#ebe6df] hover:border-[#c5a880] transition shadow-2xs"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-stone-600" />
            <span>Book Parcel</span>
          </button>

          {/* Add Lead Button */}
          <button
            onClick={onOpenAddLead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#c5a880] text-stone-950 hover:bg-[#b59567] transition shadow-xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Register Buyer</span>
            <span className="xs:hidden">Add</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={resetDemoData}
            title="Reset demo data to initial factory state"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-[#ebe6df] transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden xl:inline">Reset Demo</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition border border-[#ebe6df]"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-semibold text-slate-900 text-sm">Audit Stream</span>
                  <span className="text-[11px] text-slate-500">{activities.length} updates</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-2">
                  {activities.slice(0, 5).map((act) => (
                    <div key={act.id} className="py-2.5 flex items-start gap-3">
                      <div className="mt-0.5 p-1 rounded-full bg-slate-100 text-slate-700 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-900">{act.title}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                          {act.description}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">{timeAgo(act.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      navigateTo('dashboard');
                      setIsNotificationsOpen(false);
                    }}
                    className="text-xs text-slate-700 hover:text-slate-900 font-medium"
                  >
                    View All in Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
