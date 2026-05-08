'use client';

import { Star } from 'lucide-react';

const COLORS = [
  'text-white/15',
  'text-rose-500',
  'text-amber-500',
  'text-yellow-400',
  'text-emerald-500',
  'text-emerald-400',
];

export default function StarRating({ value = 0, onChange, size = 14, readOnly = false }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={`transition-transform ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-125'}`}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
        >
          <Star
            size={size}
            className={`transition-colors ${star <= value ? COLORS[value] || 'text-amber-400' : 'text-white/10'}`}
            fill={star <= value ? 'currentColor' : 'none'}
          />
        </button>
      ))}
    </div>
  );
}
