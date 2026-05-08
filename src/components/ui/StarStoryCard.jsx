'use client';

import React from 'react';
import { MessageSquare, Trash2, CheckCircle2 } from 'lucide-react';

/**
 * StarStoryCard component for defining behavioral stories in STAR format.
 */
export default function StarStoryCard({ story, onUpdate, onDelete }) {
  return (
    <div className="panel group space-y-6 border-white/5 bg-white/[0.01] transition-all hover:border-amber-500/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
            <MessageSquare size={16} />
          </div>
          <input
            className="font-outfit w-full bg-transparent text-sm font-black text-white transition-colors outline-none focus:text-amber-400"
            defaultValue={story.title}
            onBlur={(e) => onUpdate(story.id, { title: e.target.value })}
            placeholder="Event Title..."
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDelete(story.id)}
            className="p-2 text-white/10 transition-all hover:text-rose-400"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-wrap gap-4 md:flex-row">
        {[
          { key: 'situation', label: 'Situation' },
          { key: 'task_', label: 'Task' },
          { key: 'action', label: 'Action' },
          { key: 'result', label: 'Result' },
        ].map(({ key, label }) => (
          <div key={key} className="relative min-w-full flex-1 space-y-3 sm:min-w-[calc(50%-16px)]">
            <div className="flex items-center justify-between">
              <label className="ml-1 text-[9px] font-black tracking-widest text-white/20 uppercase">
                {label}
              </label>
              {story[key] && <CheckCircle2 size={10} className="text-emerald-500/50" />}
            </div>
            <textarea
              className="h-28 w-full resize-none rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-[11px] leading-relaxed font-medium text-white/60 transition-all outline-none placeholder:text-white/5 focus:border-white/10 focus:bg-white/[0.04] focus:text-white"
              defaultValue={story[key]}
              onBlur={(e) => onUpdate(story.id, { [key]: e.target.value })}
              placeholder={`Define the ${label}...`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
