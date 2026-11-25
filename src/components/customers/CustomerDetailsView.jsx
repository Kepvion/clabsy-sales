import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { ScheduleVisitModal } from './ScheduleVisitModal';
import { AddNoteModal } from './AddNoteModal';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  BookmarkCheck,
  CalendarCheck,
  MessageSquare,
  User,
  Plus,
  Clock,
  Car,
  ChevronRight,
  ShieldCheck,
  IndianRupee,
  Share2,
  FileText,
  Building,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { formatDate, formatDateTime, formatINR, formatLakhs, timeAgo } from '../../utils/formatters';

export function CustomerDetailsView() {
  const {
    leads,
    selectedCustomerId,
    setSelectedCustomerId,
    plots,
    siteVisits,
    bookings,
    activities,
    navigateTo,
    updateLeadStatus,
    addCustomerNote,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'visits' | 'bookings'
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);

  // Find active customer or fallback to first lead
  const customer = leads.find((l) => l.id === selectedCustomerId) || leads[0];

  if (!customer) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <h3 className="text-base font-bold text-slate-900">No customer selected</h3>
        <p className="text-xs text-slate-500 mt-1">Please select a lead from the pipeline.</p>
        <button
          onClick={() => navigateTo('leads')}
          className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl"
        >
          Go to Leads Pipeline
        </button>
      </div>
    );
  }

  // Customer related records
  const customerVisits = siteVisits.filter((s) => s.leadId === customer.id);
  const customerBookings = bookings.filter((b) => b.leadId === customer.id);
  const targetPlot = plots.find((p) => p.id === customer.targetPlotId);

  // Split notes by newline
  const notesList = customer.notes ? customer.notes.split('\n\n').filter(Boolean) : [];

  const handleSimulateCall = () => {
    showToast({
      title: `Calling ${customer.name}...`,
      message: `Connecting to ${customer.phone} via Greenfield Estates CRM VoIP.`,
      type: 'info'
    });
  };

  const handleSimulateWhatsApp = () => {
    showToast({
      title: 'WhatsApp Message Sent',
      message: `Digital brochure and master layout sent to ${customer.phone}.`,
      type: 'success'
    });
  };

  return (
    <div className="space-y-6">
      {/* Customer Switcher Strip */}
      <div className="flex items-center justify-between gap-3 bg-[#faf8f5] p-3 rounded-lg border border-[#ebe6df] shadow-2xs">
        <div className="flex items-center gap-2 text-xs text-[#716e68]">
          <span className="font-semibold text-[#141416]">Quick Select Buyer:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {leads.map((l) => (
            <button
              key={l.id}
              onClick={() => setSelectedCustomerId(l.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                l.id === customer.id
                  ? 'bg-[#141416] text-[#faf8f5] border border-[#c5a880]/30 font-semibold shadow-2xs'
                  : 'bg-[#f4efe6] text-[#716e68] hover:bg-[#ebe6df]'
              }`}
            >
              {l.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="enterprise-card p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#ebe6df]">
          {/* Avatar and basic info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#141416] text-[#c5a880] font-serif-luxury text-2xl font-semibold flex items-center justify-center border border-[#c5a880]/40 shadow-xs shrink-0">
              {customer.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-[#141416] tracking-tight">
                  {customer.name}
                </h1>
                <Badge status={customer.status} size="md" />
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-[#f4efe6] text-[#8c6d3b] border border-[#ddd3c3]">
                  Score: {customer.leadScore || 85}/100
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-[#716e68]">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#8a857d]" />
                  <strong className="font-mono text-[#141416]">{customer.phone}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#8a857d]" />
                  <span>{customer.email}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8a857d]" />
                  <span>{customer.city}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSimulateCall}
              className="px-3.5 py-2 rounded-md text-xs font-medium bg-[#f4efe6] hover:bg-[#ebe6df] text-[#141416] border border-[#ddd3c3] transition flex items-center gap-1.5 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-[#8c6d3b]" />
              <span>Call Client</span>
            </button>

            <button
              onClick={handleSimulateWhatsApp}
              className="px-3.5 py-2 rounded-md text-xs font-medium bg-[#eaf3ee] hover:bg-[#d9ede1] text-[#1e4a38] border border-[#c2dece] transition flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#1e4a38]" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="px-3.5 py-2 rounded-md text-xs font-medium bg-[#fbf9f5] hover:bg-[#f4efe6] text-[#141416] border border-[#ddd3c3] transition flex items-center gap-1.5 cursor-pointer"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-[#8c6d3b]" />
              <span>Schedule Visit</span>
            </button>

            <button
              onClick={() => navigateTo('booking', { leadId: customer.id })}
              className="px-4 py-2 rounded-md text-xs font-medium bg-[#141416] hover:bg-[#221f1b] text-[#faf8f5] border border-[#c5a880]/30 transition shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <BookmarkCheck className="w-4 h-4 text-[#c5a880]" />
              <span>Start Plot Booking</span>
            </button>
          </div>
        </div>

        {/* Requirements & Profile Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
          <div className="p-3.5 rounded-lg bg-[#faf8f5] border border-[#ebe6df]">
            <span className="text-[10px] text-[#716e68] uppercase font-semibold">Budget Range</span>
            <p className="text-sm font-semibold text-[#141416] mt-0.5">{customer.budgetDisplay}</p>
            <span className="text-[10px] text-[#716e68]">Self-Financed / Loan</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#faf8f5] border border-[#ebe6df]">
            <span className="text-[10px] text-[#716e68] uppercase font-semibold">
              Preferred Project
            </span>
            <p className="text-sm font-semibold text-[#141416] mt-0.5 truncate">
              {customer.preferredProjectName}
            </p>
            <span className="text-[10px] text-[#8c6d3b] font-medium">Devenahalli / Bengaluru</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#faf8f5] border border-[#ebe6df]">
            <span className="text-[10px] text-[#716e68] uppercase font-semibold">
              Requirement & Facing
            </span>
            <p className="text-sm font-semibold text-[#141416] mt-0.5">{customer.interestedPlotType}</p>
            <span className="text-[10px] text-[#716e68]">{customer.facingPreference} Facing</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#faf8f5] border border-[#ebe6df]">
            <span className="text-[10px] text-[#716e68] uppercase font-semibold">Assigned Agent</span>
            <p className="text-sm font-semibold text-[#141416] mt-0.5">{customer.assignedAgentName}</p>
            <span className="text-[10px] text-[#1e4a38] font-medium">Active Relationship</span>
          </div>
        </div>
      </div>

      {/* Buyer Progression Milestone Stepper */}
      <div className="enterprise-card p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#ebe6df]">
          <div>
            <span className="font-serif-luxury text-base text-[#141416] tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8c6d3b]" />
              <span>Buyer Lifecycle Progression</span>
            </span>
            <p className="text-xs text-[#716e68] mt-0.5">Track customer journey from initial inquiry to final land allotment</p>
          </div>
          <span className="text-xs text-[#716e68]">
            Current Stage: <strong className="text-[#141416] font-semibold">{customer.status}</strong>
          </span>
        </div>

        {/* 5-Step Progress Bar */}
        <div className="grid grid-cols-5 gap-2 relative">
          {[
            { id: 'New', label: '1. Inquired', desc: 'Inquiry Captured' },
            { id: 'Contacted', label: '2. Qualified', desc: 'Requirements Verified' },
            { id: 'Site Visit Scheduled', label: '3. Site Visit', desc: 'Physical Inspection' },
            { id: 'In Negotiation', label: '4. Negotiation', desc: 'Pricing & Corner PLC' },
            { id: 'Booked', label: '5. Allotment Booked', desc: 'Token Advance Received' }
          ].map((stage, idx) => {
            const stagesOrder = ['New', 'Contacted', 'Site Visit Scheduled', 'In Negotiation', 'Booked'];
            const currentIndex = stagesOrder.indexOf(customer.status);
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;

            let badgeStyle = 'bg-[#faf8f5] text-[#8a857d] border-[#ebe6df]';
            if (isCompleted) {
              badgeStyle = 'bg-[#f4efe6] text-[#141416] border-[#ddd3c3]';
            } else if (isCurrent) {
              badgeStyle = 'bg-[#141416] text-[#faf8f5] border-[#c5a880]/40 shadow-xs ring-1 ring-[#c5a880]/30';
            }

            return (
              <button
                type="button"
                key={stage.id}
                onClick={() => updateLeadStatus(customer.id, stage.id)}
                className={`p-3 rounded-lg border text-left transition-all ${badgeStyle} hover:border-[#c5a880] group cursor-pointer`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold block">{stage.label}</span>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-[#1e4a38]" />}
                  {isCurrent && <span className="w-2 h-2 rounded-full bg-[#c5a880]" />}
                </div>
                <span className="text-[10px] opacity-80 block mt-1 hidden sm:block truncate">
                  {stage.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Financial Profile & Bank Eligibility */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-[#faf8f5] border border-[#ebe6df] shadow-2xs">
          <span className="text-[10px] font-semibold text-[#716e68] uppercase tracking-wider block">
            Banking Partner & Loan Status
          </span>
          <div className="flex items-center gap-2 mt-1.5">
            <ShieldCheck className="w-4 h-4 text-[#8c6d3b] shrink-0" />
            <span className="text-xs font-semibold text-[#141416]">Pre-Approved: HDFC Bank</span>
          </div>
          <p className="text-[11px] text-[#716e68] mt-1">
            Eligible for home construction loan up to <strong>₹75.0 Lakhs</strong> at 8.45% ROI.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#faf8f5] border border-[#ebe6df] shadow-2xs">
          <span className="text-[10px] font-semibold text-[#716e68] uppercase tracking-wider block">
            Funding Strategy
          </span>
          <div className="flex items-center gap-2 mt-1.5">
            <IndianRupee className="w-4 h-4 text-[#8c6d3b] shrink-0" />
            <span className="text-xs font-semibold text-[#141416]">20% Own Funds + 80% Loan</span>
          </div>
          <p className="text-[11px] text-[#716e68] mt-1">
            Token advance ready via direct NEFT / banker's cheque.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#faf8f5] border border-[#ebe6df] shadow-2xs">
          <span className="text-[10px] font-semibold text-[#716e68] uppercase tracking-wider block">
            Purchasing Horizon
          </span>
          <div className="flex items-center gap-2 mt-1.5">
            <Clock className="w-4 h-4 text-[#8c6d3b] shrink-0" />
            <span className="text-xs font-semibold text-[#141416]">Immediate (&lt; 30 Days)</span>
          </div>
          <p className="text-[11px] text-[#716e68] mt-1">
            A-Khata registration planned for next auspicious subha muhurtham date.
          </p>
        </div>
      </div>

      {/* Target Plot Teaser (if customer has shown interest in a specific plot) */}
      {targetPlot && (
        <div className="bg-[#141416] text-[#faf8f5] rounded-xl p-5 border border-[#c5a880]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-[#221f1b] text-[#c5a880] border border-[#c5a880]/30">
              <Building className="w-5 h-5 text-[#c5a880]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-luxury text-lg text-[#faf8f5]">
                  Target Plot: {targetPlot.plotNumber}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#221f1b] text-[#c5a880] border border-[#c5a880]/30">
                  {targetPlot.status}
                </span>
              </div>
              <p className="text-xs text-[#a09d96] mt-0.5">
                {targetPlot.dimensions} ({targetPlot.areaSqFt} sq.ft) • {targetPlot.facing} Facing • {formatLakhs(targetPlot.totalPriceLakhs)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('inventory')}
              className="px-3.5 py-1.5 rounded-md text-xs font-medium bg-[#221f1b] hover:bg-[#2c2823] text-[#faf8f5] border border-[#443e35] transition cursor-pointer"
            >
              View on Inventory
            </button>
            <button
              onClick={() => navigateTo('booking', { plotId: targetPlot.id, leadId: customer.id })}
              className="px-4 py-1.5 rounded-md text-xs font-semibold bg-[#c5a880] hover:bg-[#b8996e] text-[#141416] transition shadow-sm cursor-pointer"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      )}

      {/* Interactive Tabs Section */}
      <div className="enterprise-card shadow-xs overflow-hidden">
        {/* Tab Headers */}
        <div className="flex items-center justify-between px-6 pt-4 border-b border-[#ebe6df]">
          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('notes')}
              className={`pb-3.5 transition border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'notes'
                  ? 'border-[#c5a880] text-[#141416] font-bold'
                  : 'border-transparent text-[#716e68] hover:text-[#141416]'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-[#8c6d3b]" />
              <span>Activity & Call Notes ({notesList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('visits')}
              className={`pb-3.5 transition border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'visits'
                  ? 'border-[#c5a880] text-[#141416] font-bold'
                  : 'border-transparent text-[#716e68] hover:text-[#141416]'
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-[#8c6d3b]" />
              <span>Site Visits ({customerVisits.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`pb-3.5 transition border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'bookings'
                  ? 'border-[#c5a880] text-[#141416] font-bold'
                  : 'border-transparent text-[#716e68] hover:text-[#141416]'
              }`}
            >
              <BookmarkCheck className="w-4 h-4 text-[#8c6d3b]" />
              <span>Bookings & Allotments ({customerBookings.length})</span>
            </button>
          </div>

          {activeTab === 'notes' && (
            <button
              onClick={() => setIsAddNoteModalOpen(true)}
              className="mb-2 px-3 py-1.5 rounded-md text-xs font-medium bg-[#f4efe6] text-[#141416] hover:bg-[#ebe6df] border border-[#ddd3c3] transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#8c6d3b]" />
              <span>Log Note</span>
            </button>
          )}

          {activeTab === 'visits' && (
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="mb-2 px-3 py-1.5 rounded-md text-xs font-medium bg-[#141416] text-[#faf8f5] hover:bg-[#221f1b] border border-[#c5a880]/30 transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Schedule Visit</span>
            </button>
          )}
        </div>

        {/* Tab 1: Notes & Interaction History */}
        {activeTab === 'notes' && (
          <div className="p-6 space-y-4">
            {notesList.length > 0 ? (
              <div className="space-y-3">
                {notesList.map((note, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-[#faf8f5] border border-[#ebe6df] text-xs text-[#141416] leading-relaxed"
                  >
                    <div className="flex items-center gap-2 text-[11px] text-[#716e68] font-medium mb-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#8c6d3b]" />
                      <span>Recorded Entry</span>
                    </div>
                    <p className="whitespace-pre-wrap">{note}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-[#716e68] text-xs">
                No interaction notes recorded yet. Click "Log Note" above to add conversation
                highlights.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Site Visits */}
        {activeTab === 'visits' && (
          <div className="p-6">
            {customerVisits.length > 0 ? (
              <div className="space-y-3">
                {customerVisits.map((visit) => (
                  <div
                    key={visit.id}
                    className="p-4 rounded-lg border border-[#ebe6df] bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif-luxury font-medium text-[#141416] text-base">{visit.projectName}</span>
                        <Badge status={visit.status} size="xs" />
                      </div>
                      <div className="mt-1 text-xs text-[#716e68] flex flex-wrap items-center gap-3">
                        <span className="font-semibold text-[#141416]">
                          Plot {visit.plotNumber || 'Unassigned'}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(visit.scheduledDateTime).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span>•</span>
                        <span>Agent: {visit.agentName}</span>
                      </div>
                      {visit.pickupRequired && (
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#8c6d3b] bg-[#fbf9f5] px-2.5 py-1 rounded-md border border-[#ddd3c3] max-w-fit">
                          <Car className="w-3.5 h-3.5 text-[#8c6d3b]" />
                          <span>Pickup: {visit.pickupLocation} ({visit.driverName})</span>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-[#716e68] block">{visit.notes}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-[#716e68] text-xs">
                No site visits recorded for {customer.name}.
                <div className="mt-3">
                  <button
                    onClick={() => setIsScheduleModalOpen(true)}
                    className="px-4 py-2 text-xs font-medium text-[#faf8f5] bg-[#141416] hover:bg-[#221f1b] border border-[#c5a880]/30 rounded-md cursor-pointer"
                  >
                    Schedule First Site Visit
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Bookings & Allotments */}
        {activeTab === 'bookings' && (
          <div className="p-6">
            {customerBookings.length > 0 ? (
              <div className="space-y-4">
                {customerBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 rounded-lg border border-[#ddd3c3] bg-[#fbf9f5] space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ebe6df] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#141416]">
                            {b.bookingNumber}
                          </span>
                          <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-md bg-[#eaf3ee] text-[#1e4a38] border border-[#c2dece]">
                            Confirmed Allotment
                          </span>
                        </div>
                        <h4 className="font-serif-luxury text-lg text-[#141416] mt-1">
                          Plot {b.plotNumber} — {b.projectName}
                        </h4>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs text-[#716e68] block">Total Agreement Value</span>
                        <span className="font-serif-luxury text-xl font-medium text-[#141416]">
                          {formatINR(b.totalAmount)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-[#716e68] block text-[11px]">Token Advance Paid</span>
                        <span className="font-bold text-[#1e4a38] text-sm font-mono">
                          {formatINR(b.tokenAmount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#716e68] block text-[11px]">Balance Due at Reg</span>
                        <span className="font-bold text-[#8c6d3b] text-sm font-mono">
                          {formatINR(b.balanceDue)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#716e68] block text-[11px]">Payment Mode</span>
                        <span className="font-medium text-[#141416]">{b.paymentMode}</span>
                      </div>
                      <div>
                        <span className="text-[#716e68] block text-[11px]">Transaction Ref</span>
                        <span className="font-mono text-[#141416]">{b.transactionRef}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-[#716e68] text-xs">
                No plot bookings currently on record for {customer.name}.
                <div className="mt-3">
                  <button
                    onClick={() => navigateTo('booking', { leadId: customer.id })}
                    className="px-4 py-2 text-xs font-semibold text-[#141416] bg-[#c5a880] hover:bg-[#b8996e] rounded-md shadow-xs cursor-pointer"
                  >
                    Start Plot Booking Workflow
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <ScheduleVisitModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        customer={customer}
      />

      <AddNoteModal
        isOpen={isAddNoteModalOpen}
        onClose={() => setIsAddNoteModalOpen(false)}
        customerName={customer.name}
        onAddNote={(note) => addCustomerNote(customer.id, note)}
      />
    </div>
  );
}
