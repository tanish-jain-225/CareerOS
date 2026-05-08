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
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Template Name</label>
        <input 
          className="input-field text-sm h-12" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="e.g. Cold Outreach v2" 
          autoFocus 
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Template Body</label>
        <textarea 
          className="input-field text-sm resize-none h-40" 
          value={body} 
          onChange={e => setBody(e.target.value)} 
          placeholder="Hi [Name], I'm reaching out regarding..." 
        />
      </div>
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/[0.03]">
        <button onClick={onClose} className="btn-secondary h-12 px-6">Cancel</button>
        <button 
          onClick={() => onSave({ title, body })} 
          disabled={!title.trim() || !body.trim()} 
          className="btn-primary h-12 px-8 flex items-center gap-3"
        >
          <Plus size={16} /> 
          <span className="text-[10px] uppercase font-black">Save Template</span>
        </button>
      </div>
    </div>
  );
}
