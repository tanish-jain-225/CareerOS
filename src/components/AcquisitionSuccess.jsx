'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Zap, ArrowRight, Building2, Briefcase } from 'lucide-react';

export default function AcquisitionSuccess({ job, onContinue }) {
  return (
    <div className="p-8 flex flex-col items-center text-center space-y-8 max-w-md mx-auto">
      {/* Target Lock Animation */}
      <div className="relative">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"
        />
        <div className="w-24 h-24 rounded-[2rem] bg-emerald-500 flex items-center justify-center relative z-10 shadow-[0_0_40px_rgba(16,185,129,0.4)]">
          <Target size={48} className="text-white" />
        </div>
        
        {/* Pulsing rings */}
        {[1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
            className="absolute inset-0 border-2 border-emerald-500/30 rounded-[2rem]"
          />
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-emerald-400" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400/60">Target Lock Verified</h2>
        </div>
        <h1 className="text-3xl font-black font-outfit text-white tracking-tighter">Acquisition Sync Complete</h1>
      </div>

      <div className="w-full panel bg-emerald-500/[0.03] border-emerald-500/10 p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
            <Building2 size={24} className="text-emerald-400" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Company Entity</p>
            <p className="font-black text-white truncate">{job.company}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
            <Briefcase size={24} className="text-indigo-400" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Mission Objective</p>
            <p className="font-black text-white truncate">{job.role}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-amber-400" />
            <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Excitement Level</span>
          </div>
          <span className="text-xs font-black text-emerald-400">{job.excitement || 5}/10</span>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="btn-primary w-full h-14 bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center gap-3 shadow-emerald shadow-lg"
      >
        <span className="text-[10px] font-black uppercase tracking-widest">Deploy to Pipeline</span>
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
