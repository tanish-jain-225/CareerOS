'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { motion } from 'framer-motion';

import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center space-y-8 px-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-[100px]" />
        <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-[40px] border-2 border-white/5 bg-white/[0.03] shadow-2xl">
          <AlertTriangle size={64} className="animate-pulse text-rose-500" />
        </div>
      </motion.div>

      <div className="relative max-w-md space-y-4">
        <h1 className="font-outfit text-6xl font-black tracking-tighter text-white">
          404<span className="text-rose-500">.</span>
        </h1>
        <h2 className="font-outfit text-xl font-black tracking-widest text-white/60 uppercase">
          Node Desynchronized
        </h2>
        <p className="text-sm leading-relaxed font-medium tracking-tighter text-white/20 uppercase">
          The requested data node does not exist in the current CareerOS partition. Return to home
          base to re-establish synchronization.
        </p>
      </div>

      <div className="flex flex-col gap-4 pt-8 sm:flex-row">
        <Link
          href="/"
          className="btn-primary flex h-14 items-center gap-3 px-8 shadow-2xl shadow-indigo-500/20"
        >
          <Home size={18} />
          <span className="text-[10px] font-black tracking-widest uppercase">
            Return to Dashboard
          </span>
        </Link>
        <button
          onClick={() => window.history.back()}
          className="btn-secondary flex h-14 items-center gap-3 px-8"
        >
          <ArrowLeft size={18} />
          <span className="text-[10px] font-black tracking-widest uppercase">Previous State</span>
        </button>
      </div>

      <div className="relative pt-20 opacity-5">
        <Image src="/logo.png" alt="CareerOS" width={48} height={48} className="grayscale" />
      </div>
    </div>
  );
}
