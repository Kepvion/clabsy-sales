import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialCompany,
  initialProjects,
  initialAgents,
  initialPlots,
  initialLeads,
  initialSiteVisits,
  initialBookings,
  initialActivities
} from '../data/initialData';

const STORAGE_KEY = 'clabsy_realestate_crm_state_v1';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Initialize state from localStorage if available, otherwise defaults
  const [isLoaded, setIsLoaded] = useState(false);
  const [company, setCompany] = useState(initialCompany);
  const [projects, setProjects] = useState(initialProjects);
  const [agents, setAgents] = useState(initialAgents);
  const [plots, setPlots] = useState(initialPlots);
  const [leads, setLeads] = useState(initialLeads);
  const [siteVisits, setSiteVisits] = useState(initialSiteVisits);
  const [bookings, setBookings] = useState(initialBookings);
  const [activities, setActivities] = useState(initialActivities);

  // Navigation and active selection state
  const [activeView, setActiveView] = useState('dashboard'); // dashboard | leads | inventory | customer-details | booking | site-visits
  const [selectedCustomerId, setSelectedCustomerId] = useState('lead-1');
  const [selectedPlotIdForBooking, setSelectedPlotIdForBooking] = useState(null);
  const [selectedLeadIdForBooking, setSelectedLeadIdForBooking] = useState(null);
  const [lastConfirmedBooking, setLastConfirmedBooking] = useState(null);

  // Search query & global filter
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('ALL');

  // Mobile sidebar drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.plots && parsed.leads) {
          setPlots(parsed.plots);
          setLeads(parsed.leads);
          setSiteVisits(parsed.siteVisits || initialSiteVisits);
          setBookings(parsed.bookings || initialBookings);
          setActivities(parsed.activities || initialActivities);
        }
      }
    } catch (err) {
      console.warn('Failed to parse saved state from localStorage:', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const toSave = {
        plots,
        leads,
        siteVisits,
        bookings,
        activities
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (err) {
      console.error('Failed to save state to localStorage:', err);
    }
  }, [plots, leads, siteVisits, bookings, activities, isLoaded]);

  // Toast helper
  const showToast = (toast) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    const newToast = { id, type: 'success', duration: 4000, ...toast };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, newToast.duration || 4000);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Navigation helper
  const navigateTo = (view, params = {}) => {
    if (params.customerId) {
      setSelectedCustomerId(params.customerId);
    }
    if (params.plotId) {
      setSelectedPlotIdForBooking(params.plotId);
    }
    if (params.leadId) {
      setSelectedLeadIdForBooking(params.leadId);
    }
    setActiveView(view);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add Lead
  const addLead = (newLeadData) => {
    const newId = `lead-${Date.now()}`;
    const agent = agents.find((a) => a.id === newLeadData.assignedAgentId) || agents[0];
    const project = projects.find((p) => p.id === newLeadData.preferredProjectId) || projects[0];

    const leadRecord = {
      id: newId,
      name: newLeadData.name.trim(),
      phone: newLeadData.phone.trim(),
      email: newLeadData.email.trim(),
      city: newLeadData.city || 'Bengaluru',
      preferredProjectId: project.id,
      preferredProjectName: project.name,
      budgetMinLakhs: Number(newLeadData.budgetMinLakhs) || 40,
      budgetMaxLakhs: Number(newLeadData.budgetMaxLakhs) || 60,
      budgetDisplay: `₹${newLeadData.budgetMinLakhs} - ${newLeadData.budgetMaxLakhs} Lakhs`,
      interestedPlotType: newLeadData.interestedPlotType || '1,500 sq.ft (30x50)',
      facingPreference: newLeadData.facingPreference || 'East',
      source: newLeadData.source || 'Website Direct',
      assignedAgentId: agent.id,
      assignedAgentName: agent.name,
      status: 'New',
      createdAt: new Date().toISOString(),
      lastContactedAt: new Date().toISOString(),
      notes: newLeadData.notes || 'Inquired via Clabsy CRM lead portal.',
      leadScore: 60
    };

    setLeads((prev) => [leadRecord, ...prev]);

    // Add activity
    const activityRecord = {
      id: `act-${Date.now()}`,
      type: 'NEW_LEAD',
      title: `New Lead: ${leadRecord.name}`,
      description: `Inquiry registered for ${project.name} (${leadRecord.budgetDisplay}) assigned to ${agent.name}.`,
      timestamp: new Date().toISOString(),
      author: company.activeUser.name,
      badgeColor: 'blue'
    };
    setActivities((prev) => [activityRecord, ...prev]);

    showToast({
      title: 'Lead Created Successfully',
      message: `${leadRecord.name} was added to the active pipeline.`,
      type: 'success'
    });

    return leadRecord;
  };

  // Update Lead Status
  const updateLeadStatus = (leadId, newStatus) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          return {
            ...lead,
            status: newStatus,
            lastContactedAt: new Date().toISOString()
          };
        }
        return lead;
      })
    );

    const lead = leads.find((l) => l.id === leadId);
    if (lead) {
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          type: 'STATUS_UPDATE',
          title: `Status Changed: ${lead.name}`,
          description: `Lead moved to "${newStatus}" stage by ${company.activeUser.name}.`,
          timestamp: new Date().toISOString(),
          author: company.activeUser.name,
          badgeColor: 'indigo'
        },
        ...prev
      ]);

      showToast({
        title: 'Status Updated',
        message: `${lead.name} marked as "${newStatus}".`,
        type: 'info'
      });
    }
  };

  // Move Lead Stage in Pipeline
  const moveLeadStage = (leadId, direction) => {
    const stages = ['New', 'Contacted', 'Site Visit Scheduled', 'In Negotiation', 'Booked'];
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;
    const currentIndex = stages.indexOf(lead.status);
    if (currentIndex === -1) return;
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < stages.length) {
      updateLeadStatus(leadId, stages[newIndex]);
    }
  };

  // Add Note to Customer
  const addCustomerNote = (leadId, noteText) => {
    const trimmed = noteText.trim();
    if (!trimmed) return;

    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          const timestamp = new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          });
          const updatedNotes = `${timestamp} - ${company.activeUser.name}: ${trimmed}\n\n${lead.notes || ''}`;
          return {
            ...lead,
            notes: updatedNotes,
            lastContactedAt: new Date().toISOString()
          };
        }
        return lead;
      })
    );

    const lead = leads.find((l) => l.id === leadId);
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'NOTE_ADDED',
        title: `Note Added for ${lead ? lead.name : 'Customer'}`,
        description: trimmed.length > 80 ? trimmed.substring(0, 80) + '...' : trimmed,
        timestamp: new Date().toISOString(),
        author: company.activeUser.name,
        badgeColor: 'slate'
      },
      ...prev
    ]);

    showToast({
      title: 'Note Logged',
      message: 'Interaction recorded in customer activity log.',
      type: 'success'
    });
  };

  // Schedule Site Visit
  const scheduleSiteVisit = (visitData) => {
    const lead = leads.find((l) => l.id === visitData.leadId);
    const plot = plots.find((p) => p.id === visitData.plotId);
    const project = projects.find((p) => p.id === (plot ? plot.projectId : visitData.projectId)) || projects[0];
    const agent = agents.find((a) => a.id === visitData.agentId) || (lead ? agents.find(ag => ag.id === lead.assignedAgentId) : agents[0]);

    const newVisit = {
      id: `sv-${Date.now()}`,
      leadId: visitData.leadId,
      customerName: lead ? lead.name : visitData.customerName,
      phone: lead ? lead.phone : visitData.phone,
      projectId: project.id,
      projectName: project.name,
      plotId: plot ? plot.id : null,
      plotNumber: plot ? plot.plotNumber : 'TBD at Site',
      agentId: agent.id,
      agentName: agent.name,
      scheduledDateTime: visitData.scheduledDateTime,
      status: 'Confirmed',
      pickupRequired: Boolean(visitData.pickupRequired),
      pickupLocation: visitData.pickupLocation || 'Direct to site gate',
      driverName: visitData.pickupRequired ? (visitData.driverName || 'Ramesh Gowda (KA-03-MG-4122)') : 'N/A',
      notes: visitData.notes || 'Site visit arranged via Clabsy.'
    };

    setSiteVisits((prev) => [newVisit, ...prev]);

    // Update lead status to Site Visit Scheduled if not already higher
    if (lead && lead.status !== 'Booked' && lead.status !== 'In Negotiation') {
      updateLeadStatus(lead.id, 'Site Visit Scheduled');
    }

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'SITE_VISIT_SCHEDULED',
        title: `Site Visit Booked: ${newVisit.customerName}`,
        description: `Visit scheduled for ${new Date(newVisit.scheduledDateTime).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} at ${project.name} (${newVisit.plotNumber}).`,
        timestamp: new Date().toISOString(),
        author: agent.name,
        badgeColor: 'blue'
      },
      ...prev
    ]);

    showToast({
      title: 'Site Visit Scheduled',
      message: `Confirmed for ${newVisit.customerName} on ${new Date(newVisit.scheduledDateTime).toLocaleDateString('en-IN')}`,
      type: 'success'
    });

    return newVisit;
  };

  // Complete or Cancel Site Visit
  const updateSiteVisitStatus = (visitId, newStatus) => {
    setSiteVisits((prev) =>
      prev.map((v) => (v.id === visitId ? { ...v, status: newStatus } : v))
    );

    const visit = siteVisits.find((v) => v.id === visitId);
    showToast({
      title: 'Site Visit Status Updated',
      message: `${visit ? visit.customerName : 'Visit'} marked as ${newStatus}.`,
      type: 'info'
    });
  };

  // Confirm Plot Booking
  const bookPlot = (bookingData) => {
    const plot = plots.find((p) => p.id === bookingData.plotId);
    const lead = leads.find((l) => l.id === bookingData.leadId);
    const project = projects.find((p) => p.id === (plot ? plot.projectId : bookingData.projectId)) || projects[0];

    if (!plot) {
      showToast({
        title: 'Error',
        message: 'Plot could not be found for booking.',
        type: 'error'
      });
      return null;
    }

    const bookingNum = `GFE-BK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking = {
      id: `bk-${Date.now()}`,
      bookingNumber: bookingNum,
      date: new Date().toISOString(),
      leadId: lead ? lead.id : `lead-new-${Date.now()}`,
      customerName: bookingData.customerName || (lead ? lead.name : 'Valued Buyer'),
      phone: bookingData.phone || (lead ? lead.phone : ''),
      email: bookingData.email || (lead ? lead.email : ''),
      projectId: project.id,
      projectName: project.name,
      plotId: plot.id,
      plotNumber: plot.plotNumber,
      plotAreaSqFt: plot.areaSqFt,
      facing: plot.facing,
      baseAmount: Math.round(plot.areaSqFt * plot.pricePerSqFt),
      clubhouseCharges: project.clubhouseCharges,
      totalAmount: Math.round(plot.totalPriceLakhs * 100000),
      tokenAmount: Number(bookingData.tokenAmount) || 100000,
      balanceDue: Math.round(plot.totalPriceLakhs * 100000) - (Number(bookingData.tokenAmount) || 100000),
      paymentMode: bookingData.paymentMode || 'NEFT / RTGS Transfer',
      transactionRef: bookingData.transactionRef || `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      paymentDate: bookingData.paymentDate || new Date().toISOString().split('T')[0],
      assignedAgentName: bookingData.assignedAgentName || (lead ? lead.assignedAgentName : 'Vikramaditya Roy'),
      allotmentLetterStatus: 'Generated & Pending Signature',
      status: 'Confirmed'
    };

    // 1. Update Plot Status to Reserved immediately!
    setPlots((prev) =>
      prev.map((p) => {
        if (p.id === plot.id) {
          return {
            ...p,
            status: 'Reserved',
            reservedBy: newBooking.customerName,
            reservedDate: new Date().toISOString().split('T')[0]
          };
        }
        return p;
      })
    );

    // 2. Update Lead Status to Booked if matching lead exists
    if (lead) {
      setLeads((prev) =>
        prev.map((l) => {
          if (l.id === lead.id) {
            return {
              ...l,
              status: 'Booked',
              targetPlotId: plot.id,
              lastContactedAt: new Date().toISOString()
            };
          }
          return l;
        })
      );
    }

    // 3. Add to bookings list
    setBookings((prev) => [newBooking, ...prev]);

    // 4. Record high-priority activity
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'BOOKING_CONFIRMED',
        title: `Plot ${plot.plotNumber} Booked!`,
        description: `${newBooking.customerName} confirmed reservation for Plot ${plot.plotNumber} in ${project.name}. Token of ₹${(newBooking.tokenAmount / 100000).toFixed(2)} Lakhs received.`,
        timestamp: new Date().toISOString(),
        author: newBooking.assignedAgentName,
        badgeColor: 'emerald'
      },
      ...prev
    ]);

    // Set last confirmed booking for receipt preview
    setLastConfirmedBooking(newBooking);

    showToast({
      title: 'Plot Booking Confirmed!',
      message: `Plot ${plot.plotNumber} is now Reserved for ${newBooking.customerName}. Allotment Letter generated.`,
      type: 'success'
    });

    return newBooking;
  };

  // Reset Demo Data
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPlots(initialPlots);
    setLeads(initialLeads);
    setSiteVisits(initialSiteVisits);
    setBookings(initialBookings);
    setActivities(initialActivities);
    setSelectedCustomerId('lead-1');
    setSelectedPlotIdForBooking(null);
    setSelectedLeadIdForBooking(null);
    setLastConfirmedBooking(null);

    showToast({
      title: 'Demo Data Reset',
      message: 'All leads, plots, and reservations have been restored to initial demo state.',
      type: 'info'
    });
  };

  const value = {
    company,
    projects,
    agents,
    plots,
    leads,
    siteVisits,
    bookings,
    activities,
    activeView,
    selectedCustomerId,
    selectedPlotIdForBooking,
    selectedLeadIdForBooking,
    lastConfirmedBooking,
    globalSearch,
    selectedProjectFilter,
    setSelectedProjectFilter,
    moveLeadStage,
    isMobileMenuOpen,
    toasts,
    setGlobalSearch,
    setIsMobileMenuOpen,
    navigateTo,
    setSelectedCustomerId,
    setSelectedPlotIdForBooking,
    setSelectedLeadIdForBooking,
    setLastConfirmedBooking,
    addLead,
    updateLeadStatus,
    addCustomerNote,
    scheduleSiteVisit,
    updateSiteVisitStatus,
    bookPlot,
    resetDemoData,
    showToast,
    dismissToast
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
