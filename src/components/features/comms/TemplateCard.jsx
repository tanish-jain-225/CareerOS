'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

/**
 * TemplateCard component for displaying and copying outreach message templates.
 * 
 * @param {Object} props
 * @param {string} props.title - The title of the template.
 * @param {string} props.body - The message body.
 * @param {boolean} props.isCustom - Whether it's a user-defined template.
 * @param {Function} props.onDelete - Callback to delete custom templates.
 */
export default function TemplateCard({ title, body, isCustom, onDelete }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(body).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      whileHover={{ y: -2 }} 
      className="panel p-5 space-y-4 border-white/5 hover:border-indigo-500/20 transition-all bg-white/[0.01] relative group"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isCustom ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]'}`} />
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/30 hover:text-white hover:bg-white/10'}`}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
          {isCustom && (
            <button
              onClick={onDelete}
              className="p-2 hover:bg-rose-500/10 text-rose-400 transition-all rounded-xl"
              aria-label="Delete template"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
      <p className="text-[10px] text-white/30 italic leading-relaxed font-medium">&quot;{body}&quot;</p>
    </motion.div>
  );
}
