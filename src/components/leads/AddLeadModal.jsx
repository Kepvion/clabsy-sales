import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { User, Phone, Mail, MapPin, IndianRupee, Compass, Layers, UserCheck, FileText } from 'lucide-react';

export function AddLeadModal({ isOpen, onClose }) {
  const { projects, agents, addLead, navigateTo } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Bengaluru',
    preferredProjectId: projects[0]?.id || 'prj-1',
    budgetMinLakhs: 50,
    budgetMaxLakhs: 70,
    interestedPlotType: '1,500 sq.ft (30x50)',
    facingPreference: 'East',
    source: 'Website Direct',
    assignedAgentId: agents[0]?.id || 'ag-1',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full customer name is required';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Contact phone number is required';
    } else if (formData.phone.replace(/[^0-9]/g, '').length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email format';
    }
    if (!formData.budgetMinLakhs || Number(formData.budgetMinLakhs) <= 0) {
      errs.budget = 'Please specify minimum budget in Lakhs';
    } else if (Number(formData.budgetMaxLakhs) < Number(formData.budgetMinLakhs)) {
      errs.budget = 'Max budget cannot be less than Min budget';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || (name.includes('budget') && errors.budget)) {
      setErrors((prev) => ({ ...prev, [name]: null, budget: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Format phone with +91 if missing
    let cleanedPhone = formData.phone.trim();
    if (!cleanedPhone.startsWith('+91')) {
      const digitsOnly = cleanedPhone.replace(/[^0-9]/g, '');
      if (digitsOnly.length === 10) {
        cleanedPhone = `+91 ${digitsOnly.slice(0, 5)} ${digitsOnly.slice(5)}`;
      }
    }

    const createdLead = addLead({
      ...formData,
      phone: cleanedPhone
    });

    onClose();

    // Reset form
    setFormData({
      name: '',
      phone: '',
      email: '',
      city: 'Bengaluru',
      preferredProjectId: projects[0]?.id || 'prj-1',
      budgetMinLakhs: 50,
      budgetMaxLakhs: 70,
      interestedPlotType: '1,500 sq.ft (30x50)',
      facingPreference: 'East',
      source: 'Website Direct',
      assignedAgentId: agents[0]?.id || 'ag-1',
      notes: ''
    });

    // Optionally navigate to view newly added lead
    if (createdLead?.id) {
      navigateTo('customer-details', { customerId: createdLead.id });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Customer Lead"
      subtitle="Register potential land buyer into Greenfield Estates pipeline"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Customer Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="name"
                placeholder="e.g. Vikram Malhotra"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 transition ${
                  errors.name
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:ring-blue-200 focus:border-blue-500'
                }`}
              />
            </div>
            {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mobile Phone (+91) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="phone"
                placeholder="e.g. 98450 12345"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 transition ${
                  errors.phone
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:ring-blue-200 focus:border-blue-500'
                }`}
              />
            </div>
            {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                placeholder="e.g. vikram.m@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border rounded-xl focus:outline-hidden focus:ring-2 transition ${
                  errors.email
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-200 focus:ring-blue-200 focus:border-blue-500'
                }`}
              />
            </div>
            {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current City / Region
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="city"
                placeholder="e.g. Bengaluru, Karnataka"
                value={formData.city}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Project & Budget Preferences */}
        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            Plot Requirements & Budget
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Preferred Project
              </label>
              <select
                name="preferredProjectId"
                value={formData.preferredProjectId}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.location.split(',')[0]})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Budget Range (₹ in Lakhs)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="budgetMinLakhs"
                  placeholder="Min"
                  value={formData.budgetMinLakhs}
                  onChange={handleChange}
                  className="w-1/2 px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl"
                />
                <span className="text-slate-400 text-xs font-bold">to</span>
                <input
                  type="number"
                  name="budgetMaxLakhs"
                  placeholder="Max"
                  value={formData.budgetMaxLakhs}
                  onChange={handleChange}
                  className="w-1/2 px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl"
                />
              </div>
              {errors.budget && <p className="text-[11px] text-rose-500 mt-1">{errors.budget}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Preferred Plot Size
              </label>
              <select
                name="interestedPlotType"
                value={formData.interestedPlotType}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl"
              >
                <option value="1,200 sq.ft (30x40)">1,200 sq.ft (30 × 40) - Villa</option>
                <option value="1,500 sq.ft (30x50)">1,500 sq.ft (30 × 50) - Executive</option>
                <option value="2,400 sq.ft (40x60)">2,400 sq.ft (40 × 60) - Estate</option>
                <option value="3,500+ sq.ft (Mansion)">3,500+ sq.ft - Mansion Parcel</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Facing Preference
              </label>
              <select
                name="facingPreference"
                value={formData.facingPreference}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl"
              >
                <option value="East">East (Vaastu Preferred)</option>
                <option value="North">North (Vaastu Preferred)</option>
                <option value="West">West</option>
                <option value="South">South</option>
                <option value="Corner Plot Preferred">Any Corner Plot</option>
              </select>
            </div>
          </div>
        </div>

        {/* Source & Agent Assignment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Lead Acquisition Source
            </label>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="Website Direct">Website Direct Inquiry</option>
              <option value="MagicBricks">MagicBricks Portal</option>
              <option value="99acres">99acres.com</option>
              <option value="Housing.com">Housing.com</option>
              <option value="Google Ads">Google Search Ads</option>
              <option value="Facebook Ads">Facebook / Instagram Ads</option>
              <option value="Walk-in">Direct Site Walk-in</option>
              <option value="Referral">Existing Owner Referral</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assigned Sales Agent
            </label>
            <select
              name="assignedAgentId"
              value={formData.assignedAgentId}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl"
            >
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name} ({ag.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Initial Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Inquiry Notes & Special Requests
          </label>
          <textarea
            name="notes"
            rows={2}
            placeholder="e.g. Looking to build immediately. Needs bank loan approval details."
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-sm active:scale-95"
          >
            Save Lead & View Profile
          </button>
        </div>
      </form>
    </Modal>
  );
}
