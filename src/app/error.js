'use client';

import React from 'react';
import { RefreshCcw, ShieldAlert } from 'lucide-react';

import Image from 'next/image';

export default function Error({ error, reset }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] p-6 space-y-8 animate-in zoom-in-95 duration-500">
      <div className="relative">
        <div className="absolute inset-0 bg-rose-500/20 blur-3xl rounded-full" />
        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-rose-500/20 relative z-10 shadow-2xl overflow-hidden relative">
          <Image src="/logo.png" alt="Error" width={48} height={48} className="object-contain grayscale opacity-50" />
        </div>
      </div>

      <div className="text-center space-y-4 max-w-md">
        <div className="flex items-center justify-center gap-3">
          <ShieldAlert size={16} className="text-rose-400" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Critical System Error</h2>
        </div>
        <h1 className="text-2xl font-black font-outfit text-white leading-tight">Module Desynchronization Detected</h1>
        <p className="text-xs font-medium text-white/20 leading-relaxed">
          The intelligence node encountered an unhandled exception. This could be due to a network interruption or a corrupted data stream.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="btn-primary bg-rose-500 hover:bg-rose-600 text-white h-14 px-8 flex items-center gap-3 shadow-[0_0_20px_rgba(244,63,94,0.3)] active:scale-95 transition-all"
        >
          <RefreshCcw size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">Attempt Recovery</span>
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="btn-secondary h-14 px-8 flex items-center gap-3 active:scale-95 transition-all"
        >
          <span className="text-[10px] font-black uppercase tracking-widest">Return to Dashboard</span>
        </button>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="panel bg-rose-500/5 border-rose-500/10 p-4 rounded-xl mt-8">
          <p className="text-[10px] font-mono text-rose-400 break-all">{error.message}</p>
        </div>
      )}
    </div>
  );
}
