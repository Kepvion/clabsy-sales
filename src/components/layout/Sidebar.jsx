import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Grid3X3,
  UserCheck,
  BookmarkCheck,
  CalendarCheck,
  RotateCcw,
  Building2,
  Plus,
  X,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Modal } from '../common/Modal';

export function Sidebar({ onOpenAddLead }) {
  const {
    activeView,
    navigateTo,
    leads,
    plots,
    siteVisits,
    company,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    resetDemoData
  } = useApp();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Counters
  const activeLeadsCount = leads.filter((l) => l.status !== 'Lost' && l.status !== 'Booked').length;
  const availablePlotsCount = plots.filter((p) => p.status === 'Available').length;
  const upcomingVisitsCount = siteVisits.filter((s) => s.status === 'Confirmed').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'leads',
      label: 'Leads & Pipeline',
      icon: Users,
      badge: activeLeadsCount > 0 ? activeLeadsCount : null,
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'inventory',
      label: 'Plot Inventory',
      icon: Grid3X3,
      badge: `${availablePlotsCount} Free`,
      badgeColor: 'bg-emerald-100 text-emerald-700'
    },
    {
      id: 'customer-details',
      label: 'Customer 360',
      icon: UserCheck,
      badge: null
    },
    {
      id: 'booking',
      label: 'Plot Booking',
      icon: BookmarkCheck,
      badge: 'Flow',
      badgeColor: 'bg-indigo-100 text-indigo-700'
    },
    {
      id: 'site-visits',
      label: 'Site Visits',
      icon: CalendarCheck,
      badge: upcomingVisitsCount > 0 ? upcomingVisitsCount : null,
      badgeColor: 'bg-amber-100 text-amber-700'
    }
  ];

  const handleNavClick = (viewId) => {
    navigateTo(viewId);
  };

  const handleConfirmReset = () => {
    resetDemoData();
    setIsResetConfirmOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-[#141416] text-stone-300 flex flex-col border-r border-[#262421] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[#262421]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#c5a880] flex items-center justify-center text-stone-950 shadow-xs font-serif-luxury font-bold text-lg">
                G
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif-luxury text-base text-white tracking-wide font-medium">Greenfield</span>
                  <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded bg-stone-900 text-[#c5a880] border border-[#c5a880]/30 tracking-wider">
                    ESTATES
                  </span>
                </div>
                <p className="text-[10px] text-stone-400 font-light tracking-wide">Clabsy Private Allocation</p>
              </div>
            </div>

            {/* Close button for mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Client Tenant Card */}
          <div className="mt-3.5 p-3 rounded-lg bg-[#1a1917] border border-[#2e2a24]">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-medium text-stone-400 uppercase tracking-widest">
                Developer Enterprise
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-[#c5a880] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
                RERA Active
              </span>
            </div>
            <div className="mt-1 font-serif-luxury text-stone-100 text-sm font-medium tracking-wide">
              {company.name}
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] text-stone-400 font-light">
              <span>3 Townships</span>
              <span>•</span>
              <span>{plots.length} Freehold Parcels</span>
            </div>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="px-4 pt-3.5 pb-2">
          <button
            onClick={() => {
              if (onOpenAddLead) onOpenAddLead();
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#c5a880] hover:bg-[#b8986c] text-stone-950 font-semibold text-xs transition shadow-xs active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register New Buyer</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-stone-400">
            Portfolio Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-[#221f1b] text-[#f5ebd9] border-l-2 border-[#c5a880] shadow-2xs font-semibold'
                    : 'text-stone-300 hover:text-white hover:bg-stone-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition ${
                      isActive ? 'text-[#c5a880]' : 'text-stone-400 group-hover:text-stone-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                      isActive
                        ? 'bg-[#c5a880] text-stone-950 font-semibold'
                        : 'bg-stone-900 text-stone-300 border border-stone-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3.5 border-t border-[#262421] bg-stone-950/60 space-y-2.5">
          {/* Reset Demo Data Button */}
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-400 hover:text-stone-200 hover:bg-stone-900 border border-stone-800 transition group"
            title="Restore all demo data to initial factory state"
          >
            <div className="flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5 text-stone-400 group-hover:rotate-180 transition-transform duration-300" />
              <span>Reset Portfolio Data</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-stone-400">Restore</span>
          </button>

          {/* User Profile Info */}
          <div className="flex items-center gap-2.5 pt-1">
            <img
              src={company.activeUser.avatar}
              alt={company.activeUser.name}
              className="w-8 h-8 rounded-full object-cover border border-[#3a352c]"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{company.activeUser.name}</p>
              <p className="text-[10px] text-[#c5a880] truncate font-light">{company.activeUser.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        title="Reset Demo Data?"
        subtitle="Restore initial realistic Greenfield Estates demo data"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            This will reset all modified leads, newly booked plots, and scheduled site visits back to
            the default demo dataset.
          </p>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            <strong>Note:</strong> Ideal for resetting the presentation before demonstrating to a
            new client or investor.
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmReset}
              className="px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-500 rounded-xl transition shadow-sm"
            >
              Confirm Reset
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
