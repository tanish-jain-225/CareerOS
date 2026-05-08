'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

/**
 * SuccessAnalytics component for visualizing the recruitment funnel.
 * 
 * @param {Object} props
 * @param {Array} props.jobs - All job records.
 * @param {Object} props.metrics - Calculated metrics (interviews, offers).
 */
export default function SuccessAnalytics({ jobs, metrics }) {
  const steps = [
    { label: 'Sourced', count: jobs.length, pct: jobs.length > 0 ? 100 : 0, color: 'bg-indigo-500' },
    { label: 'Applications', count: jobs.filter(j => !['sourced', 'shortlisted'].includes(j.status)).length, pct: jobs.length ? Math.round((jobs.filter(j => !['sourced', 'shortlisted'].includes(j.status)).length / jobs.length) * 100) : 0, color: 'bg-blue-500' },
    { label: 'Interviews', count: metrics.interviews, pct: jobs.length ? Math.round((metrics.interviews / jobs.length) * 100) : 0, color: 'bg-rose-500' },
    { label: 'Offers', count: metrics.offers, pct: jobs.length ? Math.round((metrics.offers / jobs.length) * 100) : 0, color: 'bg-emerald-500' },
  ];

  return (
    <div className="flex-1 panel border-white/5 bg-white/[0.01] p-8 space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
        <TrendingUp size={120} strokeWidth={1} />
      </div>
      <div className="space-y-1 relative z-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Success Analytics</h3>
        <h4 className="text-xl font-black font-outfit text-white">Infiltration Pipeline</h4>
      </div>
      <div className="space-y-6 relative z-10">
        {steps.map((step, i) => (
          <div key={step.label} className="space-y-2">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-white/20">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">{step.label}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-black font-outfit text-white">{step.count}</span>
                <span className="ml-2 text-[9px] font-black text-white/20">{step.pct}%</span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${step.pct}%` }}
                transition={{ duration: 1.5, delay: i * 0.2, ease: "circOut" }}
                className={`h-full ${step.color} shadow-[0_0_8px_rgba(99,102,241,0.3)]`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
