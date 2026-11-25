import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import {
  CheckCircle2,
  Printer,
  Download,
  Building2,
  ShieldCheck,
  User,
  Calendar,
  Share2,
  Sparkles
} from 'lucide-react';
import { formatINR, formatLakhs, formatDate } from '../../utils/formatters';

export function BookingSuccessModal({ booking, isOpen, onClose }) {
  const { navigateTo, company } = useApp();

  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleGoToInventory = () => {
    onClose();
    navigateTo('inventory');
  };

  const handleGoToCustomer = () => {
    onClose();
    navigateTo('customer-details', { customerId: booking.leadId });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      subtitle=""
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 -mt-2">
        {/* Celebration Header */}
        <div className="text-center pb-3">
          <div className="w-14 h-14 rounded-full bg-[#f4efe6] text-[#8c6d3b] border border-[#ddd3c3] flex items-center justify-center mx-auto mb-3 shadow-xs">
            <CheckCircle2 className="w-7 h-7 text-[#8c6d3b]" />
          </div>
          <span className="text-[11px] font-medium uppercase tracking-widest text-[#8c6d3b] px-3 py-1 bg-[#fbf9f5] rounded-md border border-[#ddd3c3]">
            Booking Confirmed & Parcel Reserved
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-[#141416] mt-2 tracking-tight">
            Provisional Allotment Letter
          </h2>
          <p className="text-xs text-[#716e68] mt-1">
            Parcel <strong className="text-[#141416]">Plot {booking.plotNumber}</strong> in{' '}
            <strong className="text-[#141416]">{booking.projectName}</strong> has been successfully
            placed under reservation.
          </p>
        </div>

        {/* Formal Allotment Letter Card */}
        <div className="p-6 rounded-lg bg-[#faf8f5] border border-[#ddd3c3] space-y-5 text-xs text-[#141416] font-sans print:border-none print:p-0">
          {/* Header of Letter */}
          <div className="flex items-center justify-between border-b border-[#ebe6df] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-[#141416] text-[#c5a880] font-serif-luxury text-xl font-bold flex items-center justify-center border border-[#c5a880]/30 shrink-0">
                G
              </div>
              <div>
                <span className="font-serif-luxury text-lg font-medium text-[#141416] block">{company.name}</span>
                <p className="text-[11px] text-[#716e68]">{company.headquarters}</p>
                <p className="text-[10px] text-[#8c6d3b] font-mono mt-0.5">RERA: {company.reraId}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#716e68] uppercase font-semibold block">
                Booking Reference
              </span>
              <span className="font-mono font-bold text-[#141416] text-sm">
                {booking.bookingNumber}
              </span>
              <span className="text-[10px] text-[#716e68] block mt-0.5">
                Date: {formatDate(booking.date)}
              </span>
            </div>
          </div>

          {/* Allotment & Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-lg bg-white border border-[#ebe6df]">
              <span className="text-[10px] uppercase font-semibold text-[#716e68] block">
                Allottee / Buyer Details
              </span>
              <p className="font-bold text-sm text-[#141416] mt-1">{booking.customerName}</p>
              <p className="text-xs text-[#716e68] mt-0.5 font-mono">{booking.phone}</p>
              <p className="text-xs text-[#716e68] truncate">{booking.email}</p>
            </div>

            <div className="p-3.5 rounded-lg bg-white border border-[#ebe6df]">
              <span className="text-[10px] uppercase font-semibold text-[#716e68] block">
                Allotted Land Parcel
              </span>
              <p className="font-bold text-sm text-[#141416] mt-1">
                Plot Number: {booking.plotNumber}
              </p>
              <p className="text-xs text-[#716e68] mt-0.5">
                Area: {booking.plotAreaSqFt} sq.ft ({booking.facing} Facing)
              </p>
              <p className="text-xs text-[#716e68]">{booking.projectName}</p>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="rounded-lg border border-[#ebe6df] bg-white overflow-hidden">
            <div className="bg-[#f4efe6] px-4 py-2 text-[11px] font-semibold uppercase text-[#141416] flex justify-between border-b border-[#ebe6df]">
              <span>Financial Schedule</span>
              <span>Amount (INR)</span>
            </div>
            <div className="divide-y divide-[#ebe6df] text-xs">
              <div className="flex justify-between px-4 py-2">
                <span className="text-[#716e68]">Base Land & Development Value</span>
                <span className="font-medium text-[#141416]">{formatINR(booking.baseAmount)}</span>
              </div>
              <div className="flex justify-between px-4 py-2">
                <span className="text-[#716e68]">Clubhouse & Amenities Fee</span>
                <span className="font-medium text-[#141416]">
                  {formatINR(booking.clubhouseCharges)}
                </span>
              </div>
              <div className="flex justify-between px-4 py-2 bg-[#faf8f5] font-bold">
                <span className="text-[#141416]">Total Plot Consideration</span>
                <span className="text-[#141416] font-mono">{formatINR(booking.totalAmount)}</span>
              </div>
              <div className="flex justify-between px-4 py-2 bg-[#eaf3ee] text-[#1e4a38] font-semibold">
                <span>Token Advance Received ({booking.paymentMode})</span>
                <span className="font-mono text-[#1e4a38]">- {formatINR(booking.tokenAmount)}</span>
              </div>
              <div className="flex justify-between px-4 py-2.5 bg-[#fbf9f5] font-bold text-sm border-t border-[#ebe6df]">
                <span className="text-[#141416]">Balance Payable on Sale Deed</span>
                <span className="font-mono text-[#8c6d3b]">{formatINR(booking.balanceDue)}</span>
              </div>
            </div>
          </div>

          {/* Payment reference & Verification */}
          <div className="flex items-center justify-between text-[11px] text-[#716e68] pt-1">
            <span>
              Txn Reference: <strong className="font-mono text-[#141416]">{booking.transactionRef}</strong>
            </span>
            <span>
              Sales Lead: <strong className="text-[#141416]">{booking.assignedAgentName}</strong>
            </span>
          </div>

          {/* Verification Watermark & Official Seal */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-lg bg-[#f4efe6] border border-[#ddd3c3] text-[11px] text-[#141416]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#8c6d3b] shrink-0" />
              <div>
                <span className="font-semibold uppercase tracking-wider block text-xs">Official Stamped Allotment</span>
                <span className="text-[10px] text-[#716e68]">Digital Token Record Authorized by Greenfield Estates Registrar</span>
              </div>
            </div>
            <div className="text-right font-mono text-[10px] text-[#8c6d3b] bg-white px-2.5 py-1 rounded-md border border-[#ddd3c3] font-bold">
              SEAL: GFE-RERA-AUTH-VERIFIED
            </div>
          </div>

          <div className="text-[10px] text-[#716e68] text-center border-t border-[#ebe6df] pt-3">
            * This is an automated provisional allotment confirmation issued by Greenfield Estates
            via Clabsy CRM. Official registered sale agreement will follow within 30 days.
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2 rounded-md text-xs font-medium bg-[#f4efe6] hover:bg-[#ebe6df] text-[#141416] border border-[#ddd3c3] transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#8c6d3b]" />
            <span>Print Allotment Letter</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleGoToInventory}
              className="flex-1 sm:flex-none px-4 py-2 rounded-md text-xs font-medium bg-[#faf8f5] text-[#141416] hover:bg-[#f4efe6] border border-[#ebe6df] transition text-center cursor-pointer"
            >
              View in Inventory
            </button>
            <button
              onClick={handleGoToCustomer}
              className="flex-1 sm:flex-none px-5 py-2 rounded-md text-xs font-medium bg-[#141416] text-[#faf8f5] hover:bg-[#221f1b] border border-[#c5a880]/30 transition shadow-sm text-center cursor-pointer"
            >
              View Buyer 360°
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
