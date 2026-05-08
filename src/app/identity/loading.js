'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import LogoLoader from '@/components/ui/LogoLoader';

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-700">
      <LogoLoader size="lg" />
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Sparkles size={14} className="text-indigo-400 animate-pulse" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Synchronizing Sector</h2>
        </div>
        <p className="text-[11px] font-bold text-white/10 uppercase tracking-widest">Accessing Intelligence Nodes...</p>
      </div>
      
      <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-500/40 w-1/3 animate-loading-bar" />
      </div>
    </div>
  );
}
