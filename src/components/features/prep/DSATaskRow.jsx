'use client';

import React from 'react';
import { CheckCircle2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const DIFF_COLORS = {
  easy: { bg: 'bg-emerald-500/5 border-emerald-500/10', text: 'text-emerald-400', label: 'Easy' },
  medium: { bg: 'bg-amber-500/5 border-amber-500/10', text: 'text-amber-400', label: 'Medium' },
  hard: { bg: 'bg-rose-500/5 border-rose-500/10', text: 'text-rose-400', label: 'Hard' },
};

/**
 * DSATaskRow component for a single DSA problem entry.
 */
export default function DSATaskRow({ task, onUpdate, onDelete }) {
  const diff = DIFF_COLORS[task.difficulty] || DIFF_COLORS.medium;
  
  return (
    <motion.div 
      layout
      className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.015] border border-white/5 group hover:bg-white/[0.03] transition-all"
    >
      <button
        onClick={() => onUpdate(task.id, { completed: !task.completed })}
        className={`w-6 h-6 rounded-lg border transition-all flex items-center justify-center flex-shrink-0 ${
          task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-white/10 bg-white/5 hover:border-emerald-500/30'
        }`}
        data-testid={`dsa-toggle-${task.id}`}
        data-completed={task.completed ? 'true' : 'false'}
      >
        {task.completed && <CheckCircle2 size={12} className="text-white" />}
      </button>
      
      <div className="flex-1 min-w-0">
        <input
          className={`bg-transparent text-xs font-bold w-full outline-none transition-colors ${
            task.completed ? 'text-white/20 line-through' : 'text-white/70 group-hover:text-white'
          }`}
          defaultValue={task.title}
          onBlur={e => onUpdate(task.id, { title: e.target.value })}
          placeholder="Problem Title..."
          data-testid={`dsa-title-${task.id}`}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            const diffs = ['easy', 'medium', 'hard'];
            const cur = diffs.indexOf(task.difficulty || 'medium');
            onUpdate(task.id, { difficulty: diffs[(cur + 1) % 3] });
          }}
          className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border transition-all ${diff.bg} ${diff.text}`}
        >
          {diff.label}
        </button>
        <button onClick={() => onDelete(task.id)} className="p-2 text-white/10 hover:text-rose-400 transition-all">
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
}
