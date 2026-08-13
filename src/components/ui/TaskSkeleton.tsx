'use client';

export default function TaskSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Top 3 Skeleton */}
      <div className="space-y-2 mb-6">
        <div className="h-3 w-28 bg-gray-200 rounded-md mb-3" />
        <div className="bg-gray-100 border border-gray-200/60 rounded-2xl p-4 space-y-2">
          <div className="h-4 w-3/4 bg-gray-200 rounded-md" />
          <div className="h-3 w-1/3 bg-gray-200 rounded-md" />
        </div>
      </div>

      {/* Task Group Header Skeleton */}
      <div className="h-3 w-36 bg-gray-200 rounded-md pt-2" />

      {/* Task Cards Skeleton */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white border border-gray-100 rounded-2xl p-4 flex items-start gap-3 shadow-xs"
        >
          <div className="w-5 h-5 rounded-full bg-gray-200 flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 bg-gray-200 rounded-md" />
            <div className="h-3 w-1/2 bg-gray-200 rounded-md" />
            <div className="h-3 w-1/4 bg-gray-200 rounded-md" />
          </div>
          <div className="w-12 h-5 bg-gray-200 rounded-full" />
        </div>
      ))}
    </div>
  );
}
