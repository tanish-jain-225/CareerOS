'use client';

import React, { useState } from 'react';
import {
  AlertCircle,
  Edit3,
  Trash2,
  CalendarDays,
  Target,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StarRating from '@/components/ui/StarRating';
import { useModal } from '@/context/ModalContext';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { getFollowUpStatus } from '@/utils/dateUtils';

const QUALITY_GATE = [
  { id: 'resume_mapped', label: 'Resume keyword mapped' },
  { id: 'project_bullets', label: 'Project alignment' },
  { id: 'links_verified', label: 'Verification sync' },
  { id: 'outreach_drafted', label: 'Drafted transmission' },
  { id: 'followup_set', label: 'Follow-up cadence' },
];

/**
 * JobCard component for representing a single job application node.
 *
 * @param {Object} props
 * @param {Object} props.job - The job application object.
 * @param {Function} props.onUpdate - Callback to update job details.
 * @param {Function} props.onDelete - Callback to remove the job record.
 * @param {Function} props.onEdit - Callback to open the edit form.
 * @param {Object} props.dragHandleProps - dnd-kit attributes and listeners for dragging.
 */
export default function JobCard({ job, onUpdate, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false);
  const followUp = getFollowUpStatus(job);
  const gate = job.qualityGate || {};
  const { openModal, closeModal } = useModal();

  const handleDelete = (e) => {
    e.stopPropagation();
    openModal(
      <ConfirmDialog
        message={`Delete ${job.company} — ${job.role}? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => {
          onDelete(job.id);
          closeModal();
        }}
        onCancel={closeModal}
      />,
      { title: 'Confirm Deletion', size: 'sm' }
    );
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(job);
  };

  const statusColors = {
    sourced: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    shortlisted: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    applied: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    followed_up: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    oa: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    interview: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    offer: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    rejected: 'bg-white/5 text-white/30 border-white/5',
  };

  const statusLabels = {
    sourced: 'Sourced',
    shortlisted: 'Shortlisted',
    applied: 'Applied',
    followed_up: 'Followed-up',
    oa: 'OA Invited',
    interview: 'Interview',
    offer: 'Offer / Close',
    rejected: 'Rejected',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel group hover:shadow-indigo relative h-full cursor-default border-white/5 bg-white/[0.01] transition-all hover:border-indigo-500/30 hover:bg-white/[0.03]"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] text-xs font-black text-indigo-400 uppercase shadow-inner">
            {job.company?.[0] || '?'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center justify-between gap-2">
              <h4 className="font-outfit truncate text-sm leading-tight font-black text-white transition-colors group-hover:text-indigo-400">
                {job.company}
              </h4>
              <span
                className={`rounded-lg border px-2 py-0.5 text-[7px] font-black tracking-tighter uppercase ${statusColors[job.status] || statusColors.sourced}`}
              >
                {statusLabels[job.status] || 'Active'}
              </span>
            </div>
            <p className="truncate text-[9px] font-bold tracking-widest text-white/20 uppercase">
              {job.role}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleEdit}
              aria-label="Edit job details"
              className="p-1.5 text-white/20 transition-colors hover:text-indigo-400"
              data-testid="job-edit-button"
            >
              <Edit3 size={14} />
            </button>
            <button
              onClick={handleDelete}
              aria-label="Purge job entry"
              className="p-1.5 text-white/20 transition-colors hover:text-rose-400"
              data-testid="job-delete-button"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {followUp && (
          <div
            className={`chip flex items-center gap-2 px-2.5 py-1 ${followUp.level === 'critical' ? 'border-rose-500/10 bg-rose-500/5 text-rose-500' : 'border-amber-500/10 bg-amber-500/5 text-amber-500'}`}
          >
            <AlertCircle size={10} className="animate-pulse" />
            <span className="text-[8px] font-black tracking-widest uppercase">
              {followUp.label}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-white/[0.03] pt-4">
          <StarRating
            value={job.excitement || 0}
            onChange={(v) => onUpdate(job.id, { excitement: v })}
            size={12}
          />
          <button
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? 'Collapse details' : 'Expand details'}
            className="p-1 text-white/10 transition-colors hover:text-white"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4 overflow-hidden pt-2"
            >
              <div className="space-y-1.5">
                {QUALITY_GATE.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      onUpdate(job.id, { qualityGate: { ...gate, [item.id]: !gate[item.id] } })
                    }
                    className="group/gate flex w-full items-center gap-3 py-1 text-left"
                  >
                    <div
                      className={`flex h-3 w-3 items-center justify-center rounded-sm border transition-all ${gate[item.id] ? 'border-indigo-500 bg-indigo-500' : 'border-white/10 group-hover/gate:border-indigo-500/30'}`}
                    >
                      {gate[item.id] && <CheckCircle2 size={8} className="text-white" />}
                    </div>
                    <span
                      className={`text-[9px] font-bold tracking-widest uppercase ${gate[item.id] ? 'text-white/20 line-through' : 'text-white/40'}`}
                    >
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
              {job.notes && (
                <p
                  className="line-clamp-3 text-[10px] leading-relaxed font-medium text-white/20 italic"
                  data-testid="job-card-notes"
                >
                  &quot;{job.notes}&quot;
                </p>
              )}
              <div className="flex items-center justify-between border-t border-white/[0.03] pt-4 text-[8px] font-black tracking-widest text-white/10 uppercase">
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={10} /> {job.appliedDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Target size={10} /> {job.source}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
