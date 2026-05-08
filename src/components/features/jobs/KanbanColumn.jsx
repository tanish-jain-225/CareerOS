'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import JobCard from './JobCard';

function SortableJobCard({ job, onUpdate, onDelete, onEdit }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
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
        className="opacity-30 h-[120px] min-h-[120px] rounded-3xl border-2 border-dashed border-indigo-500/20 bg-indigo-500/5"
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
    <div className="flex flex-col w-[320px] min-w-[320px] h-full gap-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${currentStatusClass.split(' ')[2]} animate-pulse`} />
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{title}</h3>
        </div>
        <span className="text-[10px] font-black font-outfit text-white/20 bg-white/[0.03] px-2 py-1 rounded-lg">
          {jobs.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 flex flex-col gap-4 p-4 rounded-[32px] bg-white/[0.01] border border-white/5 min-h-[500px]"
      >
        <SortableContext items={jobs.map(j => j.id)} strategy={verticalListSortingStrategy}>
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
          <div className="flex-1 flex flex-col items-center justify-center opacity-10 py-20 pointer-events-none">
            <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center mb-4">
              <div className="w-1 h-1 rounded-full bg-white/40" />
            </div>
            <p className="text-[8px] font-black uppercase tracking-widest text-center">Empty Buffer</p>
          </div>
        )}
      </div>
    </div>
  );
}
