import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Calendar, Clock, MapPin, Car, User, CheckCircle2 } from 'lucide-react';

export function ScheduleVisitModal({ isOpen, onClose, customer, preselectedPlotId }) {
  const { projects, plots, agents, scheduleSiteVisit } = useApp();

  const [projectId, setProjectId] = useState(
    customer?.preferredProjectId || projects[0]?.id || 'prj-1'
  );
  const [plotId, setPlotId] = useState(preselectedPlotId || customer?.targetPlotId || '');
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0] // 2 days from now
  );
  const [scheduledTime, setScheduledTime] = useState('11:00');
  const [pickupRequired, setPickupRequired] = useState(true);
  const [pickupLocation, setPickupLocation] = useState(
    customer?.city ? `${customer.city} residence / office` : 'Indiranagar 100ft Road, Bengaluru'
  );
  const [driverName, setDriverName] = useState('Ramesh Gowda (Toyota Innova KA-03-MG-4122)');
  const [notes, setNotes] = useState('Site walkthrough of corner plots with family.');

  if (!customer) return null;

  // Filter plots for selected project
  const projectPlots = plots.filter((p) => p.projectId === projectId);

  const handleSubmit = (e) => {
    e.preventDefault();

    scheduleSiteVisit({
      leadId: customer.id,
      customerName: customer.name,
      phone: customer.phone,
      projectId,
      plotId: plotId || null,
      scheduledDateTime: `${scheduledDate}T${scheduledTime}:00`,
      pickupRequired,
      pickupLocation,
      driverName,
      notes
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Executive Site Visit"
      subtitle={`Arrange guided physical plot inspection for ${customer.name}`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Info Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Customer</span>
            <p className="text-sm font-bold text-slate-900">{customer.name}</p>
            <p className="text-xs text-slate-500">{customer.phone}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 uppercase font-semibold">Preferred Agent</span>
            <p className="text-xs font-semibold text-slate-800">{customer.assignedAgentName}</p>
          </div>
        </div>

        {/* Project & Plot Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Development Project
            </label>
            <select
              value={projectId}
              onChange={(e) => {
                setProjectId(e.target.value);
                setPlotId('');
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Plot (Optional)
            </label>
            <select
              value={plotId}
              onChange={(e) => setPlotId(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl"
            >
              <option value="">Any Available Plots at Site</option>
              {projectPlots.map((p) => (
                <option key={p.id} value={p.id}>
                  Plot {p.plotNumber} ({p.areaSqFt} sq.ft - {p.status})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date and Time Picker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Visit Date</label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Visit Time</label>
            <select
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl"
            >
              <option value="10:00">10:00 AM (Morning Slot)</option>
              <option value="11:30">11:30 AM (Preferred)</option>
              <option value="14:00">02:00 PM (Afternoon Slot)</option>
              <option value="16:00">04:00 PM (Sunset Walkthrough)</option>
              <option value="17:00">05:00 PM (Evening Slot)</option>
            </select>
          </div>
        </div>

        {/* Chauffeur / Pickup Option */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={pickupRequired}
              onChange={(e) => setPickupRequired(e.target.checked)}
              className="w-4 h-4 rounded-sm text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-blue-700" />
              Provide Chauffeur Driven Pickup & Drop
            </span>
          </label>

          {pickupRequired && (
            <div className="space-y-2 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-blue-800 mb-1">
                  Pickup Address
                </label>
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="e.g. Indiranagar, Bengaluru"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-blue-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-blue-800 mb-1">
                  Assigned Driver & Vehicle
                </label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-blue-200 rounded-lg text-slate-800"
                />
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Special Notes</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Bring soil quality testing reports and master deed copies."
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-sm active:scale-95 flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Confirm Schedule</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
