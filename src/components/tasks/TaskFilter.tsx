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
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373] dark:text-slate-500"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari tugas..."
          className="w-full bg-white dark:bg-slate-800 border border-[#ebebeb] dark:border-slate-700 rounded-[5px] pl-10 pr-9 py-2 text-[13px] text-[#404040] dark:text-slate-100 placeholder:text-[#a3a3a3] dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-[#0051c3]/20 focus:border-[#0051c3] transition shadow-xs"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] dark:text-slate-500 hover:text-[#404040] dark:hover:text-slate-300 p-0.5 rounded-[5px] hover:bg-[#ebebeb]/50 dark:hover:bg-slate-700 transition"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {filters.map((f) => {
          const isActive = statusFilter === f.id;
          const count = counts[f.id] || 0;
          return (
            <button
              key={f.id}
              onClick={() => onStatusFilterChange(f.id)}
              className={`px-3 py-1.5 rounded-[5px] font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#0051c3] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-[#404040] dark:text-slate-300 border border-[#ebebeb] dark:border-slate-700 hover:bg-[#ebebeb]/50 dark:hover:bg-slate-700/60'
              }`}
            >
              <span>{f.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-[5px] font-bold ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#ebebeb] dark:bg-slate-700 text-[#737373] dark:text-slate-400'
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

