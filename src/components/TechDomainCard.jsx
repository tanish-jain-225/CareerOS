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
      className="panel group border-white/5 hover:border-indigo-500/20 bg-white/[0.01]"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Code2 size={16} />
          </div>
          <div>
            <input
              className="bg-transparent font-black font-outfit text-white outline-none w-full focus:text-indigo-400 transition-colors text-sm"
              defaultValue={topic.topic}
              onBlur={e => onUpdate(topic.id, { topic: e.target.value })}
              placeholder="Domain Name..."
            />
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-0.5">Technical Domain</p>
          </div>
        </div>
        <button onClick={() => onDelete(topic.id)} className="p-2 text-white/10 hover:text-rose-400 transition-all">
          <Trash2 size={14} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black font-outfit text-indigo-400 uppercase tracking-tighter">Mastery Level</span>
          <span className="text-xl font-black font-outfit text-white">{mastery}%</span>
        </div>
        <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${mastery}%` }}
            className="h-full bg-indigo-500 shadow-indigo"
          />
        </div>
        <div className="flex justify-between items-center">
          <p className="text-[8px] font-bold text-white/10 uppercase tracking-widest">Mastery Stability</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`w-1 h-1 rounded-full ${i <= (mastery / 20) ? 'bg-indigo-500 shadow-indigo' : 'bg-white/5'}`} />
            ))}
          </div>
        </div>
        <input
          type="range" min="0" max="100"
          value={mastery}
          onChange={e => {
            const v = parseInt(e.target.value);
            setMastery(v);
            debouncedUpdate(v);
          }}
          className="w-full accent-indigo-500 h-1 cursor-pointer opacity-20 hover:opacity-100 transition-opacity"
        />
      </div>
    </motion.div>
  );
}
