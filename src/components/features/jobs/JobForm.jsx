'use client';

import React, { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import StarRating from '@/components/ui/StarRating';

const COLUMNS = [
  { id: 'sourced',     name: 'Sourced',       color: 'indigo' },
  { id: 'shortlisted', name: 'Shortlisted',   color: 'blue' },
  { id: 'applied',     name: 'Applied',       color: 'emerald' },
  { id: 'followed_up', name: 'Followed-up',   color: 'teal' },
  { id: 'oa',          name: 'OA Invited',    color: 'amber' },
  { id: 'interview',   name: 'Interview',     color: 'rose' },
  { id: 'offer',       name: 'Offer / Close', color: 'emerald' },
  { id: 'rejected',    name: 'Rejected',      color: 'rose' },
];

const QUALITY_GATE = [
  { id: 'resume_mapped',    label: 'Resume keyword mapped' },
  { id: 'project_bullets',  label: 'Project alignment' },
  { id: 'links_verified',   label: 'Verification sync' },
  { id: 'outreach_drafted', label: 'Drafted transmission' },
  { id: 'followup_set',     label: 'Follow-up cadence' },
];

/**
 * JobForm component for acquiring new targets or updating existing intelligence.
 */
export default function JobForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial ? { ...initial, qualityGate: initial.qualityGate || {} } : {
    company: '', role: '', status: 'sourced',
    appliedDate: new Date().toISOString().split('T')[0],
    excitement: 3, source: 'LinkedIn', notes: '', jobUrl: '',
    qualityGate: {}
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Company Entity</label>
          <input 
            className="input-field text-sm h-12" 
            maxLength={100} 
            value={form.company} 
            onChange={e => set('company', e.target.value)} 
            placeholder="e.g. Google" 
            autoFocus 
            data-testid="jobs-company-input" 
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Role Title</label>
          <input 
            className="input-field text-sm h-12" 
            maxLength={100} 
            value={form.role} 
            onChange={e => set('role', e.target.value)} 
            placeholder="e.g. SDE II" 
            data-testid="jobs-role-input" 
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Pipeline Stage</label>
          <select 
            className="input-field h-12 text-sm bg-[#05070a]" 
            value={form.status} 
            onChange={e => set('status', e.target.value)} 
            data-testid="jobs-status-select"
          >
            {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Applied Date</label>
          <input 
            type="date" 
            className="input-field h-12 text-sm" 
            value={form.appliedDate} 
            onChange={e => set('appliedDate', e.target.value)} 
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Infiltration Source</label>
          <select 
            className="input-field h-12 text-sm bg-[#05070a]" 
            value={form.source} 
            onChange={e => set('source', e.target.value)}
          >
            {['LinkedIn', 'Company Site', 'Referral', 'AngelList', 'Twitter'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Target URL</label>
        <input 
          className="input-field h-12 text-sm" 
          maxLength={500} 
          value={form.jobUrl || ''} 
          onChange={e => set('jobUrl', e.target.value)} 
          placeholder="https://..." 
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Intelligence Notes</label>
        <textarea 
          className="input-field text-sm resize-none h-24" 
          maxLength={500} 
          value={form.notes || ''} 
          onChange={e => set('notes', e.target.value)} 
          placeholder="Key requirements, stack, specific insights..." 
        />
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Quality Gate Readiness</label>
        <div className="flex flex-wrap gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
          {QUALITY_GATE.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => set('qualityGate', { ...form.qualityGate, [item.id]: !form.qualityGate?.[item.id] })}
              className="flex items-center gap-3 py-1 text-left group/gate min-w-[140px]"
            >
              <div className={`w-3.5 h-3.5 rounded-sm border transition-all flex items-center justify-center ${form.qualityGate?.[item.id] ? 'bg-indigo-500 border-indigo-500' : 'border-white/10 group-hover/gate:border-indigo-500/30'}`}>
                {form.qualityGate?.[item.id] && <CheckCircle2 size={10} className="text-white" />}
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-widest ${form.qualityGate?.[item.id] ? 'text-white/40 line-through' : 'text-white/60'}`}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/[0.03]">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Excitement Level</label>
          <StarRating value={form.excitement} onChange={v => set('excitement', v)} size={20} />
        </div>
        <div className="flex gap-4">
          <button type="button" onClick={onClose} className="btn-secondary h-12 px-6">Cancel</button>
          <button 
            type="button"
            onClick={() => onSave(form)} 
            disabled={!form.company.trim() || !form.role.trim()} 
            className="btn-primary h-12 px-8 flex items-center gap-3" 
            data-testid="jobs-save"
          >
            <Save size={16} /> <span className="text-[10px] uppercase font-black">Sync Target</span>
          </button>
        </div>
      </div>
    </div>
  );
}
