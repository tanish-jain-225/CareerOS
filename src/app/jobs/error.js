'use client';

import React from 'react';
import { RefreshCcw, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  return (
    <div className="animate-in zoom-in-95 flex min-h-[70vh] flex-1 flex-col items-center justify-center space-y-8 p-6 duration-500">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-3xl" />
        <div className="relative z-10 overflow-hidden rounded-[2.5rem] border border-rose-500/20 bg-white/[0.02] p-8 shadow-2xl">
          <ShieldAlert size={48} className="text-rose-500 opacity-50" />
        </div>
      </div>

      <div className="max-w-md space-y-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <ShieldAlert size={16} className="text-rose-400" />
          <h2 className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">
            Sector Breach
          </h2>
        </div>
        <h1 className="font-outfit text-2xl leading-tight font-black text-white">
          Module Desynchronization
        </h1>
        <p className="text-xs leading-relaxed font-medium text-white/20">
          The tactical node encountered an unhandled exception. This could be due to a network
          interruption or a corrupted data stream.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <button
          onClick={() => reset()}
          className="btn-primary flex h-14 items-center gap-3 bg-rose-500 px-8 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all hover:bg-rose-600 active:scale-95"
        >
          <RefreshCcw size={18} />
          <span className="text-[10px] font-black tracking-widest uppercase">Attempt Recovery</span>
        </button>
        <Link
          href="/"
          className="btn-secondary flex h-14 items-center justify-center gap-3 px-8 transition-all active:scale-95"
        >
          <span className="text-[10px] font-black tracking-widest uppercase">
            Return to Dashboard
          </span>
        </Link>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="panel mt-8 rounded-xl border-rose-500/10 bg-rose-500/5 p-4">
          <p className="font-mono text-[10px] break-all text-rose-400">
            {error?.message || 'Unknown Tactical Error'}
          </p>
        </div>
      )}
    </div>
  );
}
