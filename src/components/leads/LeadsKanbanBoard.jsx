import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Phone,
  Building,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Plus,
  Flame,
  CalendarCheck,
  BookmarkCheck,
  MessageSquare
} from 'lucide-react';
import { formatLakhs } from '../../utils/formatters';

export function LeadsKanbanBoard({ leads, onOpenAddLead }) {
  const { navigateTo, moveLeadStage, showToast } = useApp();

  const columns = [
    {
      id: 'New',
      title: 'New Inquiries',
      dotColor: 'bg-blue-600'
    },
    {
      id: 'Contacted',
      title: 'Contacted',
      dotColor: 'bg-sky-600'
    },
    {
      id: 'Site Visit Scheduled',
      title: 'Site Visit Scheduled',
      dotColor: 'bg-indigo-600'
    },
    {
      id: 'In Negotiation',
      title: 'In Negotiation',
      dotColor: 'bg-amber-600'
    },
    {
      id: 'Booked',
      title: 'Booked Allotment',
      dotColor: 'bg-emerald-600'
    }
  ];

  const handleCardClick = (leadId) => {
    navigateTo('customer-details', { customerId: leadId });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3.5 overflow-x-auto pb-4">
      {columns.map((col, colIndex) => {
        const colLeads = leads.filter((l) => l.status === col.id);

        return (
          <div
            key={col.id}
            className="rounded-xl border border-slate-200/90 p-3 bg-slate-100/60 flex flex-col min-w-[270px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 mb-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                <span className="text-xs font-semibold text-slate-800 tracking-tight">
                  {col.title}
                </span>
                <span className="text-[11px] font-medium px-1.5 py-0.2 rounded bg-white text-slate-700 border border-slate-200 num-tabular">
                  {colLeads.length}
                </span>
              </div>

              {col.id === 'New' && (
                <button
                  onClick={onOpenAddLead}
                  className="p-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition"
                  title="Add new lead"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Cards List */}
            <div className="space-y-2.5 flex-1">
              {colLeads.map((lead) => {
                const isHot = (lead.leadScore || 60) >= 85;

                return (
                  <div
                    key={lead.id}
                    onClick={() => handleCardClick(lead.id)}
                    className="p-3 rounded-lg bg-white border border-slate-200 hover:border-slate-300 hover:shadow-2xs transition cursor-pointer group space-y-2"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="min-w-0">
                        <span className="font-semibold text-xs text-slate-900 group-hover:text-blue-600 transition truncate block">
                          {lead.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {lead.phone}
                        </span>
                      </div>

                      {isHot ? (
                        <span className="inline-flex items-center text-[10px] font-medium text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 shrink-0">
                          Hot • {lead.leadScore}
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                          Score: {lead.leadScore || 60}
                        </span>
                      )}
                    </div>

                    {/* Requirements & Budget */}
                    <div className="p-2 rounded-md bg-slate-50 text-[11px] text-slate-600 space-y-0.5 border border-slate-100">
                      <div className="flex items-center justify-between font-medium text-slate-900">
                        <span className="num-tabular">{lead.budgetDisplay}</span>
                        <span className="text-[10px] text-slate-500">{lead.source}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">
                        {lead.preferredProjectName}
                      </p>
                    </div>

                    {/* Quick Contact & Book Actions */}
                    <div
                      className="flex items-center justify-between gap-1 pt-1 border-t border-slate-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            showToast({
                              title: `Calling ${lead.name}...`,
                              message: `Connecting to ${lead.phone} via CRM VoIP.`,
                              type: 'info'
                            })
                          }
                          className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                          title={`Call ${lead.name}`}
                        >
                          <Phone className="w-3 h-3" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            showToast({
                              title: 'WhatsApp Dispatched',
                              message: `Shared digital brochure with ${lead.name} (${lead.phone}).`,
                              type: 'success'
                            })
                          }
                          className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                          title={`WhatsApp ${lead.name}`}
                        >
                          <MessageSquare className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => navigateTo('booking', { leadId: lead.id })}
                        className="px-2 py-0.5 rounded text-[10px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition flex items-center gap-1"
                        title="Book Plot for this lead"
                      >
                        <BookmarkCheck className="w-3 h-3 text-slate-600" />
                        <span>Book</span>
                      </button>
                    </div>

                    {/* Footer with Agent & Move Controls */}
                    <div
                      className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-[10px] text-slate-400 truncate max-w-[100px]">
                        {lead.assignedAgentName.split(' ')[0]}
                      </span>

                      {/* Stage Shift Buttons */}
                      <div className="flex items-center gap-1">
                        {colIndex > 0 && (
                          <button
                            type="button"
                            onClick={() => moveLeadStage(lead.id, 'prev')}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                            title="Move to previous stage"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                        )}

                        {colIndex < columns.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moveLeadStage(lead.id, 'next')}
                            className="p-1 rounded-md text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition"
                            title="Advance to next stage"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {colLeads.length === 0 && (
                <div className="p-6 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-lg">
                  No leads in this stage
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
