'use client';

/**
 * ProgressRing - A circular progress indicator with customizable size and color.
 * 
 * @param {Object} props
 * @param {number} [props.percentage=0] - Completion percentage (0-100).
 * @param {number} [props.size=72] - Diameter of the ring in pixels.
 * @param {number} [props.stroke=6] - Thickness of the progress line.
 * @param {string} [props.color='#6366f1'] - Hex or CSS color for the progress stroke.
 * @param {string} [props.label=''] - Optional sub-label to display under the percentage.
 */
export default function ProgressRing({ percentage = 0, size = 72, stroke = 6, color = '#6366f1', label = '' }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * (percentage / 100);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-base font-black font-outfit leading-none">{percentage}<span className="text-[8px] opacity-50">%</span></span>
        {label && <span className="text-[7px] font-black text-white/30 uppercase tracking-widest mt-0.5 leading-none">{label}</span>}
      </div>
    </div>
  );
}
