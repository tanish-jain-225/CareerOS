'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2, Star, Eye, Clock, CheckCircle2 } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { formatBytes, formatDate } from '@/utils/dateUtils';
import { getFileIcon, CATEGORY_STYLES } from '@/utils/fileUtils';

/**
 * Individual file card for the Document Vault.
 * Supports renaming, starring, previewing and downloading.
 */
const FileCard = ({ file, onPreview, onDownload, onDelete, onUpdate, isSelected, onSelect }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(file.name);
  const extension = file.name?.split('.').pop()?.toUpperCase() || 'FILE';

  const handleRename = () => {
    setIsEditing(false);
    if (tempName !== file.name && tempName.trim()) {
      onUpdate(file.id, { name: tempName });
    } else {
      setTempName(file.name);
    }
  };

  return (
    <div className="w-full p-2.5 sm:w-1/2 lg:w-1/3 xl:w-1/4">
      <motion.div
        layout
        className={`panel group relative flex h-full flex-col gap-6 transition-all duration-300 ${
          isSelected
            ? 'border-indigo-500/20 bg-indigo-500/[0.04] ring-2 ring-indigo-500'
            : 'hover:border-white/10'
        }`}
        data-testid={`vault-file-${file.id}`}
      >
        {/* Selection Checkbox */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => onSelect(file.id)}
            className={`flex h-5 w-5 items-center justify-center rounded-lg border transition-all ${
              isSelected
                ? 'border-indigo-500 bg-indigo-500 text-white'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
          >
            {isSelected && <CheckCircle2 size={12} className="stroke-[3]" />}
          </button>
        </div>

        {/* Star Action */}
        <button
          onClick={() => onUpdate(file.id, { starred: !file.starred })}
          className={`absolute top-4 right-4 rounded-xl p-2 transition-all ${
            file.starred
              ? 'border border-amber-400/20 bg-amber-400/10 text-amber-400'
              : 'text-white/10 hover:bg-white/5 hover:text-white/40'
          }`}
          title={file.starred ? 'Unstar document' : 'Star document'}
        >
          <Star size={14} fill={file.starred ? 'currentColor' : 'none'} />
        </button>

        {/* File Icon & Info */}
        <div className="mt-4 flex items-start justify-between">
          <div className="relative">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-white/20 shadow-inner transition-all group-hover:border-indigo-500/20 group-hover:bg-indigo-500/5 group-hover:text-indigo-400">
              {getFileIcon(file.type)}
            </div>
            <span className="absolute -right-2 -bottom-2 rounded-lg border border-white/5 bg-[#080a14] px-2 py-1 text-[7px] font-black tracking-tighter text-white/40 uppercase shadow-xl">
              {extension}
            </span>
          </div>
          <div className="flex flex-col items-end gap-2 text-right">
            <Badge variant={CATEGORY_STYLES[file.category] || 'white'} size="xs">
              {file.category || 'General'}
            </Badge>
            <p className="text-[9px] font-black tracking-widest text-white/15 uppercase">
              {formatBytes(file.size || 0)}
            </p>
          </div>
        </div>

        {/* Title / Renaming */}
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <input
              autoFocus
              className="w-full rounded-xl border border-indigo-500/30 bg-white/5 px-3 py-2 text-sm font-bold text-white transition-all outline-none focus:ring-4 focus:ring-indigo-500/5"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              placeholder="Enter new filename..."
            />
          ) : (
            <h4
              className="font-outfit mb-1.5 cursor-pointer truncate text-base leading-tight font-black text-white transition-colors group-hover:text-indigo-400"
              onClick={() => setIsEditing(true)}
              title="Click to rename"
            >
              {file.name}
            </h4>
          )}
          <p className="flex items-center gap-2 text-[9px] font-black tracking-[0.2em] text-white/10 uppercase">
            <Clock size={10} /> {formatDate(file.uploadedAt)}
          </p>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center gap-2.5 border-t border-white/[0.03] pt-5">
          <button
            onClick={() => onPreview(file)}
            className="flex flex-1 items-center justify-center gap-2.5 rounded-2xl border border-white/5 bg-white/[0.02] py-3 text-[9px] font-black tracking-widest text-white/40 uppercase transition-all hover:border-indigo-500/20 hover:bg-indigo-500/5 hover:text-indigo-400 active:scale-95"
          >
            <Eye size={14} /> Preview
          </button>
          <button
            onClick={() => onDownload(file)}
            className="rounded-2xl border border-white/5 bg-white/[0.02] p-3 text-white/20 transition-all hover:border-emerald-500/20 hover:bg-emerald-500/5 hover:text-emerald-400 active:scale-95"
            aria-label="Download document"
          >
            <Download size={14} />
          </button>
          <button
            onClick={() => onDelete(file.id)}
            className="rounded-2xl p-3 text-white/5 transition-all hover:bg-rose-500/5 hover:text-rose-400 active:scale-95"
            aria-label="Delete document"
            data-testid={`vault-delete-${file.id}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FileCard;
