'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { motion } from 'framer-motion';

import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6 space-y-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-rose-500/20 blur-[100px] rounded-full" />
        <div className="relative w-32 h-32 rounded-[40px] bg-white/[0.03] border-2 border-white/5 flex items-center justify-center shadow-2xl overflow-hidden">
          <AlertTriangle size={64} className="text-rose-500 animate-pulse" />
        </div>
      </motion.div>

      <div className="space-y-4 max-w-md relative">
        <h1 className="text-6xl font-black font-outfit tracking-tighter text-white">404<span className="text-rose-500">.</span></h1>
        <h2 className="text-xl font-black font-outfit uppercase tracking-widest text-white/60">Node Desynchronized</h2>
        <p className="text-sm font-medium text-white/20 leading-relaxed uppercase tracking-tighter">
          The requested data node does not exist in the current CareerOS partition. 
          Return to home base to re-establish synchronization.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-8">
        <Link 
          href="/"
          className="btn-primary h-14 px-8 flex items-center gap-3 shadow-2xl shadow-indigo-500/20"
        >
          <Home size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">Return to Dashboard</span>
        </Link>
        <button 
          onClick={() => window.history.back()}
          className="btn-secondary h-14 px-8 flex items-center gap-3"
        >
          <ArrowLeft size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest">Previous State</span>
        </button>
      </div>

      <div className="pt-20 opacity-5 relative">
        <Image src="/logo.png" alt="CareerOS" width={48} height={48} className="grayscale" />
      </div>
    </div>
  );
}
