'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * StatCard component for displaying dashboard metrics with high-fidelity aesthetics.
 * @param {string} label - The label for the statistic.
 * @param {string|number} value - The value to display.
 * @param {string} hint - A brief description or secondary metric.
 * @param {string} tone - Tailwind color class for text styling.
 * @param {React.ElementType} icon - Lucide icon component.
 * @param {number} delay - Animation delay factor.
 */
export default function StatCard({ label, value, hint, tone = 'text-indigo-400', icon: Icon, delay = 0 }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
      className="panel glass-card-hover group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon size={80} strokeWidth={1} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-2 rounded-lg bg-white/[0.03] border border-white/5 ${tone}`}>
            <Icon size={16} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{label}</p>
        </div>
        <div className="flex items-end gap-2">
          <p className={`text-4xl font-black font-outfit tracking-tighter ${tone}`}>{value}</p>
        </div>
        <p className="mt-4 text-[10px] font-bold text-white/20 uppercase tracking-widest leading-relaxed">{hint}</p>
      </div>
    </motion.div>
  );
}
