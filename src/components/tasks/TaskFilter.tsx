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
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari tugas..."
          className="w-full bg-white border border-gray-200/80 rounded-2xl pl-10 pr-9 py-2 text-xs text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-xs"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100 transition"
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
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-200'
                  : 'bg-white text-gray-600 border border-gray-200/70 hover:bg-gray-50'
              }`}
            >
              <span>{f.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-100 text-gray-500'
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
