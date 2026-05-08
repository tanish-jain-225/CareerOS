'use client';

import React from 'react';
import { TrendingUp, Activity } from 'lucide-react';

/**
 * ConversionFunnel component for visualizing application pipeline efficiency.
 */
export default function ConversionFunnel({ metrics, responseRate }) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="panel relative flex flex-[2] flex-col items-center gap-10 overflow-hidden border-white/5 bg-white/[0.01] p-8 sm:flex-row">
        <div className="absolute top-0 right-0 -z-0 p-8 opacity-[0.03]">
          <TrendingUp size={120} strokeWidth={1} />
        </div>
        <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-around gap-8 sm:flex-row">
          {metrics.map((step) => (
            <div key={step.label} className="group space-y-2 text-center">
              <p className="font-outfit text-4xl font-black tracking-tighter text-white transition-colors group-hover:text-indigo-400">
                {step.value}
              </p>
              <p className="text-[9px] font-black tracking-[0.3em] text-white/20 uppercase">
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="panel relative flex flex-1 flex-col items-center justify-center overflow-hidden border-indigo-500/10 bg-indigo-500/5 p-8 text-center">
        <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative z-10 space-y-2">
          <div className="mb-2 flex items-center justify-center gap-2">
            <Activity size={14} className="animate-pulse text-indigo-400" />
            <span className="text-[10px] font-black tracking-[0.4em] text-indigo-400/60 uppercase">
              Sync Efficiency
            </span>
          </div>
          <p className="font-outfit text-5xl font-black tracking-tighter text-white">
            {responseRate}%
          </p>
          <p className="px-4 text-[9px] leading-relaxed font-bold tracking-widest text-white/20 uppercase">
            Total Pipeline Response & Target Conversion Rate
          </p>
        </div>
      </div>
    </div>
  );
}
