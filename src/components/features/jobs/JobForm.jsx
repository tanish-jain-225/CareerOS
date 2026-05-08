'use client';

import React, { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import StarRating from '@/components/ui/StarRating';

const COLUMNS = [
  { id: 'sourced', name: 'Sourced', color: 'indigo' },
  { id: 'shortlisted', name: 'Shortlisted', color: 'blue' },
  { id: 'applied', name: 'Applied', color: 'emerald' },
  { id: 'followed_up', name: 'Followed-up', color: 'teal' },
  { id: 'oa', name: 'OA Invited', color: 'amber' },
  { id: 'interview', name: 'Interview', color: 'rose' },
  { id: 'offer', name: 'Offer / Close', color: 'emerald' },
  { id: 'rejected', name: 'Rejected', color: 'rose' },
];

const QUALITY_GATE = [
  { id: 'resume_mapped', label: 'Resume keyword mapped' },
  { id: 'project_bullets', label: 'Project alignment' },
  { id: 'links_verified', label: 'Verification sync' },
  { id: 'outreach_drafted', label: 'Drafted transmission' },
  { id: 'followup_set', label: 'Follow-up cadence' },
];

/**
 * JobForm component for acquiring new targets or updating existing intelligence.
 */
export default function JobForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(
    initial
      ? { ...initial, qualityGate: initial.qualityGate || {} }
      : {
          company: '',
          role: '',
          status: 'sourced',
          appliedDate: new Date().toISOString().split('T')[0],
          excitement: 3,
          source: 'LinkedIn',
          notes: '',
          jobUrl: '',
          qualityGate: {},
        }
  );

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="flex-1 space-y-2">
          <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-white/20 uppercase">
            Company Entity
          </label>
          <input
            className="input-field h-12 text-sm"
            maxLength={100}
            value={form.company}
            onChange={(e) => set('company', e.target.value)}
            placeholder="e.g. Google"
            autoFocus
            data-testid="jobs-company-input"
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-white/20 uppercase">
            Role Title
          </label>
          <input
            className="input-field h-12 text-sm"
            maxLength={100}
            value={form.role}
            onChange={(e) => set('role', e.target.value)}
            placeholder="e.g. SDE II"
            data-testid="jobs-role-input"
          />
        </div>
      </div>

      <div className="flex flex-col gap-5 md:flex-row">
        <div className="flex-1 space-y-2">
          <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-white/20 uppercase">
            Pipeline Stage
          </label>
          <select
            className="input-field h-12 bg-[#05070a] text-sm"
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
            data-testid="jobs-status-select"
          >
            {COLUMNS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 space-y-2">
          <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-white/20 uppercase">
            Applied Date
          </label>
          <input
            type="date"
            className="input-field h-12 text-sm"
            value={form.appliedDate}
            onChange={(e) => set('appliedDate', e.target.value)}
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-white/20 uppercase">
            Infiltration Source
          </label>
          <select
            className="input-field h-12 bg-[#05070a] text-sm"
            value={form.source}
            onChange={(e) => set('source', e.target.value)}
          >
            {['LinkedIn', 'Company Site', 'Referral', 'AngelList', 'Twitter'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-white/20 uppercase">
          Target URL
        </label>
        <input
          className="input-field h-12 text-sm"
          maxLength={500}
          value={form.jobUrl || ''}
          onChange={(e) => set('jobUrl', e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-2">
        <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-white/20 uppercase">
          Intelligence Notes
        </label>
        <textarea
          className="input-field h-24 resize-none text-sm"
          maxLength={500}
          value={form.notes || ''}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Key requirements, stack, specific insights..."
        />
      </div>

      <div className="space-y-3">
        <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-white/20 uppercase">
          Quality Gate Readiness
        </label>
        <div className="flex flex-wrap gap-4 rounded-2xl border border-white/5 bg-white/[0.01] p-4">
          {QUALITY_GATE.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                set('qualityGate', { ...form.qualityGate, [item.id]: !form.qualityGate?.[item.id] })
              }
              className="group/gate flex min-w-[140px] items-center gap-3 py-1 text-left"
            >
              <div
                className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm border transition-all ${form.qualityGate?.[item.id] ? 'border-indigo-500 bg-indigo-500' : 'border-white/10 group-hover/gate:border-indigo-500/30'}`}
              >
                {form.qualityGate?.[item.id] && <CheckCircle2 size={10} className="text-white" />}
              </div>
              <span
                className={`text-[9px] font-bold tracking-widest uppercase ${form.qualityGate?.[item.id] ? 'text-white/40 line-through' : 'text-white/60'}`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/[0.03] pt-4">
        <div className="space-y-2">
          <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-white/20 uppercase">
            Excitement Level
          </label>
          <StarRating value={form.excitement} onChange={(v) => set('excitement', v)} size={20} />
        </div>
        <div className="flex gap-4">
          <button type="button" onClick={onClose} className="btn-secondary h-12 px-6">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(form)}
            disabled={!form.company.trim() || !form.role.trim()}
            className="btn-primary flex h-12 items-center gap-3 px-8"
            data-testid="jobs-save"
          >
            <Save size={16} /> <span className="text-[10px] font-black uppercase">Sync Target</span>
          </button>
        </div>
      </div>
    </div>
  );
}
