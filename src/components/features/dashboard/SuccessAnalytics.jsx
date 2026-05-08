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
    {
      label: 'Sourced',
      count: jobs.length,
      pct: jobs.length > 0 ? 100 : 0,
      color: 'bg-indigo-500',
    },
    {
      label: 'Applications',
      count: jobs.filter((j) => !['sourced', 'shortlisted'].includes(j.status)).length,
      pct: jobs.length
        ? Math.round(
            (jobs.filter((j) => !['sourced', 'shortlisted'].includes(j.status)).length /
              jobs.length) *
              100
          )
        : 0,
      color: 'bg-blue-500',
    },
    {
      label: 'Interviews',
      count: metrics.interviews,
      pct: jobs.length ? Math.round((metrics.interviews / jobs.length) * 100) : 0,
      color: 'bg-rose-500',
    },
    {
      label: 'Offers',
      count: metrics.offers,
      pct: jobs.length ? Math.round((metrics.offers / jobs.length) * 100) : 0,
      color: 'bg-emerald-500',
    },
  ];

  return (
    <div className="panel relative flex-1 space-y-8 overflow-hidden border-white/5 bg-white/[0.01] p-8">
      <div className="pointer-events-none absolute top-0 right-0 p-8 opacity-[0.02]">
        <TrendingUp size={120} strokeWidth={1} />
      </div>
      <div className="relative z-10 space-y-1">
        <h3 className="text-[10px] font-black tracking-[0.3em] text-indigo-400 uppercase">
          Success Analytics
        </h3>
        <h4 className="font-outfit text-xl font-black text-white">Infiltration Pipeline</h4>
      </div>
      <div className="relative z-10 space-y-6">
        {steps.map((step, i) => (
          <div key={step.label} className="space-y-2">
            <div className="flex items-end justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-white/20">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[11px] font-bold tracking-widest text-white/60 uppercase">
                  {step.label}
                </span>
              </div>
              <div className="text-right">
                <span className="font-outfit text-sm font-black text-white">{step.count}</span>
                <span className="ml-2 text-[9px] font-black text-white/20">{step.pct}%</span>
              </div>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${step.pct}%` }}
                transition={{ duration: 1.5, delay: i * 0.2, ease: 'circOut' }}
                className={`h-full ${step.color} shadow-[0_0_8px_rgba(99,102,241,0.3)]`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
