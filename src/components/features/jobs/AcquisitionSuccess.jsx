'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Zap, ArrowRight, Building2, Briefcase } from 'lucide-react';

export default function AcquisitionSuccess({ job, onContinue }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center space-y-8 p-8 text-center">
      {/* Target Lock Animation */}
      <div className="relative">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          className="absolute inset-0 rounded-full bg-emerald-500/20 blur-3xl"
        />
        <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.4)]">
          <Target size={48} className="text-white" />
        </div>

        {/* Pulsing rings */}
        {[1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
            className="absolute inset-0 rounded-[2rem] border-2 border-emerald-500/30"
          />
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-emerald-400" />
          <h2 className="text-[10px] font-black tracking-[0.4em] text-emerald-400/60 uppercase">
            Target Lock Verified
          </h2>
        </div>
        <h1 className="font-outfit text-3xl font-black tracking-tighter text-white">
          Acquisition Sync Complete
        </h1>
      </div>

      <div className="panel w-full space-y-4 border-emerald-500/10 bg-emerald-500/[0.03] p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03]">
            <Building2 size={24} className="text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="mb-1 text-[9px] font-black tracking-widest text-white/20 uppercase">
              Company Entity
            </p>
            <p className="truncate font-black text-white">{job.company}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03]">
            <Briefcase size={24} className="text-indigo-400" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="mb-1 text-[9px] font-black tracking-widest text-white/20 uppercase">
              Mission Objective
            </p>
            <p className="truncate font-black text-white">{job.role}</p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-amber-400" />
            <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">
              Excitement Level
            </span>
          </div>
          <span className="text-xs font-black text-emerald-400">{job.excitement || 5}/10</span>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="btn-primary shadow-emerald flex h-14 w-full items-center justify-center gap-3 bg-emerald-500 shadow-lg hover:bg-emerald-600"
      >
        <span className="text-[10px] font-black tracking-widest uppercase">Deploy to Pipeline</span>
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
