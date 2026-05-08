'use client';

import React, { useState } from 'react';
import { 
  AlertCircle, ChevronDown, ChevronUp, CheckCircle2, 
  Mail, Edit3, Trash2, Users, Send 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LinkedInIcon } from '@/components/ui/BrandIcons';
import { getCadenceStatus } from '@/utils/dateUtils';
import Badge from '@/components/ui/Badge';

const PLATFORM_ICON = { LinkedIn: LinkedInIcon, Email: Mail, Referral: Users };

/**
 * InteractionRow component for desktop table view.
 */
export function InteractionRow({ row, onUpdate, onDelete, isSelected, onSelect, onEdit }) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(row.notes || '');
  const cadence = getCadenceStatus(row.createdAt);
  const Icon = PLATFORM_ICON[row.platform] || Send;

  return (
    <>
      <motion.tr 
        layout 
        className={`transition-colors group border-b border-white/[0.03] ${
          isSelected ? 'bg-indigo-500/[0.04]' : 'hover:bg-white/[0.01]'
        }`}
      >
        <td className="px-6 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onSelect(row.id)}
              className={`w-5 h-5 rounded-lg border transition-all flex items-center justify-center ${
                isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              {isSelected && <CheckCircle2 size={12} className="stroke-[3]" />}
            </button>
            <div className="w-10 h-10 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-xs font-black text-indigo-400 shadow-inner">
              {row.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <p className="font-black font-outfit text-white text-sm leading-tight truncate">{row.name}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/20 mt-1 truncate">{row.role}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-white/20 group-hover:text-indigo-400 transition-colors">
              <Icon size={14} />
            </div>
            <select
              className="bg-transparent text-white/40 font-black uppercase text-[9px] tracking-[0.1em] outline-none cursor-pointer hover:text-white transition-all bg-[#05070a]"
              value={row.action} onChange={e => onUpdate(row.id, { action: e.target.value })}
            >
              {['Initial Reach-out', 'Follow-up 1', 'Follow-up 2', 'Interview Sync', 'Dormant'].map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </td>
        <td className="px-6 py-5">
          <div className="flex items-center gap-6">
            <div className="flex-1 space-y-2 min-w-[140px]">
              <div className="flex items-center justify-between mb-1">
                <div className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${cadence.overdue ? 'text-rose-400' : 'text-white/30'}`}>
                  {cadence.label} {cadence.overdue && <AlertCircle size={10} className="animate-pulse" />}
                </div>
                {cadence.overdue && (
                  <span className="text-[8px] font-black uppercase text-rose-500/60 tracking-tighter">BREACHED</span>
                )}
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, cadence.progress)}%` }}
                  className={`h-full transition-all duration-1000 ${
                    cadence.overdue ? 'bg-rose-500 shadow-rose' : 'bg-indigo-500 shadow-indigo'
                  }`}
                />
              </div>
            </div>
            <button onClick={() => setExpanded(v => !v)} className="p-2.5 text-white/10 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </td>
      </motion.tr>
      <AnimatePresence>
        {expanded && (
          <tr key={`${row.id}-expanded`}>
            <td colSpan={3} className="px-6 pb-6 pt-0">
              <motion.div 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: 'auto', opacity: 1 }} 
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="panel bg-white/[0.01] border-white/5 p-6 flex gap-6 mt-2">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Interaction Context</p>
                      <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest">Target ID: {row.id?.slice(-6)}</span>
                    </div>
                    <textarea
                      className="w-full bg-transparent text-xs text-white/50 focus:text-white outline-none resize-none h-24 font-medium leading-relaxed placeholder:text-white/5"
                      value={notes} onChange={e => setNotes(e.target.value)} onBlur={() => onUpdate(row.id, { notes })}
                      placeholder="Enter specific details about this interaction loop..."
                    />
                    <div className="flex justify-between items-center gap-3 pt-4 border-t border-white/[0.03] flex-wrap">
                      <Badge variant={row.starred ? 'amber' : 'white'} size="xs" onClick={() => onUpdate(row.id, { starred: !row.starred })}>
                        {row.starred ? 'High Priority' : 'Standard Priority'}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <button onClick={() => onEdit(row)} aria-label="Modify contact parameters" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/5 text-indigo-400 text-[9px] font-black uppercase tracking-widest hover:bg-indigo-500/10 transition-all">
                          <Edit3 size={12} /> Edit
                        </button>
                        <button onClick={() => onDelete(row.id)} aria-label="Purge contact from database" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/5 text-rose-500 text-[9px] font-black uppercase tracking-widest hover:bg-rose-500/10 transition-all">
                          <Trash2 size={12} /> Purge
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * InteractionCard component for mobile card view.
 */
export function InteractionCard({ row, onUpdate, onDelete, isSelected, onSelect, onEdit }) {
  const [expanded, setExpanded] = useState(false);
  const cadence = getCadenceStatus(row.createdAt);
  const Icon = PLATFORM_ICON[row.platform] || Send;

  return (
    <div className={`panel border-white/5 bg-white/[0.01] p-5 space-y-4 ${isSelected ? 'border-indigo-500/30 bg-indigo-500/[0.02]' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelect(row.id)}
            className={`w-5 h-5 rounded-lg border transition-all flex items-center justify-center ${
              isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-white/10 bg-white/5'
            }`}
          >
            {isSelected && <CheckCircle2 size={12} className="stroke-[3]" />}
          </button>
          <div className="w-10 h-10 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-xs font-black text-indigo-400">
            {row.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-black font-outfit text-white text-sm leading-tight">{row.name}</p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/20 mt-1">{row.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5 text-white/20">
            <Icon size={14} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-3 border-y border-white/[0.03]">
        <select
          className="bg-transparent text-white/40 font-black uppercase text-[9px] tracking-[0.1em] outline-none cursor-pointer hover:text-white transition-all bg-[#05070a]"
          value={row.action} onChange={e => onUpdate(row.id, { action: e.target.value })}
        >
          {['Initial Reach-out', 'Follow-up 1', 'Follow-up 2', 'Interview Sync', 'Dormant'].map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <div className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${cadence.overdue ? 'text-rose-400' : 'text-white/30'}`}>
          {cadence.label} {cadence.overdue && <AlertCircle size={10} className="animate-pulse" />}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={() => setExpanded(!expanded)} className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
          {expanded ? 'Hide Details' : 'Show Details'}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit(row)} aria-label="Modify contact details" className="p-2 text-white/20 hover:text-indigo-400 transition-colors"><Edit3 size={14} /></button>
          <button onClick={() => onDelete(row.id)} aria-label="Purge contact" className="p-2 text-white/20 hover:text-rose-400 transition-colors"><Trash2 size={14} /></button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pt-2">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/60">Notes</p>
              <p className="text-xs text-white/40 font-medium leading-relaxed">{row.notes || 'No context recorded.'}</p>
              <div className="pt-3 border-t border-white/[0.03] flex justify-between">
                <Badge variant={row.starred ? 'amber' : 'white'} size="xs" onClick={() => onUpdate(row.id, { starred: !row.starred })}>
                  {row.starred ? 'High Priority' : 'Standard Priority'}
                </Badge>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
