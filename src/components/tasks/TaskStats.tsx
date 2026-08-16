'use client';

import { Task } from '@/types';
import { CheckCircle2, ListTodo, Flame, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculateTaskStats } from '@/lib/taskStats';

interface Props {
  tasks: Task[];
}

export default function TaskStats({ tasks }: Props) {
  if (tasks.length === 0) return null;

  const {
    activeSummaryTotal,
    activeDoneCount,
    activePendingCount,
    percentage,
    totalAllDoneCount,
  } = calculateTaskStats(tasks);

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-900 dark:to-slate-900 rounded-3xl p-5 text-white shadow-lg shadow-indigo-200/50 dark:shadow-none mb-6 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="p-2 bg-white/10 backdrop-blur-md rounded-xl text-amber-300 shrink-0">
            <Flame size={18} />
          </span>
          <div className="min-w-0">
            <h2 className="text-xs font-semibold text-indigo-100 uppercase tracking-wider truncate">
              Progres Tugas Harian
            </h2>
            <p className="text-sm font-bold truncate">
              {activeSummaryTotal === 0
                ? 'Tidak ada tugas aktif'
                : `${activeDoneCount} dari ${activeSummaryTotal} tugas selesai (${percentage}%)`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs shrink-0">
          <div
            className="flex items-center gap-1 text-emerald-300 font-medium bg-white/5 px-2 py-1 rounded-lg"
            title="Selesai hari ini"
          >
            <CheckCircle2 size={14} />
            <span>{activeDoneCount}</span>
          </div>
          <div
            className="flex items-center gap-1 text-indigo-200 font-medium bg-white/5 px-2 py-1 rounded-lg"
            title="Belum selesai (hari ini & tertunda)"
          >
            <ListTodo size={14} />
            <span>{activePendingCount}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/20 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-emerald-400 h-full rounded-full"
        />
      </div>

      {/* Section/Badge Terpisah: Total Done Keseluruhan */}
      <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs">
        <span className="text-indigo-200 text-[11px] flex items-center gap-1.5">
          <Trophy size={13} className="text-amber-300" />
          <span>Total Selesai Keseluruhan</span>
        </span>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 font-semibold text-[11px]">
          <CheckCircle2 size={12} className="text-emerald-300" />
          <span>{totalAllDoneCount} task done</span>
        </div>
      </div>
    </div>
  );
}
