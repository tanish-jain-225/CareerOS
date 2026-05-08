'use client';

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`glass-card animate-pulse bg-white/[0.02] ${className}`}>
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/5" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-white/5 rounded-full w-3/4" />
            <div className="h-2 bg-white/[0.03] rounded-full w-1/2" />
          </div>
        </div>
        <div className="space-y-1.5 pt-1">
          <div className="h-1.5 bg-white/[0.03] rounded-full" />
          <div className="h-1.5 bg-white/[0.03] rounded-full w-4/5" />
        </div>
        <div className="flex gap-2 pt-1">
          <div className="h-5 w-14 bg-white/[0.03] rounded-full" />
          <div className="h-5 w-10 bg-white/[0.03] rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-white/5 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-white/5 rounded-full w-1/3" />
        <div className="h-2 bg-white/[0.03] rounded-full w-1/5" />
      </div>
      <div className="h-5 w-20 bg-white/[0.03] rounded-full" />
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array(lines).fill(0).map((_, i) => (
        <div
          key={i}
          className="h-2 bg-white/[0.04] rounded-full"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  );
}
