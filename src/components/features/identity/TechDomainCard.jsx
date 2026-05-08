'use client';

import React, { useState } from 'react';
import { Code2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDebouncedCallback } from '@/hooks/useDebounce';

/**
 * TechDomainCard component for tracking mastery in technical domains.
 */
export default function TechDomainCard({ topic, onUpdate, onDelete }) {
  const [mastery, setMastery] = useState(topic.mastery || 0);
  const debouncedUpdate = useDebouncedCallback((val) => onUpdate(topic.id, { mastery: val }), 500);

  return (
    <motion.div
      layout
      className="panel group border-white/5 bg-white/[0.01] hover:border-indigo-500/20"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-400">
            <Code2 size={16} />
          </div>
          <div>
            <input
              className="font-outfit w-full bg-transparent text-sm font-black text-white transition-colors outline-none focus:text-indigo-400"
              defaultValue={topic.topic}
              onBlur={(e) => onUpdate(topic.id, { topic: e.target.value })}
              placeholder="Domain Name..."
            />
            <p className="mt-0.5 text-[10px] font-bold tracking-widest text-white/20 uppercase">
              Technical Domain
            </p>
          </div>
        </div>
        <button
          onClick={() => onDelete(topic.id)}
          className="p-2 text-white/10 transition-all hover:text-rose-400"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <span className="font-outfit text-[10px] font-black tracking-tighter text-indigo-400 uppercase">
            Mastery Level
          </span>
          <span className="font-outfit text-xl font-black text-white">{mastery}%</span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${mastery}%` }}
            className="shadow-indigo h-full bg-indigo-500"
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[8px] font-bold tracking-widest text-white/10 uppercase">
            Mastery Stability
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-1 w-1 rounded-full ${i <= mastery / 20 ? 'shadow-indigo bg-indigo-500' : 'bg-white/5'}`}
              />
            ))}
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={mastery}
          onChange={(e) => {
            const v = parseInt(e.target.value);
            setMastery(v);
            debouncedUpdate(v);
          }}
          className="h-1 w-full cursor-pointer accent-indigo-500 opacity-20 transition-opacity hover:opacity-100"
        />
      </div>
    </motion.div>
  );
}
