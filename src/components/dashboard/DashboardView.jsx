import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  CalendarCheck,
  BookmarkCheck,
  IndianRupee,
  TrendingUp,
  ArrowRight,
  Plus,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Sparkles
} from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { SalesChart } from './SalesChart';
import { AgentLeaderboard } from './AgentLeaderboard';
import { formatINR, formatLakhs, timeAgo } from '../../utils/formatters';

export function DashboardView({ onOpenAddLead }) {
  const {
    company,
    projects,
    leads,
    plots,
    siteVisits,
    bookings,
    activities,
    navigateTo,
    setSelectedCustomerId,
    selectedProjectFilter,
    setSelectedProjectFilter
  } = useApp();

  const activeProject = selectedProjectFilter !== 'ALL'
    ? projects.find((p) => p.id === selectedProjectFilter)
    : null;

  // Filtered collections based on project selection
  const filteredPlots = activeProject ? plots.filter((p) => p.projectId === activeProject.id) : plots;
  const filteredLeads = activeProject ? leads.filter((l) => l.preferredProjectId === activeProject.id) : leads;
  const filteredVisits = activeProject ? siteVisits.filter((s) => s.projectId === activeProject.id) : siteVisits;
  const filteredBookings = activeProject ? bookings.filter((b) => b.projectId === activeProject.id) : bookings;

  // Metrics Calculations
  const totalLeads = filteredLeads.length;
  const activeLeads = filteredLeads.filter((l) => l.status !== 'Lost' && l.status !== 'Booked').length;
  const scheduledVisits = filteredVisits.filter((s) => s.status === 'Confirmed').length;
  const reservedPlots = filteredPlots.filter((p) => p.status === 'Reserved').length;
  const soldPlots = filteredPlots.filter((p) => p.status === 'Sold').length;
  const availablePlots = filteredPlots.filter((p) => p.status === 'Available').length;

  // Total Booking value across confirmed bookings
  const totalBookedValue = filteredBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalBookedCr = (totalBookedValue / 10000000).toFixed(2);

  // Conversion rate: Booked / Total non-new leads
  const bookedCount = filteredLeads.filter((l) => l.status === 'Booked').length;
  const conversionRate = totalLeads > 0 ? ((bookedCount / totalLeads) * 100).toFixed(1) : '28.4';

  // Pipeline stages count
  const pipelineStages = [
    { label: 'New', count: filteredLeads.filter((l) => l.status === 'New').length, color: 'bg-blue-500' },
    {
      label: 'Contacted',
      count: filteredLeads.filter((l) => l.status === 'Contacted').length,
      color: 'bg-cyan-500'
    },
    {
      label: 'Site Visit',
      count: filteredLeads.filter((l) => l.status === 'Site Visit Scheduled').length,
      color: 'bg-indigo-500'
    },
    {
      label: 'Negotiation',
      count: filteredLeads.filter((l) => l.status === 'In Negotiation').length,
      color: 'bg-amber-500'
    },
    {
      label: 'Booked',
      count: filteredLeads.filter((l) => l.status === 'Booked').length,
      color: 'bg-emerald-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Editorial Luxury Developer Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-800 shadow-md bg-stone-950 text-white">
        {/* Background Architectural Photo with Dark Luxury Vignette */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/90 to-stone-950/60" />

        <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900/80 text-[#c5a880] text-[11px] font-medium tracking-wider uppercase border border-[#c5a880]/30 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
              <span>Greenfield Estates • Developer Sales Portal</span>
            </div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal tracking-wide text-stone-100 leading-tight">
              Curated Villa Plots & Gated Enclaves
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-2 font-light leading-relaxed max-w-xl">
              Official sales allocation system for Bengaluru Airport Corridor, Sarjapur, and Whitefield townships.
              Currently tracking <strong className="text-white font-medium">{availablePlots} premium parcels</strong> and <strong className="text-white font-medium">{scheduledVisits} scheduled chauffeur visits</strong>.
            </p>
          </div>

          {/* Quick Luxury Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => navigateTo('inventory')}
              className="px-4 py-2.5 rounded-lg bg-stone-900/80 hover:bg-stone-800 text-stone-200 text-xs font-medium transition border border-stone-700/80 flex items-center gap-2 shadow-xs active:scale-95"
            >
              <MapPin className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Master Layout Plan</span>
            </button>
            <button
              onClick={onOpenAddLead}
              className="px-4 py-2.5 rounded-lg bg-stone-900/80 hover:bg-stone-800 text-stone-200 text-xs font-medium transition border border-stone-700/80 flex items-center gap-2 shadow-xs active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Register Buyer</span>
            </button>
            <button
              onClick={() => navigateTo('booking')}
              className="px-4 py-2.5 rounded-lg bg-[#c5a880] hover:bg-[#b59567] text-stone-950 text-xs font-semibold transition flex items-center gap-2 shadow-md shadow-amber-950/20 active:scale-95"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-stone-950" />
              <span>Initiate Allotment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Project Filter Notification */}
      {activeProject && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/80 text-xs text-stone-800">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-[#8c6832]" />
            <span>
              Filtered Township: <strong className="font-semibold text-stone-900">{activeProject.name}</strong> ({activeProject.location})
            </span>
          </div>
          <button
            onClick={() => setSelectedProjectFilter('ALL')}
            className="px-3 py-1 rounded-md text-[11px] font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 transition shadow-2xs"
          >
            Show All Townships
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Buyer Inquiries"
          value={totalLeads}
          subtext={`${activeLeads} prospective buyers in active negotiation`}
          trend="+18% MoM"
          trendDirection="up"
          icon={Users}
          iconColor="text-stone-700 bg-stone-100 border-stone-200"
          onClick={() => navigateTo('leads')}
        />

        <StatCard
          title="Chauffeur Site Inspections"
          value={scheduledVisits}
          subtext="Private on-ground plot surveys scheduled"
          trend="High Interest"
          trendDirection="up"
          icon={CalendarCheck}
          iconColor="text-[#8c6832] bg-amber-50 border-amber-200/80"
          onClick={() => navigateTo('site-visits')}
        />

        <StatCard
          title="Parcels Allotted & Reserved"
          value={`${reservedPlots + soldPlots}`}
          subtext={`${availablePlots} freehold parcels remaining in current phase`}
          trend={`${Math.round(((reservedPlots + soldPlots) / plots.length) * 100)}% Subscribed`}
          trendDirection="up"
          icon={BookmarkCheck}
          iconColor="text-emerald-800 bg-emerald-50 border-emerald-200/80"
          onClick={() => navigateTo('inventory')}
        />

        <StatCard
          title="Gross Portfolio Realization"
          value={`₹${totalBookedCr} Cr`}
          subtext="Across Greenfield Palm, Emerald & Orchard"
          trend={`${conversionRate}% Conversion`}
          trendDirection="up"
          icon={IndianRupee}
          iconColor="text-stone-900 bg-[#faf5ee] border-[#ecd8bd]"
          onClick={() => navigateTo('booking')}
        />
      </div>

      {/* Milestone Realization & Signature Plot Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Progress Bar (2 cols) */}
        <div className="lg:col-span-2 enterprise-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#8c6832]" />
                  <span>Q3 Financial Target Realization</span>
                </span>
                <p className="font-serif-luxury text-lg text-stone-900 mt-0.5 font-medium">
                  Greenfield Estates Annual Sales Velocity
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs font-medium text-stone-900 bg-[#faf5ee] px-3 py-1 rounded-md border border-[#ecd8bd]">
                  85.0% Realized • ₹6.80 Cr of ₹8.00 Cr
                </span>
              </div>
            </div>

            {/* Bronze/Gold Precision Meter */}
            <div className="relative w-full h-3 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-stone-900 via-stone-800 to-[#c5a880] transition-all duration-500"
                style={{ width: '85%' }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 text-[11px] text-stone-500 pt-3 border-t border-stone-100">
            <span>Base: ₹0.00 Cr</span>
            <span className="font-medium text-stone-700">₹1.20 Cr to quarterly milestone • 5 days remaining</span>
            <span className="font-medium text-stone-900">Target: ₹8.00 Cr</span>
          </div>
        </div>

        {/* Featured Signature Plot Spotlight (1 col) */}
        <div className="enterprise-card p-5 flex flex-col justify-between relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md badge-gold">
                Signature Villa Lot
              </span>
              <span className="text-xs font-semibold text-stone-900 num-tabular">₹62.82 Lakhs</span>
            </div>
            <h4 className="font-serif-luxury text-base text-stone-900 mt-2.5 font-medium">
              Plot A-104 • Bougainvillea Court
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">1,500 sq.ft North-facing Corner Parcel</p>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs mt-3">
            <span className="text-stone-500">Interested: <strong className="font-medium text-stone-900">Rajesh Varma</strong></span>
            <button
              onClick={() => navigateTo('customer-details', { customerId: 'lead-1' })}
              className="text-[#8c6832] font-medium hover:text-stone-950 flex items-center gap-1 transition"
            >
              <span>Customer Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sales Pipeline Funnel Strip */}
      <div className="enterprise-card p-5">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Buyer Pipeline Velocity
            </span>
            <p className="text-xs text-stone-500">Distribution of qualified prospects across sales milestones</p>
          </div>
          <button
            onClick={() => navigateTo('leads')}
            className="text-xs font-medium text-[#8c6832] hover:text-stone-950 flex items-center gap-1 transition"
          >
            <span>View All Buyers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {pipelineStages.map((stage) => (
            <div
              key={stage.label}
              onClick={() => navigateTo('leads')}
              className="p-3.5 rounded-xl bg-stone-50/80 hover:bg-stone-100/80 border border-stone-200/80 cursor-pointer transition shadow-2xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-600 group-hover:text-stone-900 transition">{stage.label}</span>
                <span className={`w-2 h-2 rounded-full ${stage.color}`} />
              </div>
              <div className="mt-2 text-xl font-semibold text-stone-900 num-tabular">{stage.count}</div>
              <span className="text-[10px] text-stone-400">Buyers</span>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Row: Sales Chart & Project Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Performance Chart (2 cols) */}
        <div className="lg:col-span-2">
          <SalesChart />
        </div>

        {/* Greenfield Estates Active Townships Showcase (1 col) */}
        <div className="enterprise-card p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="font-serif-luxury text-base font-medium text-stone-900 tracking-tight flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#8c6832]" />
                <span>Township Portfolios</span>
              </h2>
              <span className="text-[11px] font-medium text-stone-500">3 Gated Developments</span>
            </div>

            <div className="mt-4 space-y-3.5">
              {projects.map((proj) => {
                const projPlots = plots.filter((p) => p.projectId === proj.id);
                const projAvailable = projPlots.filter((p) => p.status === 'Available').length;
                const projReserved = projPlots.filter((p) => p.status === 'Reserved').length;

                return (
                  <div
                    key={proj.id}
                    onClick={() => navigateTo('inventory')}
                    className="p-3 rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50/80 transition cursor-pointer group flex items-center gap-3.5"
                  >
                    <img
                      src={proj.coverImage}
                      alt={proj.name}
                      className="w-14 h-14 rounded-lg object-cover shrink-0 border border-stone-200 shadow-2xs"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-semibold text-stone-900 group-hover:text-[#8c6832] transition truncate">
                          {proj.name}
                        </h4>
                        <span className="text-[10px] font-semibold text-stone-900 num-tabular shrink-0">
                          ₹{proj.baseRatePerSqFt}/sq.ft
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 truncate mt-0.5">
                        {proj.location}
                      </p>

                      <div className="mt-1.5 flex items-center gap-2 text-[10px] text-stone-500">
                        <span className="text-emerald-800 font-medium">{projAvailable} Free</span>
                        <span>•</span>
                        <span className="text-amber-800 font-medium">{projReserved} Reserved</span>
                        <span>•</span>
                        <span>{proj.totalAcres} Acres</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => navigateTo('inventory')}
            className="w-full mt-4 py-2 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium transition text-center"
          >
            Explore Township Master Layout →
          </button>
        </div>
      </div>

      {/* Bottom Row: Agent Leaderboard & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Leaderboard (2 cols) */}
        <div className="lg:col-span-2">
          <AgentLeaderboard />
        </div>

        {/* Live Activity Stream (1 col) */}
        <div className="enterprise-card p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="font-serif-luxury text-base font-medium text-stone-900 tracking-tight flex items-center gap-2">
                <Clock className="w-4 h-4 text-stone-500" />
                <span>Executive Activity Stream</span>
              </h2>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md badge-forest">
                Audit Trail
              </span>
            </div>

            <div className="mt-4 divide-y divide-stone-100 max-h-96 overflow-y-auto">
              {activities.slice(0, 6).map((activity) => (
                <div key={activity.id} className="py-3 flex items-start gap-3">
                  <div className="mt-0.5 p-1 rounded-full bg-stone-100 text-stone-700 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-stone-900 truncate">{activity.title}</p>
                    <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed font-light">
                      {activity.description}
                    </p>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-stone-400">
                      <span>By {activity.author}</span>
                      <span>{timeAgo(activity.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 text-center">
            <span className="text-[11px] text-stone-400 font-light">
              RERA Compliant Sales Ledger • Synchronized with Greenfield Estates Cloud
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
