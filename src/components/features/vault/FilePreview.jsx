'use client';

import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import { formatBytes } from '@/utils/dateUtils';
import { getFileIcon } from '@/utils/fileUtils';
import LogoLoader from '@/components/ui/LogoLoader';

/**
 * Component for inspecting a file's content or showing a restricted preview.
 * @param {Object} props
 * @param {Object} props.file - The file object to preview.
 */
export default function FilePreview({ file }) {
  const [contentUrl, setContentUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let urlToRevoke = null;

    const loadContent = async () => {
      if (!file.compressed) {
        setContentUrl(file.content);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(file.content);
        const decompressedStream = res.body.pipeThrough(new DecompressionStream('gzip'));
        const decompressedBlob = await new Response(decompressedStream).blob();
        if (active) {
          const url = URL.createObjectURL(decompressedBlob);
          urlToRevoke = url;
          setContentUrl(url);
          setLoading(false);
        }
      } catch (err) {
        console.error('Decompression error:', err);
        if (active) {
          setContentUrl(file.content);
          setLoading(false);
        }
      }
    };

    loadContent();

    return () => {
      active = false;
      if (urlToRevoke) {
        URL.revokeObjectURL(urlToRevoke);
      }
    };
  }, [file.content, file.compressed]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
        <div className="rounded-2xl bg-indigo-500 p-3.5 text-white shadow-xl shadow-indigo-500/20">
          {getFileIcon(file.type)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-white">{file.name}</p>
          <div className="mt-1 flex items-center gap-3">
            <p className="text-[9px] font-black tracking-widest text-white/30 uppercase">
              {formatBytes(file.size || 0)}
            </p>
            <div className="h-1 w-1 rounded-full bg-white/10" />
            <p className="text-[9px] font-black tracking-widest text-white/30 uppercase">
              {file.category || 'Document'}
            </p>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex h-[40vh] items-center justify-center rounded-2xl border border-white/5 bg-white/[0.01]">
          <div className="flex flex-col items-center gap-4">
            <LogoLoader size="sm" />
            <span className="text-[8px] font-black tracking-[0.3em] text-white/20 uppercase animate-pulse">
              Decompressing Asset...
            </span>
          </div>
        </div>
      ) : file.type?.includes('pdf') ? (
        <iframe
          src={contentUrl}
          className="h-[65vh] w-full rounded-2xl border border-white/5 bg-white shadow-2xl"
          title={file.name}
        />
      ) : (
        <div className="space-y-4 rounded-3xl border border-white/5 bg-white/[0.02] p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/5 bg-white/[0.03] text-white/10">
            <Lock size={32} strokeWidth={1} />
          </div>
          <p className="mx-auto max-w-xs text-[10px] leading-relaxed font-black tracking-[0.2em] text-white/20 uppercase">
            Live preview is restricted to PDF formats. Download this resource for full access.
          </p>
        </div>
      )}
    </div>
  );
}
