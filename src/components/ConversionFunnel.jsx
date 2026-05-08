'use client';

import React from 'react';
import { TrendingUp, Activity } from 'lucide-react';

/**
 * ConversionFunnel component for visualizing application pipeline efficiency.
 */
export default function ConversionFunnel({ metrics, responseRate }) {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-[2] panel bg-white/[0.01] border-white/5 p-8 relative overflow-hidden flex flex-col sm:flex-row items-center gap-10">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] -z-0">
          <TrendingUp size={120} strokeWidth={1} />
        </div>
        <div className="flex-1 w-full flex flex-col sm:flex-row items-center justify-around gap-8 relative z-10">
          {metrics.map((step) => (
            <div key={step.label} className="text-center space-y-2 group">
              <p className="text-4xl font-black font-outfit text-white group-hover:text-indigo-400 transition-colors tracking-tighter">{step.value}</p>
              <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">{step.label}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex-1 panel bg-indigo-500/5 border-indigo-500/10 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity size={14} className="text-indigo-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400/60">Sync Efficiency</span>
          </div>
          <p className="text-5xl font-black font-outfit text-white tracking-tighter">{responseRate}%</p>
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-relaxed px-4">
            Total Pipeline Response & Target Conversion Rate
          </p>
        </div>
      </div>
    </div>
  );
}
