'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';

/**
 * TemplateForm component for creating custom message templates.
 *
 * @param {Object} props
 * @param {Function} props.onSave - Callback when template is saved.
 * @param {Function} props.onClose - Callback to close the modal.
 */
export default function TemplateForm({ onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-white/20 uppercase">
          Template Name
        </label>
        <input
          className="input-field h-12 text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Cold Outreach v2"
          autoFocus
        />
      </div>
      <div className="space-y-2">
        <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-white/20 uppercase">
          Template Body
        </label>
        <textarea
          className="input-field h-40 resize-none text-sm"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Hi [Name], I'm reaching out regarding..."
        />
      </div>
      <div className="flex items-center justify-end gap-4 border-t border-white/[0.03] pt-4">
        <button onClick={onClose} className="btn-secondary h-12 px-6">
          Cancel
        </button>
        <button
          onClick={() => onSave({ title, body })}
          disabled={!title.trim() || !body.trim()}
          className="btn-primary flex h-12 items-center gap-3 px-8"
        >
          <Plus size={16} />
          <span className="text-[10px] font-black uppercase">Save Template</span>
        </button>
      </div>
    </div>
  );
}
