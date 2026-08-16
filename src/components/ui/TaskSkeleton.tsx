'use client';

export default function TaskSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Top 3 Skeleton */}
      <div className="space-y-2 mb-6">
        <div className="h-3 w-28 bg-[#ebebeb] dark:bg-slate-800 rounded-[5px] mb-3" />
        <div className="bg-[#ebebeb]/40 dark:bg-slate-800/40 border border-[#ebebeb] dark:border-slate-800 rounded-[5px] p-4 space-y-2">
          <div className="h-4 w-3/4 bg-[#ebebeb] dark:bg-slate-700 rounded-[5px]" />
          <div className="h-3 w-1/3 bg-[#ebebeb] dark:bg-slate-700 rounded-[5px]" />
        </div>
      </div>

      {/* Task Group Header Skeleton */}
      <div className="h-3 w-36 bg-[#ebebeb] dark:bg-slate-800 rounded-[5px] pt-2" />

      {/* Task Cards Skeleton */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 border border-[#ebebeb] dark:border-slate-700 rounded-[5px] p-4 flex items-start gap-3 shadow-xs"
        >
          <div className="w-4 h-4 rounded-full bg-[#ebebeb] dark:bg-slate-700 flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 bg-[#ebebeb] dark:bg-slate-700 rounded-[5px]" />
            <div className="h-3 w-1/2 bg-[#ebebeb] dark:bg-slate-700 rounded-[5px]" />
            <div className="h-3 w-1/4 bg-[#ebebeb] dark:bg-slate-700 rounded-[5px]" />
          </div>
          <div className="w-12 h-4 bg-[#ebebeb] dark:bg-slate-700 rounded-[5px]" />
        </div>
      ))}
    </div>
  );
}
