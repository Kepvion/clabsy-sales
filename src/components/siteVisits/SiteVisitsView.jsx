import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { ScheduleVisitModal } from '../customers/ScheduleVisitModal';
import {
  CalendarCheck,
  Plus,
  Car,
  Phone,
  User,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Filter,
  Search
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export function SiteVisitsView() {
  const { siteVisits, updateSiteVisitStatus, navigateTo, leads } = useApp();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const filteredVisits = siteVisits.filter((v) => {
    if (statusFilter !== 'ALL' && v.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = v.customerName.toLowerCase().includes(q);
      const matchesProj = v.projectName.toLowerCase().includes(q);
      const matchesPhone = v.phone.includes(q);
      if (!matchesName && !matchesProj && !matchesPhone) return false;
    }
    return true;
  });

  const confirmedCount = siteVisits.filter((v) => v.status === 'Confirmed').length;
  const completedCount = siteVisits.filter((v) => v.status === 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Site Visits & Chauffeur Logistics
          </h2>
          <p className="text-xs text-slate-500">
            Coordinate customer ground inspections, vehicle pickups, and plot walkthroughs
          </p>
        </div>

        <button
          onClick={() => setIsScheduleOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Site Visit</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Upcoming Scheduled</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{confirmedCount} Visits</p>
          <span className="text-xs text-blue-600 font-medium">Chauffeur assigned</span>
        </div>

        <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 shadow-2xs">
          <span className="text-xs font-semibold text-emerald-800 uppercase">Completed Walkthroughs</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{completedCount} Visits</p>
          <span className="text-xs text-emerald-600 font-medium">High conversion feedback</span>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Logged Visits</span>
          <p className="text-2xl font-bold text-slate-700 mt-1">{siteVisits.length} Records</p>
          <span className="text-xs text-slate-400">Greenfield Estates ground operations</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status filter tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['ALL', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                statusFilter === status
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'ALL' ? 'All Visits' : status}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search visitor, phone, project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>
      </div>

      {/* Visits Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVisits.map((visit) => (
          <div
            key={visit.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{visit.customerName}</h3>
                    <Badge status={visit.status} size="xs" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span className="font-mono">{visit.phone}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 block">
                    {visit.projectName.split(' ')[1] || 'Greenfield'}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Plot {visit.plotNumber || 'Site'}
                  </span>
                </div>
              </div>

              {/* Date & Time */}
              <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>{formatDateTime(visit.scheduledDateTime)}</span>
                </div>
                <span className="text-slate-500">Agent: {visit.agentName}</span>
              </div>

              {/* Chauffeur Details */}
              {visit.pickupRequired ? (
                <div className="mt-3 p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900 text-[11px]">
                    <Car className="w-3.5 h-3.5 text-blue-600" />
                    <span>Executive Chauffeur Assigned</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    <strong>Pickup:</strong> {visit.pickupLocation}
                  </p>
                  <p className="text-slate-500 text-[10px]">{visit.driverName}</p>
                </div>
              ) : (
                <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>Self-drive to project entrance gate</span>
                </div>
              )}

              {visit.notes && (
                <p className="mt-2 text-xs text-slate-500 italic">"{visit.notes}"</p>
              )}
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => navigateTo('customer-details', { customerId: visit.leadId })}
                className="text-blue-600 font-semibold hover:underline"
              >
                View Customer Profile →
              </button>

              {visit.status === 'Confirmed' && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateSiteVisitStatus(visit.id, 'Completed')}
                    className="px-2.5 py-1 rounded-lg font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                  >
                    Mark Done
                  </button>
                  <button
                    onClick={() => updateSiteVisitStatus(visit.id, 'Cancelled')}
                    className="px-2.5 py-1 rounded-lg font-medium text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Modal */}
      <ScheduleVisitModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        customer={leads[0]}
      />
    </div>
  );
}
