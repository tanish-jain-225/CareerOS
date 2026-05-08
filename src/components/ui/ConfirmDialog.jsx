'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * ConfirmDialog - A reusable confirmation modal body.
 * Designed to be used inside ModalContext via openModal().
 *
 * @param {Object} props
 * @param {string} props.message - The confirmation message to display.
 * @param {string} [props.confirmLabel='Confirm'] - Label for the confirm button.
 * @param {string} [props.variant='danger'] - 'danger' | 'warning'
 * @param {Function} props.onConfirm - Called when user confirms.
 * @param {Function} props.onCancel - Called when user cancels.
 */
export default function ConfirmDialog({
  message,
  confirmLabel = 'Confirm',
  variant = 'danger',
  onConfirm,
  onCancel,
}) {
  const isDanger = variant === 'danger';

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 rounded-2xl p-3 ${
            isDanger ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
          }`}
        >
          <AlertTriangle size={20} />
        </div>
        <p className="pt-1 text-sm leading-relaxed font-medium text-white/60">{message}</p>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-white/[0.05] pt-5">
        <button onClick={onCancel} className="btn-secondary h-11 px-6">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`h-11 rounded-2xl px-6 text-[10px] font-black tracking-widest text-white uppercase transition-all active:scale-95 ${
            isDanger
              ? 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.2)] hover:bg-rose-600'
              : 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:bg-amber-600'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}
