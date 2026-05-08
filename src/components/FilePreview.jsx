'use client';

import React from 'react';
import { Lock } from 'lucide-react';
import { formatBytes } from '@/utils/dateUtils';
import { getFileIcon } from '@/utils/fileUtils';

/**
 * Component for inspecting a file's content or showing a restricted preview.
 * @param {Object} props
 * @param {Object} props.file - The file object to preview.
 */
export default function FilePreview({ file }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
        <div className="p-3.5 rounded-2xl bg-indigo-500 text-white shadow-xl shadow-indigo-500/20">
          {getFileIcon(file.type)}
        </div>
        <div className="min-w-0">
          <p className="font-black text-sm text-white truncate">{file.name}</p>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">
              {formatBytes(file.size || 0)}
            </p>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">
              {file.category || 'Document'}
            </p>
          </div>
        </div>
      </div>
      {file.type?.includes('pdf') ? (
        <iframe
          src={file.content}
          className="w-full h-[65vh] rounded-2xl border border-white/5 shadow-2xl bg-white"
          title={file.name}
        />
      ) : (
        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center mx-auto text-white/10">
            <Lock size={32} strokeWidth={1} />
          </div>
          <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.2em] leading-relaxed max-w-xs mx-auto">
            Live preview is restricted to PDF formats. Download this resource for full access.
          </p>
        </div>
      )}
    </div>
  );
}
