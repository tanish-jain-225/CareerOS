'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import JobCard from './JobCard';

function SortableJobCard({ job, onUpdate, onDelete, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: job.id,
    data: {
      type: 'Job',
      job,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-[120px] min-h-[120px] rounded-3xl border-2 border-dashed border-indigo-500/20 bg-indigo-500/5 opacity-30"
      />
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <JobCard
        job={job}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onEdit={onEdit}
        dragHandleProps={listeners}
      />
    </div>
  );
}

/**
 * KanbanColumn component for displaying a pipeline stage.
 *
 * @param {Object} props
 * @param {string} props.id - Unique identifier for the column (status id).
 * @param {string} props.title - Display name of the column.
 * @param {Array} props.jobs - Filtered jobs belonging to this column.
 * @param {string} props.color - Color theme for the column (indigo, blue, etc).
 * @param {Function} props.onUpdate - Callback to update a job.
 * @param {Function} props.onDelete - Callback to delete a job.
 * @param {Function} props.onEdit - Callback to edit a job.
 */
export default function KanbanColumn({ id, title, jobs, color, onUpdate, onDelete, onEdit }) {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: 'Column',
    },
  });

  const colorClasses = {
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 shadow-indigo',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-blue',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald',
    teal: 'text-teal-400 bg-teal-500/10 border-teal-500/20 shadow-teal',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-amber',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-rose',
  };

  const currentStatusClass = colorClasses[color] || colorClasses.indigo;

  return (
    <div className="flex h-full w-[320px] min-w-[320px] flex-col gap-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div
            className={`h-2 w-2 rounded-full ${currentStatusClass.split(' ')[2]} animate-pulse`}
          />
          <h3 className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">
            {title}
          </h3>
        </div>
        <span className="font-outfit rounded-lg bg-white/[0.03] px-2 py-1 text-[10px] font-black text-white/20">
          {jobs.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className="flex min-h-[500px] flex-1 flex-col gap-4 rounded-[32px] border border-white/5 bg-white/[0.01] p-4"
      >
        <SortableContext items={jobs.map((j) => j.id)} strategy={verticalListSortingStrategy}>
          {jobs.map((job) => (
            <SortableJobCard
              key={job.id}
              job={job}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </SortableContext>

        {jobs.length === 0 && (
          <div className="pointer-events-none flex flex-1 flex-col items-center justify-center py-20 opacity-10">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-dashed border-white/20">
              <div className="h-1 w-1 rounded-full bg-white/40" />
            </div>
            <p className="text-center text-[8px] font-black tracking-widest uppercase">
              Empty Buffer
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
