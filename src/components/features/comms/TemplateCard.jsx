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
      className="panel group relative space-y-4 border-white/5 bg-white/[0.01] p-5 transition-all hover:border-indigo-500/20"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`h-1.5 w-1.5 rounded-full ${isCustom ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]'}`}
          />
          <h4 className="text-[10px] font-black tracking-[0.2em] text-white/50 uppercase">
            {title}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={`rounded-xl px-3 py-1.5 text-[9px] font-black tracking-widest uppercase transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/30 hover:bg-white/10 hover:text-white'}`}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
          {isCustom && (
            <button
              onClick={onDelete}
              className="rounded-xl p-2 text-rose-400 transition-all hover:bg-rose-500/10"
              aria-label="Delete template"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
      <p className="text-[10px] leading-relaxed font-medium text-white/30 italic">
        &quot;{body}&quot;
      </p>
    </motion.div>
  );
}
