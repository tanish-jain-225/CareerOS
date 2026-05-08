'use client';

import React, { useState } from 'react';
import { UserPlus, Edit3 } from 'lucide-react';

/**
 * ContactForm component for adding or editing network contacts.
 *
 * @param {Object} props
 * @param {Object} [props.initial] - Initial contact data for editing.
 * @param {Function} props.onSave - Callback when form is submitted.
 * @param {Function} props.onClose - Callback to close the modal.
 */
export default function ContactForm({ initial, onSave, onClose }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(
    initial || {
      name: '',
      role: '',
      company: '',
      platform: 'LinkedIn',
      action: 'Initial Reach-out',
      email: '',
      notes: '',
      status: 'Pending',
    }
  );
  const [emailError, setEmailError] = useState('');
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validateEmail = (email) => {
    if (!email) return true; // optional field
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSave = () => {
    if (form.email && !validateEmail(form.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    onSave(form);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="flex-1 space-y-2">
          <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-white/20 uppercase">
            Contact Name
          </label>
          <input
            className="input-field h-12 text-sm"
            maxLength={100}
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. John Smith"
            autoFocus
            data-testid="comms-name-input"
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-white/20 uppercase">
            Role / Title
          </label>
          <input
            className="input-field h-12 text-sm"
            maxLength={100}
            value={form.role}
            onChange={(e) => set('role', e.target.value)}
            placeholder="e.g. Engineering Manager"
            data-testid="comms-role-input"
          />
        </div>
      </div>
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="flex-1 space-y-2">
          <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-white/20 uppercase">
            Company
          </label>
          <input
            className="input-field h-12 text-sm"
            maxLength={100}
            value={form.company}
            onChange={(e) => set('company', e.target.value)}
            placeholder="e.g. Google"
            data-testid="comms-company-input"
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-white/20 uppercase">
            Platform
          </label>
          <select
            className="input-field h-12 bg-[#05070a] text-sm"
            value={form.platform}
            onChange={(e) => set('platform', e.target.value)}
          >
            {['LinkedIn', 'Email', 'Referral', 'Twitter', 'Phone'].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 space-y-2">
          <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-white/20 uppercase">
            Status
          </label>
          <select
            className="input-field h-12 bg-[#05070a] text-sm"
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
            data-testid="comms-status-select"
          >
            {['Pending', 'Replied', 'No Response', 'Meeting Set'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-white/20 uppercase">
          Email
        </label>
        <input
          className={`input-field h-12 text-sm ${emailError ? 'border-rose-500/40 focus:ring-rose-500/10' : ''}`}
          type="email"
          maxLength={150}
          value={form.email}
          onChange={(e) => {
            set('email', e.target.value);
            setEmailError('');
          }}
          placeholder="contact@company.com"
        />
        {emailError && <p className="ml-1 text-[9px] font-bold text-rose-400">{emailError}</p>}
      </div>
      <div className="space-y-2">
        <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-white/20 uppercase">
          Notes
        </label>
        <textarea
          className="input-field h-24 resize-none text-sm"
          maxLength={500}
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Context, talking points, referral chain..."
        />
      </div>
      <div className="flex items-center justify-end gap-4 border-t border-white/[0.03] pt-4">
        <button onClick={onClose} className="btn-secondary h-12 px-6">
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!form.name.trim()}
          className="btn-primary flex h-12 items-center gap-3 px-8"
          data-testid="comms-save"
        >
          {isEdit ? <Edit3 size={16} /> : <UserPlus size={16} />}
          <span className="text-[10px] font-black uppercase">
            {isEdit ? 'Update Contact' : 'Add Contact'}
          </span>
        </button>
      </div>
    </div>
  );
}
