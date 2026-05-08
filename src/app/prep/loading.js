'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import LogoLoader from '@/components/ui/LogoLoader';

export default function Loading() {
  return (
    <div className="animate-in fade-in flex min-h-[60vh] flex-1 flex-col items-center justify-center space-y-8 duration-700">
      <LogoLoader size="lg" />
      <div className="space-y-2 text-center">
        <div className="flex items-center justify-center gap-2">
          <Sparkles size={14} className="animate-pulse text-amber-400" />
          <h2 className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">
            Calibrating Readiness
          </h2>
        </div>
        <p className="text-[11px] font-bold tracking-widest text-white/10 uppercase">
          Initializing Training Matrix...
        </p>
      </div>

      <div className="h-1 w-48 overflow-hidden rounded-full bg-white/5">
        <div className="animate-loading-bar h-full w-1/3 bg-indigo-500/40" />
      </div>
    </div>
  );
}
