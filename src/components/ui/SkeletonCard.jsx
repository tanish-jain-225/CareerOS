'use client';

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`glass-card animate-pulse bg-white/[0.02] ${className}`}>
      <div className="space-y-3 p-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-white/5" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 rounded-full bg-white/5" />
            <div className="h-2 w-1/2 rounded-full bg-white/[0.03]" />
          </div>
        </div>
        <div className="space-y-1.5 pt-1">
          <div className="h-1.5 rounded-full bg-white/[0.03]" />
          <div className="h-1.5 w-4/5 rounded-full bg-white/[0.03]" />
        </div>
        <div className="flex gap-2 pt-1">
          <div className="h-5 w-14 rounded-full bg-white/[0.03]" />
          <div className="h-5 w-10 rounded-full bg-white/[0.03]" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-center gap-4 p-4">
      <div className="h-8 w-8 flex-shrink-0 rounded-full bg-white/5" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-1/3 rounded-full bg-white/5" />
        <div className="h-2 w-1/5 rounded-full bg-white/[0.03]" />
      </div>
      <div className="h-5 w-20 rounded-full bg-white/[0.03]" />
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="animate-pulse space-y-2">
      {Array(lines)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="h-2 rounded-full bg-white/[0.04]"
            style={{ width: `${100 - i * 15}%` }}
          />
        ))}
    </div>
  );
}
