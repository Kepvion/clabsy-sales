import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  User,
  ExternalLink,
  Calendar,
  Building,
  BookmarkCheck,
  ChevronRight,
  MoreVertical,
  X,
  Table,
  Columns3
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { LeadsKanbanBoard } from './LeadsKanbanBoard';
import { formatDate, timeAgo } from '../../utils/formatters';

export function LeadsView({ onOpenAddLead }) {
  const { leads, projects, agents, navigateTo, updateLeadStatus } = useApp();

  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [agentFilter, setAgentFilter] = useState('ALL');

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = lead.name.toLowerCase().includes(query);
        const matchesPhone = lead.phone.includes(query);
        const matchesEmail = lead.email.toLowerCase().includes(query);
        const matchesProject = lead.preferredProjectName.toLowerCase().includes(query);
        if (!matchesName && !matchesPhone && !matchesEmail && !matchesProject) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'ALL' && lead.status !== statusFilter) {
        return false;
      }

      // Project filter
      if (projectFilter !== 'ALL' && lead.preferredProjectId !== projectFilter) {
        return false;
      }

      // Source filter
      if (sourceFilter !== 'ALL' && lead.source !== sourceFilter) {
        return false;
      }

      // Agent filter
      if (agentFilter !== 'ALL' && lead.assignedAgentId !== agentFilter) {
        return false;
      }

      return true;
    });
  }, [leads, searchTerm, statusFilter, projectFilter, sourceFilter, agentFilter]);

  // Status Tab options
  const statusOptions = [
    { id: 'ALL', label: 'All Leads', count: leads.length },
    { id: 'New', label: 'New', count: leads.filter((l) => l.status === 'New').length },
    {
      id: 'Contacted',
      label: 'Contacted',
      count: leads.filter((l) => l.status === 'Contacted').length
    },
    {
      id: 'Site Visit Scheduled',
      label: 'Site Visit',
      count: leads.filter((l) => l.status === 'Site Visit Scheduled').length
    },
    {
      id: 'In Negotiation',
      label: 'Negotiation',
      count: leads.filter((l) => l.status === 'In Negotiation').length
    },
    { id: 'Booked', label: 'Booked', count: leads.filter((l) => l.status === 'Booked').length }
  ];

  // Distinct sources
  const sources = Array.from(new Set(leads.map((l) => l.source)));

  const handleRowClick = (leadId) => {
    navigateTo('customer-details', { customerId: leadId });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setProjectFilter('ALL');
    setSourceFilter('ALL');
    setAgentFilter('ALL');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    statusFilter !== 'ALL' ||
    projectFilter !== 'ALL' ||
    sourceFilter !== 'ALL' ||
    agentFilter !== 'ALL';

  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Leads & Sales Pipeline</h2>
          <p className="text-xs text-slate-500">
            {leads.length} total customer leads registered in Greenfield Estates database
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Table vs Kanban Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition font-medium ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition font-medium ${
                viewMode === 'kanban'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          <button
            onClick={onOpenAddLead}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white transition shadow-2xs active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="enterprise-card p-4 space-y-3.5">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-100">
          {statusOptions.map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-2 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full num-tabular ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Secondary Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name, phone, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Project Filter */}
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

          {/* Lead Source Filter */}
          <div>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All Lead Sources</option>
              {sources.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Assigned Agent Filter */}
          <div className="flex items-center gap-2">
            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All Sales Agents</option>
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-2.5 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition shrink-0"
                title="Clear all filters"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content View: Table vs Kanban */}
      {viewMode === 'kanban' ? (
        <LeadsKanbanBoard leads={filteredLeads} onOpenAddLead={onOpenAddLead} />
      ) : (
        /* Leads Table Container */
        <div className="enterprise-card overflow-hidden">
          {filteredLeads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Customer</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Project & Budget</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">Assigned Agent</th>
                  <th className="py-3.5 px-4">Stage</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => handleRowClick(lead.id)}
                    className="hover:bg-blue-50/40 cursor-pointer transition group"
                  >
                    {/* Customer */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {lead.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 group-hover:text-blue-600 transition block">
                            {lead.name}
                          </span>
                          <span className="text-[11px] text-slate-400">{lead.city}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span className="font-mono text-xs">{lead.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[150px]">{lead.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Project & Budget */}
                    <td className="py-4 px-4">
                      <div>
                        <span className="font-medium text-slate-900 block truncate max-w-[180px]">
                          {lead.preferredProjectName}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-semibold text-emerald-700 text-xs">
                            {lead.budgetDisplay}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            • {lead.interestedPlotType}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Source */}
                    <td className="py-4 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                        {lead.source}
                      </span>
                    </td>

                    {/* Assigned Agent */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-700 font-medium">
                          {lead.assignedAgentName}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge & Quick Change */}
                    <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                        className="text-xs font-semibold py-1 px-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                        <option value="In Negotiation">In Negotiation</option>
                        <option value="Booked">Booked</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleRowClick(lead.id)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-blue-200 transition"
                        >
                          View 360°
                        </button>

                        <button
                          onClick={() => navigateTo('booking', { leadId: lead.id })}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-emerald-50 border border-emerald-200 transition"
                          title="Start plot booking for this customer"
                        >
                          Book
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No matching leads found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any customer leads matching your current search or filter criteria.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Clear All Filters
              </button>
              <button
                onClick={onOpenAddLead}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition"
              >
                + Add New Lead
              </button>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-700">{filteredLeads.length}</strong> of{' '}
            <strong className="text-slate-700">{leads.length}</strong> total leads
          </span>
          <span className="text-slate-400">Click any row to open Customer 360 view</span>
        </div>
      </div>
      )}
    </div>
  );
}
