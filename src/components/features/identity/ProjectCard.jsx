'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Terminal, ExternalLink } from 'lucide-react';
import { GitHubIcon } from '@/components/ui/BrandIcons';

/**
 * ProjectCard component for showcasing proof-of-work in the Identity module.
 * 
 * @param {Object} props
 * @param {Object} props.project - The project object to display/edit.
 * @param {Function} props.onUpdate - Callback to update project data.
 * @param {Function} props.onDelete - Callback to delete the project record.
 */
export default function ProjectCard({ project, onUpdate, onDelete }) {
  return (
    <motion.div 
      layout
      className="panel border-white/5 bg-white/[0.01] hover:border-indigo-500/20 transition-all group space-y-6"
    >
      <div className="flex justify-between items-start">
        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-all">
          <Terminal size={20} />
        </div>
        <button 
          onClick={() => onDelete(project.id)} 
          className="p-2.5 text-white/10 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
          aria-label="Delete project"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-1">Project Identifier</label>
          <input
            className="input-field text-sm font-bold h-12"
            defaultValue={project.name}
            onBlur={e => onUpdate(project.id, { name: e.target.value })}
            placeholder="e.g. Neural Network Dashboard"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-1">Mission Scope</label>
          <textarea
            className="input-field text-[11px] font-medium h-24 resize-none leading-relaxed"
            defaultValue={project.desc}
            onBlur={e => onUpdate(project.id, { desc: e.target.value })}
            placeholder="Describe the impact and technical complexity..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-1">Live Node</label>
            <div className="relative">
              <ExternalLink size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                className="input-field text-[10px] pl-10 h-10"
                defaultValue={project.liveUrl}
                onBlur={e => onUpdate(project.id, { liveUrl: e.target.value })}
                placeholder="https://live.link"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-white/20 ml-1">Source Code</label>
            <div className="relative">
              <GitHubIcon size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                className="input-field text-[10px] pl-10 h-10"
                defaultValue={project.githubUrl}
                onBlur={e => onUpdate(project.id, { githubUrl: e.target.value })}
                placeholder="https://github.com/src"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-white/[0.03] flex flex-wrap gap-2">
        {project.tech?.map(t => (
          <span key={t} className="chip py-1 px-2.5 bg-white/[0.02] text-[8px] border-white/5 text-white/40">
            {t}
          </span>
        ))}
        <button 
          onClick={() => {
            const skill = window.prompt('Add technology:');
            if (skill) onUpdate(project.id, { tech: [...(project.tech || []), skill] });
          }}
          className="chip py-1 px-2.5 border-dashed border-white/10 text-[8px] text-white/20 hover:text-indigo-400 transition-all"
        >
          + ADD
        </button>
      </div>
    </motion.div>
  );
}
