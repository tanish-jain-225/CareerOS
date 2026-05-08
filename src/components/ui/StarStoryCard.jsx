'use client';

import React from 'react';
import { MessageSquare, Trash2, CheckCircle2 } from 'lucide-react';

/**
 * StarStoryCard component for defining behavioral stories in STAR format.
 */
export default function StarStoryCard({ story, onUpdate, onDelete }) {
  return (
    <div className="panel border-white/5 bg-white/[0.01] hover:border-amber-500/20 transition-all group space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
            <MessageSquare size={16} />
          </div>
          <input
            className="bg-transparent font-black font-outfit text-white outline-none w-full focus:text-amber-400 transition-colors text-sm"
            defaultValue={story.title}
            onBlur={e => onUpdate(story.id, { title: e.target.value })}
            placeholder="Event Title..."
          />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onDelete(story.id)} className="p-2 text-white/10 hover:text-rose-400 transition-all">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-wrap gap-4">
        {[
          { key: 'situation', label: 'Situation' },
          { key: 'task_', label: 'Task' },
          { key: 'action', label: 'Action' },
          { key: 'result', label: 'Result' },
        ].map(({ key, label }) => (
          <div key={key} className="flex-1 min-w-full sm:min-w-[calc(50%-16px)] space-y-3 relative">
            <div className="flex items-center justify-between">
              <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">{label}</label>
              {story[key] && <CheckCircle2 size={10} className="text-emerald-500/50" />}
            </div>
            <textarea
              className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-[11px] text-white/60 w-full outline-none resize-none h-28 focus:text-white focus:bg-white/[0.04] focus:border-white/10 transition-all leading-relaxed font-medium placeholder:text-white/5"
              defaultValue={story[key]}
              onBlur={e => onUpdate(story.id, { [key]: e.target.value })}
              placeholder={`Define the ${label}...`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
