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
      className="panel group space-y-6 border-white/5 bg-white/[0.01] transition-all hover:border-indigo-500/20"
    >
      <div className="flex items-start justify-between">
        <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-400 transition-all group-hover:bg-indigo-500/20">
          <Terminal size={20} />
        </div>
        <button
          onClick={() => onDelete(project.id)}
          className="rounded-xl p-2.5 text-white/10 transition-all hover:bg-rose-500/10 hover:text-rose-400"
          aria-label="Delete project"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="ml-1 text-[9px] font-black tracking-widest text-white/20 uppercase">
            Project Identifier
          </label>
          <input
            className="input-field h-12 text-sm font-bold"
            defaultValue={project.name}
            onBlur={(e) => onUpdate(project.id, { name: e.target.value })}
            placeholder="e.g. Neural Network Dashboard"
          />
        </div>
        <div className="space-y-2">
          <label className="ml-1 text-[9px] font-black tracking-widest text-white/20 uppercase">
            Mission Scope
          </label>
          <textarea
            className="input-field h-24 resize-none text-[11px] leading-relaxed font-medium"
            defaultValue={project.desc}
            onBlur={(e) => onUpdate(project.id, { desc: e.target.value })}
            placeholder="Describe the impact and technical complexity..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="ml-1 text-[9px] font-black tracking-widest text-white/20 uppercase">
              Live Node
            </label>
            <div className="relative">
              <ExternalLink
                size={12}
                className="absolute top-1/2 left-4 -translate-y-1/2 text-white/20"
              />
              <input
                className="input-field h-10 pl-10 text-[10px]"
                defaultValue={project.liveUrl}
                onBlur={(e) => onUpdate(project.id, { liveUrl: e.target.value })}
                placeholder="https://live.link"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="ml-1 text-[9px] font-black tracking-widest text-white/20 uppercase">
              Source Code
            </label>
            <div className="relative">
              <GitHubIcon
                size={12}
                className="absolute top-1/2 left-4 -translate-y-1/2 text-white/20"
              />
              <input
                className="input-field h-10 pl-10 text-[10px]"
                defaultValue={project.githubUrl}
                onBlur={(e) => onUpdate(project.id, { githubUrl: e.target.value })}
                placeholder="https://github.com/src"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-white/[0.03] pt-6">
        {project.tech?.map((t) => (
          <span
            key={t}
            className="chip border-white/5 bg-white/[0.02] px-2.5 py-1 text-[8px] text-white/40"
          >
            {t}
          </span>
        ))}
        <button
          onClick={() => {
            const skill = window.prompt('Add technology:');
            if (skill) onUpdate(project.id, { tech: [...(project.tech || []), skill] });
          }}
          className="chip border-dashed border-white/10 px-2.5 py-1 text-[8px] text-white/20 transition-all hover:text-indigo-400"
        >
          + ADD
        </button>
      </div>
    </motion.div>
  );
}
