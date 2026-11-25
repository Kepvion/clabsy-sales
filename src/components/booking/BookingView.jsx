import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BookingSuccessModal } from './BookingSuccessModal';
import {
  BookmarkCheck,
  CheckCircle2,
  Building,
  User,
  CreditCard,
  FileCheck,
  Compass,
  AlertCircle,
  IndianRupee,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Check
} from 'lucide-react';
import { formatINR, formatLakhs, formatArea } from '../../utils/formatters';

export function BookingView() {
  const {
    plots,
    leads,
    projects,
    agents,
    selectedPlotIdForBooking,
    selectedLeadIdForBooking,
    bookPlot,
    lastConfirmedBooking,
    setLastConfirmedBooking
  } = useApp();

  // Available plots
  const availablePlots = plots.filter((p) => p.status === 'Available');

  // Wizard Step State (1: Plot, 2: Buyer, 3: Token, 4: Review)
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [selectedPlotId, setSelectedPlotId] = useState(
    selectedPlotIdForBooking || availablePlots[0]?.id || ''
  );
  const [leadMode, setLeadMode] = useState('EXISTING'); // 'EXISTING' | 'NEW'
  const [selectedLeadId, setSelectedLeadId] = useState(
    selectedLeadIdForBooking || leads[0]?.id || ''
  );

  // New buyer form fields
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPan, setBuyerPan] = useState('');

  // Payment fields
  const [tokenAmount, setTokenAmount] = useState(100000); // ₹1,00,000
  const [paymentMode, setPaymentMode] = useState('NEFT / RTGS Transfer');
  const [transactionRef, setTransactionRef] = useState(
    `HDFC-${Math.floor(100000 + Math.random() * 900000)}-NEFT`
  );
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

  // Modals & Validation
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Pre-selection listener
  useEffect(() => {
    if (selectedPlotIdForBooking) {
      setSelectedPlotId(selectedPlotIdForBooking);
    }
  }, [selectedPlotIdForBooking]);

  useEffect(() => {
    if (selectedLeadIdForBooking) {
      setSelectedLeadId(selectedLeadIdForBooking);
      setLeadMode('EXISTING');
    }
  }, [selectedLeadIdForBooking]);

  // Selected Plot & Project Details
  const currentPlot = plots.find((p) => p.id === selectedPlotId) || availablePlots[0];
  const currentProject = projects.find((p) => p.id === currentPlot?.projectId);
  const currentLead = leads.find((l) => l.id === selectedLeadId);

  // Calculation
  const totalAmountNum = currentPlot ? Math.round(currentPlot.totalPriceLakhs * 100000) : 0;
  const balanceDueNum = totalAmountNum - Number(tokenAmount);

  // Step Validation & Navigation
  const validateStep = (step) => {
    setValidationError('');
    if (step === 1) {
      if (!currentPlot) {
        setValidationError('Please choose an available plot to reserve.');
        return false;
      }
    } else if (step === 2) {
      if (leadMode === 'EXISTING') {
        if (!currentLead) {
          setValidationError('Please select a customer lead from your pipeline.');
          return false;
        }
      } else {
        if (!buyerName.trim()) {
          setValidationError('Buyer legal name is required.');
          return false;
        }
        if (!buyerPhone.trim()) {
          setValidationError('Buyer contact phone number is required.');
          return false;
        }
      }
    } else if (step === 3) {
      if (!tokenAmount || Number(tokenAmount) <= 0) {
        setValidationError('Please specify a valid token advance amount.');
        return false;
      }
      if (Number(tokenAmount) > totalAmountNum) {
        setValidationError('Token advance cannot exceed the total plot agreement value.');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setValidationError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepJump = (targetStep) => {
    if (targetStep < currentStep) {
      setValidationError('');
      setCurrentStep(targetStep);
    } else if (targetStep === currentStep + 1) {
      handleNextStep();
    }
  };

  const handleConfirmBooking = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setValidationError('');

    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    let customerName = '';
    let customerPhone = '';
    let customerEmail = '';

    if (leadMode === 'EXISTING') {
      customerName = currentLead.name;
      customerPhone = currentLead.phone;
      customerEmail = currentLead.email;
    } else {
      customerName = buyerName.trim();
      customerPhone = buyerPhone.trim();
      customerEmail = buyerEmail.trim();
    }

    const createdBooking = bookPlot({
      plotId: currentPlot.id,
      leadId: leadMode === 'EXISTING' ? currentLead.id : null,
      customerName,
      phone: customerPhone,
      email: customerEmail,
      projectId: currentPlot.projectId,
      tokenAmount: Number(tokenAmount),
      paymentMode,
      transactionRef: transactionRef.trim() || `TXN-${Date.now()}`,
      paymentDate,
      assignedAgentName: currentLead ? currentLead.assignedAgentName : agents[0].name
    });

    if (createdBooking) {
      setIsSuccessModalOpen(true);
    }
  };

  const stepsConfig = [
    { num: 1, title: 'Select Land Parcel', desc: 'Available Inventory' },
    { num: 2, title: 'Buyer Particulars', desc: 'Legal Allottee Record' },
    { num: 3, title: 'Token Advance', desc: 'Payment Instrument' },
    { num: 4, title: 'Issue Allotment', desc: 'Review & Stamped Seal' }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-[#141416] tracking-tight">
            Plot Reservation & Booking Workflow
          </h2>
          <p className="text-xs text-[#716e68] mt-1">
            Guided 4-step wizard to reserve land parcels, capture token advance, and issue official allotment letters
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#f4efe6] text-[#8c6d3b] text-xs font-medium border border-[#ddd3c3] self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-[#8c6d3b]" />
          <span>RERA Compliant Allotment</span>
        </span>
      </div>

      {/* Interactive 4-Step Stepper Header */}
      <div className="enterprise-card p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {stepsConfig.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            const isClickable = s.num < currentStep;

            let cardStyle = 'bg-[#faf8f5] border-[#ebe6df] text-[#8a857d]';
            let numStyle = 'bg-[#ebe6df] text-[#716e68]';

            if (isCompleted) {
              cardStyle = 'bg-[#f4efe6] border-[#ddd3c3] text-[#141416] hover:border-[#c5a880] cursor-pointer';
              numStyle = 'bg-[#141416] text-[#faf8f5]';
            } else if (isCurrent) {
              cardStyle = 'bg-[#fbf9f5] border-[#c5a880] text-[#141416] shadow-xs ring-1 ring-[#c5a880]/30';
              numStyle = 'bg-[#c5a880] text-[#141416] font-bold';
            }

            return (
              <div
                key={s.num}
                onClick={() => isClickable && handleStepJump(s.num)}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${cardStyle}`}
              >
                <span
                  className={`w-7 h-7 rounded-md font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs ${numStyle}`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                </span>
                <div className="min-w-0">
                  <span className="font-semibold text-xs block truncate text-[#141416]">
                    {s.title}
                  </span>
                  <span className="text-[10px] text-[#716e68] block truncate">
                    {s.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Wizard Form (Left) & Live Cost Sheet (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 2 Columns for Active Wizard Step */}
        <div className="lg:col-span-2 space-y-6">
          {/* STEP 1: SELECT AVAILABLE PLOT */}
          {currentStep === 1 && (
            <div className="enterprise-card p-5 sm:p-6 space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-[#ebe6df] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#141416] text-[#c5a880] font-bold text-xs flex items-center justify-center border border-[#c5a880]/30">
                    1
                  </span>
                  <h3 className="font-serif-luxury text-base text-[#141416]">
                    Select Available Land Parcel
                  </h3>
                </div>
                <span className="text-xs text-[#1e4a38] font-medium px-2.5 py-0.5 rounded-md bg-[#eaf3ee] border border-[#c2dece]">
                  {availablePlots.length} Parcels Available
                </span>
              </div>

              {availablePlots.length > 0 ? (
                <div className="space-y-4">
                  {/* Dropdown Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-[#141416] mb-1.5">
                      Select Parcel from Inventory
                    </label>
                    <select
                      value={selectedPlotId}
                      onChange={(e) => setSelectedPlotId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#faf8f5] border border-[#ebe6df] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#c5a880] focus:border-[#c5a880] font-medium text-[#141416]"
                    >
                      {availablePlots.map((p) => (
                        <option key={p.id} value={p.id}>
                          Plot {p.plotNumber} • {p.projectName} • {p.dimensions} ({p.areaSqFt} sq.ft) • {p.facing} Facing • {formatLakhs(p.totalPriceLakhs)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Visual Grid of Available Plots for Quick Pick */}
                  <div>
                    <span className="block text-xs font-semibold text-[#716e68] mb-2">
                      Or select a surveyed parcel from grid:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
                      {availablePlots.map((p) => {
                        const isSelected = p.id === currentPlot?.id;
                        return (
                          <div
                            key={p.id}
                            onClick={() => setSelectedPlotId(p.id)}
                            className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-[#fbf9f5] border-[#c5a880] shadow-xs ring-1 ring-[#c5a880]/40'
                                : 'bg-[#faf8f5] border-[#ebe6df] hover:bg-[#f4efe6] hover:border-[#ddd7cd]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-[#141416]">
                                Plot {p.plotNumber}
                              </span>
                              {p.isCorner && (
                                <span className="text-[9px] font-medium px-1 py-0.2 rounded-xs bg-[#f4efe6] text-[#8c6d3b] border border-[#ddd3c3]">
                                  Corner
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#716e68] block mt-0.5">
                              {p.dimensions} • {p.facing}
                            </span>
                            <span className="text-xs font-semibold text-[#141416] block mt-1 tabular-nums">
                              {formatLakhs(p.totalPriceLakhs)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Plot Highlight Summary */}
                  {currentPlot && (
                    <div className="p-4 rounded-lg bg-[#f4efe6] border border-[#ddd3c3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#141416] text-sm">
                            Plot {currentPlot.plotNumber} Selected
                          </span>
                          <span className="font-medium text-[#141416] px-2 py-0.5 rounded-md bg-[#e8e0d2] text-[10px]">
                            {currentPlot.facing} Facing
                          </span>
                          {currentPlot.isCorner && (
                            <span className="font-medium text-[#1e4a38] px-2 py-0.5 rounded-md bg-[#eaf3ee] border border-[#c2dece] text-[10px]">
                              Corner Parcel (+{currentPlot.cornerPremiumPercent}%)
                            </span>
                          )}
                        </div>
                        <p className="text-[#716e68] mt-1">
                          {currentPlot.projectName} • {currentPlot.dimensions} ({currentPlot.areaSqFt} sq.ft / {currentPlot.areaSqYd} sq.yd)
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[#716e68] text-[11px] block">Agreement Value</span>
                        <span className="font-serif-luxury text-lg text-[#141416] tabular-nums font-medium">
                          {formatLakhs(currentPlot.totalPriceLakhs)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-[#fbf9f5] border border-[#ebe6df] rounded-lg text-xs text-[#8c6d3b]">
                  No plots currently marked as Available. Reset demo data in the top bar to restore inventory.
                </div>
              )}

              {/* Step 1 Actions */}
              <div className="flex items-center justify-end pt-3 border-t border-[#ebe6df]">
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={availablePlots.length === 0}
                  className="px-5 py-2.5 rounded-md text-xs font-medium text-[#faf8f5] bg-[#141416] hover:bg-[#221f1b] border border-[#c5a880]/30 transition shadow-sm active:scale-95 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <span>Continue to Buyer Particulars</span>
                  <ArrowRight className="w-4 h-4 text-[#c5a880]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CUSTOMER BUYER PARTICULARS */}
          {currentStep === 2 && (
            <div className="enterprise-card p-5 sm:p-6 space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-[#ebe6df] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#141416] text-[#c5a880] font-bold text-xs flex items-center justify-center border border-[#c5a880]/30">
                    2
                  </span>
                  <h3 className="font-serif-luxury text-base text-[#141416]">
                    Customer Allottee Particulars
                  </h3>
                </div>

                <div className="flex items-center bg-[#f4efe6] p-0.5 rounded-md text-xs font-medium border border-[#ddd3c3]">
                  <button
                    type="button"
                    onClick={() => setLeadMode('EXISTING')}
                    className={`px-3 py-1 rounded-sm transition ${
                      leadMode === 'EXISTING'
                        ? 'bg-[#141416] text-[#faf8f5] shadow-2xs font-semibold'
                        : 'text-[#716e68] hover:text-[#141416]'
                    }`}
                  >
                    Select From Leads
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeadMode('NEW')}
                    className={`px-3 py-1 rounded-sm transition ${
                      leadMode === 'NEW'
                        ? 'bg-[#141416] text-[#faf8f5] shadow-2xs font-semibold'
                        : 'text-[#716e68] hover:text-[#141416]'
                    }`}
                  >
                    Enter New Buyer
                  </button>
                </div>
              </div>

              {leadMode === 'EXISTING' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#141416] mb-1.5">
                      Select Lead from Pipeline
                    </label>
                    <select
                      value={selectedLeadId}
                      onChange={(e) => setSelectedLeadId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#faf8f5] border border-[#ebe6df] rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#c5a880] focus:border-[#c5a880] text-[#141416] font-medium"
                    >
                      {leads.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name} • {l.phone} • Budget: {l.budgetDisplay} ({l.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  {currentLead && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {currentLead.name}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            Score: {currentLead.leadScore || 85}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-1">
                          Phone: <strong className="font-mono">{currentLead.phone}</strong> • {currentLead.email}
                        </p>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Budget: {currentLead.budgetDisplay} • Locality: {currentLead.city}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                          Assigned Agent
                        </span>
                        <span className="font-semibold text-slate-800 text-xs">
                          {currentLead.assignedAgentName}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Full Legal Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Vikram Malhotra"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Mobile Number (+91) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="+91 98450 12345"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="vikram.malhotra@gmail.com"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      PAN / Aadhaar Reference
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ABCDE1234F"
                      value={buyerPan}
                      onChange={(e) => setBuyerPan(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 uppercase font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Step 2 Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-[#ebe6df]">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2 rounded-md text-xs font-medium text-[#716e68] hover:bg-[#f4efe6] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Parcel</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-5 py-2.5 rounded-md text-xs font-medium text-[#faf8f5] bg-[#141416] hover:bg-[#221f1b] border border-[#c5a880]/30 transition shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Payment & Token</span>
                  <ArrowRight className="w-4 h-4 text-[#c5a880]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TOKEN ADVANCE & PAYMENT */}
          {currentStep === 3 && (
            <div className="enterprise-card p-5 sm:p-6 space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-[#ebe6df] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#141416] text-[#c5a880] font-bold text-xs flex items-center justify-center border border-[#c5a880]/30">
                    3
                  </span>
                  <h3 className="font-serif-luxury text-base text-[#141416]">
                    Token Advance & Payment Instrument
                  </h3>
                </div>
                <span className="text-xs text-[#716e68] font-medium">Step 3 of 4</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Token Amount */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#141416] mb-1">
                    Token Advance Amount (INR) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#8a857d]">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 bg-[#faf8f5] border border-[#ebe6df] rounded-lg font-bold text-[#141416] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#c5a880] focus:border-[#c5a880]"
                      step={10000}
                      min={50000}
                      required
                    />
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {[100000, 200000, 500000].map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => setTokenAmount(amt)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                          Number(tokenAmount) === amt
                            ? 'bg-[#141416] text-[#faf8f5] border border-[#c5a880]/40 shadow-2xs font-semibold'
                            : 'bg-[#f4efe6] hover:bg-[#ebe6df] text-[#141416] border border-[#ddd3c3]'
                        }`}
                      >
                        {formatINR(amt)}
                      </button>
                    ))}
                    {totalAmountNum > 0 && (
                      <button
                        type="button"
                        onClick={() => setTokenAmount(Math.round(totalAmountNum * 0.1))}
                        className={`px-3 py-1 rounded-md text-xs font-semibold border transition cursor-pointer ${
                          Number(tokenAmount) === Math.round(totalAmountNum * 0.1)
                            ? 'bg-[#141416] text-[#faf8f5] border-[#c5a880]/40 shadow-2xs'
                            : 'bg-[#fbf9f5] hover:bg-[#f4efe6] text-[#8c6d3b] border-[#ddd3c3]'
                        }`}
                      >
                        10% Standard Token ({formatINR(Math.round(totalAmountNum * 0.1), { compact: true })})
                      </button>
                    )}
                  </div>
                </div>

                {/* Payment Channel */}
                <div>
                  <label className="block font-semibold text-[#141416] mb-1">Payment Channel</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#faf8f5] border border-[#ebe6df] rounded-lg text-xs font-medium text-[#141416]"
                  >
                    <option value="NEFT / RTGS Transfer">NEFT / RTGS Online Transfer</option>
                    <option value="Cheque">Banker's Cheque / DD</option>
                    <option value="UPI / QR">UPI / QR Code</option>
                    <option value="Net Banking">Net Banking Gateway</option>
                  </select>
                </div>

                {/* Transaction Ref */}
                <div>
                  <label className="block font-semibold text-[#141416] mb-1">
                    Transaction / Cheque Reference #
                  </label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="e.g. HDFC-991204"
                    className="w-full px-3 py-2.5 bg-[#faf8f5] border border-[#ebe6df] rounded-lg font-mono text-xs text-[#141416]"
                  />
                </div>

                {/* Date */}
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#141416] mb-1">Payment Date</label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full sm:w-1/2 px-3 py-2 bg-[#faf8f5] border border-[#ebe6df] rounded-lg text-xs text-[#141416]"
                  />
                </div>
              </div>

              {/* Step 3 Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-[#ebe6df]">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2 rounded-md text-xs font-medium text-[#716e68] hover:bg-[#f4efe6] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Buyer</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-5 py-2.5 rounded-md text-xs font-medium text-[#faf8f5] bg-[#141416] hover:bg-[#221f1b] border border-[#c5a880]/30 transition shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span>Review Allotment Summary</span>
                  <ArrowRight className="w-4 h-4 text-[#c5a880]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & ISSUE ALLOTMENT */}
          {currentStep === 4 && (
            <div className="enterprise-card p-5 sm:p-6 space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-[#ebe6df] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#141416] text-[#c5a880] font-bold text-xs flex items-center justify-center border border-[#c5a880]/30">
                    4
                  </span>
                  <h3 className="font-serif-luxury text-base text-[#141416]">
                    Review Particulars & Issue Allotment
                  </h3>
                </div>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-[#f4efe6] text-[#8c6d3b] border border-[#ddd3c3]">
                  Ready to Issue Allotment
                </span>
              </div>

              {/* Pre-Flight Review Cards */}
              <div className="space-y-4 text-xs">
                {/* Land Parcel Card */}
                <div className="p-4 rounded-lg bg-[#faf8f5] border border-[#ebe6df] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#141416] text-sm">
                      Land Parcel: Plot {currentPlot?.plotNumber}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#e8e0d2] text-[#141416]">
                      {currentPlot?.facing} Facing
                    </span>
                  </div>
                  <p className="text-[#716e68]">
                    {currentPlot?.projectName} • Dimensions: {currentPlot?.dimensions} ({currentPlot?.areaSqFt} sq.ft / {currentPlot?.areaSqYd} sq.yd)
                  </p>
                  {currentPlot?.isCorner && (
                    <p className="text-[#1e4a38] font-semibold text-[11px]">
                      ★ Prime Corner Parcel (+{currentPlot?.cornerPremiumPercent}% Corner PLC Applied)
                    </p>
                  )}
                </div>

                {/* Buyer Card */}
                <div className="p-4 rounded-lg bg-[#faf8f5] border border-[#ebe6df] space-y-1.5">
                  <span className="text-[10px] text-[#716e68] uppercase font-semibold block">
                    Allottee Legal Record
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#141416] text-sm">
                      {leadMode === 'EXISTING' ? currentLead?.name : buyerName}
                    </span>
                    <span className="font-mono text-[#716e68]">
                      {leadMode === 'EXISTING' ? currentLead?.phone : buyerPhone}
                    </span>
                  </div>
                  <p className="text-[#716e68] text-[11px]">
                    Email: {leadMode === 'EXISTING' ? currentLead?.email : (buyerEmail || 'Not Provided')}
                  </p>
                </div>

                {/* Token & Financial Card */}
                <div className="p-4 rounded-lg bg-[#fbf9f5] border border-[#c5a880]/40 space-y-2">
                  <div className="flex items-center justify-between font-bold text-[#141416]">
                    <span>Token Advance Received:</span>
                    <span className="text-[#1e4a38] font-mono text-sm">{formatINR(tokenAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#716e68] text-[11px]">
                    <span>Payment Channel: {paymentMode}</span>
                    <span className="font-mono">Ref: {transactionRef}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#716e68] text-[11px]">
                    <span>Payment Date: {paymentDate}</span>
                    <span className="font-bold text-[#141416]">
                      Balance Due: {formatINR(balanceDueNum)}
                    </span>
                  </div>
                </div>

                {/* Legal & RERA Notice */}
                <div className="p-3.5 rounded-lg bg-[#f4efe6] border border-[#ddd3c3] text-[11px] text-[#716e68] leading-relaxed flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#8c6d3b] shrink-0 mt-0.5" />
                  <span>
                    Upon confirmation, Plot <strong>{currentPlot?.plotNumber}</strong> will be immediately marked as <strong>Reserved</strong> across the live master plan. A formal Provisional Allotment Letter will be issued under Karnataka RERA norms.
                  </span>
                </div>
              </div>

              {/* Step 4 Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-[#ebe6df]">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2 rounded-md text-xs font-medium text-[#716e68] hover:bg-[#f4efe6] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Payment</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  className="px-6 py-3 rounded-md text-xs sm:text-sm font-semibold text-[#141416] bg-[#c5a880] hover:bg-[#b8996e] border border-[#b3956a] transition shadow-md active:scale-98 flex items-center gap-2 cursor-pointer"
                >
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Confirm Booking & Issue Provisional Allotment Letter</span>
                </button>
              </div>
            </div>
          )}

          {/* Validation Banner if any */}
          {validationError && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Right: 1 Column for Live Cost Sheet & Summary */}
        <div className="space-y-4">
          <div className="enterprise-card p-5 sticky top-24 space-y-4">
            <div className="border-b border-[#ebe6df] pb-3">
              <span className="font-serif-luxury text-base text-[#141416] tracking-tight block">
                Booking Cost Sheet
              </span>
              <p className="text-[11px] text-[#716e68] mt-0.5">
                Official schedule for {currentProject?.name || 'Greenfield Estates'}
              </p>
            </div>

            {currentPlot ? (
              <div className="space-y-3 text-xs">
                {/* Plot info */}
                <div className="p-3.5 rounded-lg bg-[#faf8f5] border border-[#ebe6df]">
                  <div className="flex justify-between font-bold text-[#141416] text-sm">
                    <span>Plot {currentPlot.plotNumber}</span>
                    <span className="text-[#141416] font-serif-luxury text-base">{formatLakhs(currentPlot.totalPriceLakhs)}</span>
                  </div>
                  <div className="text-[11px] text-[#716e68] mt-1 flex justify-between">
                    <span>{currentPlot.dimensions}</span>
                    <span>{currentPlot.areaSqFt} sq.ft</span>
                  </div>
                </div>

                {/* Line items */}
                <div className="divide-y divide-[#ebe6df] text-[#716e68]">
                  <div className="py-2 flex justify-between">
                    <span>Base Land Rate (₹{currentPlot.pricePerSqFt}/sq.ft)</span>
                    <span className="font-medium text-[#141416]">
                      {formatINR(currentPlot.areaSqFt * (currentPlot.pricePerSqFt - 250))}
                    </span>
                  </div>

                  <div className="py-2 flex justify-between">
                    <span>Infrastructure & Roads</span>
                    <span className="font-medium text-[#141416]">
                      {formatINR(currentPlot.areaSqFt * 250)}
                    </span>
                  </div>

                  {currentPlot.isCorner && (
                    <div className="py-2 flex justify-between text-[#8c6d3b]">
                      <span>Corner PLC (+{currentPlot.cornerPremiumPercent}%)</span>
                      <span className="font-semibold">
                        {formatINR(
                          (currentPlot.areaSqFt *
                            (currentPlot.pricePerSqFt - 250) *
                            currentPlot.cornerPremiumPercent) /
                            100
                        )}
                      </span>
                    </div>
                  )}

                  <div className="py-2 flex justify-between">
                    <span>Clubhouse Life Membership</span>
                    <span className="font-medium text-[#141416]">
                      {formatINR(currentProject?.clubhouseCharges || 150000)}
                    </span>
                  </div>

                  <div className="py-2.5 flex justify-between font-bold text-[#141416] bg-[#f4efe6] px-2.5 rounded-md border border-[#ddd3c3]">
                    <span>Total Agreement Value</span>
                    <span className="text-[#141416] font-mono">{formatINR(totalAmountNum)}</span>
                  </div>

                  <div className="py-2.5 flex justify-between font-semibold text-[#1e4a38] bg-[#eaf3ee] px-2.5 rounded-md border border-[#c2dece]">
                    <span>Token Advance Received</span>
                    <span className="font-mono">- {formatINR(tokenAmount)}</span>
                  </div>

                  <div className="py-3 flex justify-between font-semibold text-sm text-[#141416] bg-[#fbf9f5] px-2.5 rounded-md border border-[#c5a880]/40">
                    <span>Balance Due at Registration</span>
                    <span className="font-mono text-[#8c6d3b] font-bold">{formatINR(balanceDueNum)}</span>
                  </div>
                </div>

                <div className="text-[10px] text-[#716e68] text-center leading-relaxed pt-2">
                  * On confirmation, Plot status immediately transitions from{' '}
                  <strong className="text-[#1e4a38]">Available</strong> to{' '}
                  <strong className="text-[#8c6d3b]">Reserved</strong>.
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#716e68]">Please select a plot to view the cost sheet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Booking Confirmation Receipt Modal */}
      <BookingSuccessModal
        booking={lastConfirmedBooking}
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
}
