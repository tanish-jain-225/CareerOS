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
export default function StatCard({
  label,
  value,
  hint,
  tone = 'text-indigo-400',
  icon: Icon,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
      className="panel glass-card-hover group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">
        <Icon size={80} strokeWidth={1} />
      </div>
      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-2">
          <div className={`rounded-lg border border-white/5 bg-white/[0.03] p-2 ${tone}`}>
            <Icon size={16} />
          </div>
          <p className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">{label}</p>
        </div>
        <div className="flex items-end gap-2">
          <p className={`font-outfit text-4xl font-black tracking-tighter ${tone}`}>{value}</p>
        </div>
        <p className="mt-4 text-[10px] leading-relaxed font-bold tracking-widest text-white/20 uppercase">
          {hint}
        </p>
      </div>
    </motion.div>
  );
}
