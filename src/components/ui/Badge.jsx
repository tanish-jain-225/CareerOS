'use client';

const VARIANTS = {
  indigo:  'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rose:    'bg-rose-500/10 text-rose-400 border-rose-500/20',
  amber:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  blue:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  teal:    'bg-teal-500/10 text-teal-400 border-teal-500/20',
  white:   'bg-white/5 text-white/50 border-white/10',
};

const SIZES = {
  xs: 'text-[7px] px-1.5 py-0.5',
  sm: 'text-[9px] px-2 py-0.5',
  md: 'text-[10px] px-2.5 py-1',
};

/**
 * Badge - A versatile tag component for statuses, categories, and labels.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to display inside the badge.
 * @param {'indigo'|'emerald'|'rose'|'amber'|'blue'|'teal'|'white'} [props.variant='white'] - Visual style variant.
 * @param {'xs'|'sm'|'md'} [props.size='sm'] - Padding and font size level.
 * @param {boolean} [props.dot=false] - Whether to show a pulse dot indicator.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @param {Function} [props.onClick] - Optional click handler.
 */
export default function Badge({ children, variant = 'white', size = 'sm', dot = false, className = '', onClick }) {
  const v = VARIANTS[variant] || VARIANTS.white;
  const s = SIZES[size] || SIZES.sm;
  return (
    <span 
      className={`inline-flex items-center gap-1.5 rounded-full border font-black uppercase tracking-wider leading-none ${v} ${s} ${onClick ? 'cursor-pointer hover:opacity-80 active:scale-95 transition-all' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
          variant === 'indigo' ? 'bg-indigo-400' :
          variant === 'emerald' ? 'bg-emerald-400' :
          variant === 'rose' ? 'bg-rose-400' :
          variant === 'amber' ? 'bg-amber-400' :
          variant === 'blue' ? 'bg-blue-400' :
          variant === 'teal' ? 'bg-teal-400' : 'bg-white/30'
        }`} />
      )}
      {children}
    </span>
  );
}
