'use client';

import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import JobCard from './JobCard';

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

/**
 * KanbanBoard component for high-fidelity job pipeline management.
 * 
 * @param {Object} props
 * @param {Array} props.jobs - Array of job objects to display.
 * @param {Function} props.onUpdate - Callback to update a job's data/status.
 * @param {Function} props.onDelete - Callback to delete a job.
 * @param {Function} props.onEdit - Callback to trigger the edit modal for a job.
 */
export default function KanbanBoard({ jobs, onUpdate, onDelete, onEdit }) {
  const [activeId, setActiveId] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeJob = activeId ? jobs.find((j) => j.id === activeId) : null;

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveACard = active.data.current?.type === 'Job';
    const isOverACard = over.data.current?.type === 'Job';
    const isOverAColumn = over.data.current?.type === 'Column';

    if (!isActiveACard) return;

    // Dropping a card over another card
    if (isActiveACard && isOverACard) {
      const activeJob = jobs.find(j => j.id === activeId);
      const overJob = jobs.find(j => j.id === overId);

      if (activeJob && overJob && activeJob.status !== overJob.status) {
        onUpdate(activeId, { status: overJob.status });
      }
    }

    // Dropping a card over a column
    if (isActiveACard && isOverAColumn) {
      const activeJob = jobs.find(j => j.id === activeId);
      if (activeJob && activeJob.status !== overId) {
        onUpdate(activeId, { status: overId });
      }
    }
  };

  const handleDragEnd = () => {
    setActiveId(null);
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide min-h-[600px]">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.name}
            color={col.color}
            jobs={jobs.filter((j) => j.status === col.id)}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeId && activeJob ? (
          <div className="w-[320px] opacity-90 scale-105 cursor-grabbing">
            <JobCard 
              job={activeJob} 
              onUpdate={() => {}} 
              onDelete={() => {}} 
              onEdit={() => {}} 
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
