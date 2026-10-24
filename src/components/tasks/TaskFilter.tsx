'use client';

import { Search, X } from 'lucide-react';
import { TaskStatus } from '@/types';

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: TaskStatus | 'all';
  onStatusFilterChange: (status: TaskStatus | 'all') => void;
  counts: Record<TaskStatus | 'all', number>;
}

const filters: { id: TaskStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'to_do', label: 'To Do' },
  { id: 'done', label: 'Done' },
  { id: 'hold', label: 'Hold' },
  { id: 'cancel', label: 'Cancel' },
];

export default function TaskFilter({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  counts,
}: Props) {
  return (
    <div className="space-y-3 mb-6">
      {/* Search Input */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b] dark:text-[#94a3b8] pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari tugas..."
          aria-label="Cari tugas"
          className="w-full bg-white dark:bg-[#0f172a] border border-[#cbd5e1] dark:border-[#1e293b] rounded-lg !pl-10 !pr-10 py-2.5 text-sm text-[#0f172a] dark:text-[#f8fafc] placeholder:text-[#64748b] dark:placeholder:text-[#94a3b8] outline-none focus:ring-2 focus:ring-[#4682b4] focus:border-[#4682b4] transition shadow-xs min-h-[44px]"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-[#f8fafc] p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-[#e2e8f0]/50 dark:hover:bg-[#1e293b] transition"
            aria-label="Bersihkan pencarian"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div role="tablist" aria-label="Filter status tugas" className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {filters.map((f) => {
          const isActive = statusFilter === f.id;
          const count = counts[f.id] || 0;
          return (
            <button
              key={f.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onStatusFilterChange(f.id)}
              className={`px-3.5 py-2 min-h-[44px] rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#4682b4] text-white shadow-xs'
                  : 'bg-white dark:bg-[#0f172a] text-[#475569] dark:text-[#94a3b8] border border-[#e2e8f0] dark:border-[#1e293b] hover:bg-[#e2e8f0]/50 dark:hover:bg-[#1e293b]'
              }`}
            >
              <span>{f.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-[#f1f5f9] dark:bg-[#1e293b] text-[#334155] dark:text-[#94a3b8]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
