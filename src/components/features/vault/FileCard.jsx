'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, Trash2, Star, Eye, Clock, CheckCircle2 
} from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { formatBytes, formatDate } from '@/utils/dateUtils';
import { getFileIcon, CATEGORY_STYLES } from '@/utils/fileUtils';

/**
 * Individual file card for the Document Vault.
 * Supports renaming, starring, previewing, and downloading.
 */
const FileCard = ({ 
  file, 
  onPreview, 
  onDownload, 
  onDelete, 
  onUpdate, 
  isSelected, 
  onSelect 
}) => {
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
    <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-2.5">
      <motion.div
        layout
        className={`panel h-full flex flex-col gap-6 group relative transition-all duration-300 ${
          isSelected ? 'ring-2 ring-indigo-500 bg-indigo-500/[0.04] border-indigo-500/20' : 'hover:border-white/10'
        }`}
        data-testid={`vault-file-${file.id}`}
      >
        {/* Selection Checkbox */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => onSelect(file.id)}
            className={`w-5 h-5 rounded-lg border transition-all flex items-center justify-center ${
              isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
          >
            {isSelected && <CheckCircle2 size={12} className="stroke-[3]" />}
          </button>
        </div>

        {/* Star Action */}
        <button
          onClick={() => onUpdate(file.id, { starred: !file.starred })}
          className={`absolute top-4 right-4 p-2 rounded-xl transition-all ${
            file.starred ? 'text-amber-400 bg-amber-400/10 border border-amber-400/20' : 'text-white/10 hover:text-white/40 hover:bg-white/5'
          }`}
          title={file.starred ? 'Unstar document' : 'Star document'}
        >
          <Star size={14} fill={file.starred ? 'currentColor' : 'none'} />
        </button>

        {/* File Icon & Info */}
        <div className="flex items-start justify-between mt-4">
          <div className="relative">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:bg-indigo-500/5 group-hover:border-indigo-500/20 group-hover:text-indigo-400 transition-all text-white/20 shadow-inner">
              {getFileIcon(file.type)}
            </div>
            <span className="absolute -bottom-2 -right-2 px-2 py-1 rounded-lg bg-[#080a14] border border-white/5 text-[7px] font-black text-white/40 uppercase tracking-tighter shadow-xl">
              {extension}
            </span>
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <Badge variant={CATEGORY_STYLES[file.category] || 'white'} size="xs">
              {file.category || 'General'}
            </Badge>
            <p className="text-[9px] font-black text-white/15 uppercase tracking-widest">{formatBytes(file.size || 0)}</p>
          </div>
        </div>

        {/* Title / Renaming */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              autoFocus
              className="bg-white/5 border border-indigo-500/30 rounded-xl px-3 py-2 font-bold text-sm text-white w-full outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={e => e.key === 'Enter' && handleRename()}
              placeholder="Enter new filename..."
            />
          ) : (
            <h4 
              className="font-black font-outfit text-base text-white group-hover:text-indigo-400 transition-colors truncate mb-1.5 cursor-pointer leading-tight"
              onClick={() => setIsEditing(true)}
              title="Click to rename"
            >
              {file.name}
            </h4>
          )}
          <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.2em] flex items-center gap-2">
            <Clock size={10} /> {formatDate(file.uploadedAt)}
          </p>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center gap-2.5 pt-5 border-t border-white/[0.03]">
          <button
            onClick={() => onPreview(file)}
            className="flex-1 py-3 rounded-2xl bg-white/[0.02] border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-indigo-400 hover:bg-indigo-500/5 hover:border-indigo-500/20 transition-all flex items-center justify-center gap-2.5 active:scale-95"
          >
            <Eye size={14} /> Preview
          </button>
          <button
            onClick={() => onDownload(file)}
            className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-white/20 hover:text-emerald-400 hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all active:scale-95"
            aria-label="Download document"
          >
            <Download size={14} />
          </button>
          <button
            onClick={() => onDelete(file.id)}
            className="p-3 rounded-2xl text-white/5 hover:text-rose-400 hover:bg-rose-500/5 transition-all active:scale-95"
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
