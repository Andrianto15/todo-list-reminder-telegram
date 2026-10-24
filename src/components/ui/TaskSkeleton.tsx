'use client';

export default function TaskSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Top 3 Skeleton */}
      <div className="space-y-2 mb-6">
        <div className="h-3.5 w-28 bg-[#e2e8f0] dark:bg-[#1e293b] rounded-md mb-3" />
        <div className="bg-white/60 dark:bg-[#0f172a]/60 border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl p-4 space-y-2.5">
          <div className="h-4 w-3/4 bg-[#e2e8f0] dark:bg-[#1e293b] rounded-md" />
          <div className="h-3.5 w-1/3 bg-[#e2e8f0] dark:bg-[#1e293b] rounded-md" />
        </div>
      </div>

      {/* Task Group Header Skeleton */}
      <div className="h-3.5 w-36 bg-[#e2e8f0] dark:bg-[#1e293b] rounded-md pt-2" />

      {/* Task Cards Skeleton */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl p-4 flex items-start gap-3 shadow-xs"
        >
          <div className="w-4 h-4 rounded-full bg-[#e2e8f0] dark:bg-[#1e293b] shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 bg-[#e2e8f0] dark:bg-[#1e293b] rounded-md" />
            <div className="h-3.5 w-1/2 bg-[#e2e8f0] dark:bg-[#1e293b] rounded-md" />
            <div className="h-3.5 w-1/4 bg-[#e2e8f0] dark:bg-[#1e293b] rounded-md" />
          </div>
          <div className="w-14 h-5 bg-[#e2e8f0] dark:bg-[#1e293b] rounded-full" />
        </div>
      ))}
    </div>
  );
}
