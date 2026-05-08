'use client';

import React, { useState } from 'react';
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Mail,
  Edit3,
  Trash2,
  Users,
  Send,
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
        className={`group border-b border-white/[0.03] transition-colors ${
          isSelected ? 'bg-indigo-500/[0.04]' : 'hover:bg-white/[0.01]'
        }`}
      >
        <td className="px-6 py-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onSelect(row.id)}
              className={`flex h-5 w-5 items-center justify-center rounded-lg border transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-500 text-white'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              {isSelected && <CheckCircle2 size={12} className="stroke-[3]" />}
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] text-xs font-black text-indigo-400 shadow-inner">
              {row.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <p className="font-outfit truncate text-sm leading-tight font-black text-white">
                {row.name}
              </p>
              <p className="mt-1 truncate text-[9px] font-bold tracking-widest text-white/20 uppercase">
                {row.role}
              </p>
            </div>
          </div>
        </td>
        <td className="px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-2 text-white/20 transition-colors group-hover:text-indigo-400">
              <Icon size={14} />
            </div>
            <select
              className="cursor-pointer bg-[#05070a] bg-transparent text-[9px] font-black tracking-[0.1em] text-white/40 uppercase transition-all outline-none hover:text-white"
              value={row.action}
              onChange={(e) => onUpdate(row.id, { action: e.target.value })}
            >
              {['Initial Reach-out', 'Follow-up 1', 'Follow-up 2', 'Interview Sync', 'Dormant'].map(
                (a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                )
              )}
            </select>
          </div>
        </td>
        <td className="px-6 py-5">
          <div className="flex items-center gap-6">
            <div className="min-w-[140px] flex-1 space-y-2">
              <div className="mb-1 flex items-center justify-between">
                <div
                  className={`flex items-center gap-2 text-[9px] font-black tracking-widest uppercase ${cadence.overdue ? 'text-rose-400' : 'text-white/30'}`}
                >
                  {cadence.label}{' '}
                  {cadence.overdue && <AlertCircle size={10} className="animate-pulse" />}
                </div>
                {cadence.overdue && (
                  <span className="text-[8px] font-black tracking-tighter text-rose-500/60 uppercase">
                    BREACHED
                  </span>
                )}
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, cadence.progress)}%` }}
                  className={`h-full transition-all duration-1000 ${
                    cadence.overdue ? 'shadow-rose bg-rose-500' : 'shadow-indigo bg-indigo-500'
                  }`}
                />
              </div>
            </div>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="rounded-xl p-2.5 text-white/10 transition-all hover:bg-white/5 hover:text-white"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </td>
      </motion.tr>
      <AnimatePresence>
        {expanded && (
          <tr key={`${row.id}-expanded`}>
            <td colSpan={3} className="px-6 pt-0 pb-6">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="panel mt-2 flex gap-6 border-white/5 bg-white/[0.01] p-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black tracking-[0.2em] text-indigo-400 uppercase">
                        Interaction Context
                      </p>
                      <span className="text-[8px] font-bold tracking-widest text-white/10 uppercase">
                        Target ID: {row.id?.slice(-6)}
                      </span>
                    </div>
                    <textarea
                      className="h-24 w-full resize-none bg-transparent text-xs leading-relaxed font-medium text-white/50 outline-none placeholder:text-white/5 focus:text-white"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      onBlur={() => onUpdate(row.id, { notes })}
                      placeholder="Enter specific details about this interaction loop..."
                    />
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.03] pt-4">
                      <Badge
                        variant={row.starred ? 'amber' : 'white'}
                        size="xs"
                        onClick={() => onUpdate(row.id, { starred: !row.starred })}
                      >
                        {row.starred ? 'High Priority' : 'Standard Priority'}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit(row)}
                          aria-label="Modify contact parameters"
                          className="flex items-center gap-2 rounded-xl bg-indigo-500/5 px-4 py-2 text-[9px] font-black tracking-widest text-indigo-400 uppercase transition-all hover:bg-indigo-500/10"
                        >
                          <Edit3 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => onDelete(row.id)}
                          aria-label="Purge contact from database"
                          className="flex items-center gap-2 rounded-xl bg-rose-500/5 px-4 py-2 text-[9px] font-black tracking-widest text-rose-500 uppercase transition-all hover:bg-rose-500/10"
                        >
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
    <div
      className={`panel space-y-4 border-white/5 bg-white/[0.01] p-5 ${isSelected ? 'border-indigo-500/30 bg-indigo-500/[0.02]' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelect(row.id)}
            className={`flex h-5 w-5 items-center justify-center rounded-lg border transition-all ${
              isSelected
                ? 'border-indigo-500 bg-indigo-500 text-white'
                : 'border-white/10 bg-white/5'
            }`}
          >
            {isSelected && <CheckCircle2 size={12} className="stroke-[3]" />}
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] text-xs font-black text-indigo-400">
            {row.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-outfit text-sm leading-tight font-black text-white">{row.name}</p>
            <p className="mt-1 text-[9px] font-bold tracking-widest text-white/20 uppercase">
              {row.role}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-2 text-white/20">
            <Icon size={14} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-y border-white/[0.03] py-3">
        <select
          className="cursor-pointer bg-[#05070a] bg-transparent text-[9px] font-black tracking-[0.1em] text-white/40 uppercase transition-all outline-none hover:text-white"
          value={row.action}
          onChange={(e) => onUpdate(row.id, { action: e.target.value })}
        >
          {['Initial Reach-out', 'Follow-up 1', 'Follow-up 2', 'Interview Sync', 'Dormant'].map(
            (a) => (
              <option key={a} value={a}>
                {a}
              </option>
            )
          )}
        </select>
        <div
          className={`flex items-center gap-2 text-[9px] font-black tracking-widest uppercase ${cadence.overdue ? 'text-rose-400' : 'text-white/30'}`}
        >
          {cadence.label} {cadence.overdue && <AlertCircle size={10} className="animate-pulse" />}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-[10px] font-black tracking-widest text-indigo-400 uppercase"
        >
          {expanded ? 'Hide Details' : 'Show Details'}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(row)}
            aria-label="Modify contact details"
            className="p-2 text-white/20 transition-colors hover:text-indigo-400"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={() => onDelete(row.id)}
            aria-label="Purge contact"
            className="p-2 text-white/20 transition-colors hover:text-rose-400"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pt-2"
          >
            <div className="space-y-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <p className="text-[10px] font-black tracking-[0.2em] text-indigo-400/60 uppercase">
                Notes
              </p>
              <p className="text-xs leading-relaxed font-medium text-white/40">
                {row.notes || 'No context recorded.'}
              </p>
              <div className="flex justify-between border-t border-white/[0.03] pt-3">
                <Badge
                  variant={row.starred ? 'amber' : 'white'}
                  size="xs"
                  onClick={() => onUpdate(row.id, { starred: !row.starred })}
                >
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
