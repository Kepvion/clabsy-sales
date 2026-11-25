import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { LeadsView } from './components/leads/LeadsView';
import { InventoryView } from './components/inventory/InventoryView';
import { CustomerDetailsView } from './components/customers/CustomerDetailsView';
import { BookingView } from './components/booking/BookingView';
import { SiteVisitsView } from './components/siteVisits/SiteVisitsView';
import { AddLeadModal } from './components/leads/AddLeadModal';
import { ToastContainer } from './components/common/Toast';

function AppContent() {
  const { activeView } = useApp();
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

  const handleOpenAddLead = () => {
    setIsAddLeadModalOpen(true);
  };

  const handleCloseAddLead = () => {
    setIsAddLeadModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#141416] flex font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar onOpenAddLead={handleOpenAddLead} />

      {/* Main App Container */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen min-w-0">
        {/* Top Header */}
        <Header onOpenAddLead={handleOpenAddLead} />

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeView === 'dashboard' && <DashboardView onOpenAddLead={handleOpenAddLead} />}
          {activeView === 'leads' && <LeadsView onOpenAddLead={handleOpenAddLead} />}
          {activeView === 'inventory' && <InventoryView />}
          {activeView === 'customer-details' && <CustomerDetailsView />}
          {activeView === 'booking' && <BookingView />}
          {activeView === 'site-visits' && <SiteVisitsView />}
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 border-t border-[#ebe6df] bg-[#faf8f5] text-center text-xs text-[#716e68]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span>
              Clabsy — Real Estate CRM & Plot Booking Platform • Prepared for Greenfield Estates
            </span>
            <span className="text-[11px] text-[#8a857d]">
              Interactive Prototype Demo • All Data Fictional
            </span>
          </div>
        </footer>
      </div>

      {/* Global Add Lead Modal */}
      <AddLeadModal isOpen={isAddLeadModalOpen} onClose={handleCloseAddLead} />

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
