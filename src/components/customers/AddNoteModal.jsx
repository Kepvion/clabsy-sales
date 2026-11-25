import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { MessageSquare, PhoneCall, Mail, MessageCircle, FileText } from 'lucide-react';

export function AddNoteModal({ isOpen, onClose, onAddNote, customerName }) {
  const [noteType, setNoteType] = useState('CALL');
  const [noteText, setNoteText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    let prefix = '[Phone Call]';
    if (noteType === 'WHATSAPP') prefix = '[WhatsApp Discussion]';
    if (noteType === 'EMAIL') prefix = '[Email Inquiry]';
    if (noteType === 'MEETING') prefix = '[In-Person Meeting]';

    onAddNote(`${prefix} ${noteText.trim()}`);
    setNoteText('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Interaction Note"
      subtitle={`Record conversation or sales update for ${customerName || 'Customer'}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Interaction Type Pills */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Communication Channel
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'CALL', label: 'Call', icon: PhoneCall },
              { id: 'WHATSAPP', label: 'WhatsApp', icon: MessageCircle },
              { id: 'EMAIL', label: 'Email', icon: Mail },
              { id: 'MEETING', label: 'Meeting', icon: MessageSquare }
            ].map((type) => {
              const Icon = type.icon;
              const isActive = noteType === type.id;
              return (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => setNoteType(type.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-semibold transition border ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-blue-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Note textarea */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Discussion Summary / Action Items
          </label>
          <textarea
            rows={4}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="e.g. Discussed Plot A-104 pricing. Buyer is ready to issue token advance cheque after Sunday site walkthrough."
            className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            required
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-sm active:scale-95"
          >
            Save Note
          </button>
        </div>
      </form>
    </Modal>
  );
}
