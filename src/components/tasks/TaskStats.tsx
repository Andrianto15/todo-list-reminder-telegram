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
    <div className="bg-gradient-to-br from-[#0051c3] to-[#0041a8] dark:from-blue-900 dark:to-slate-900 rounded-[5px] p-5 text-white shadow-md mb-6 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="p-2 bg-white/10 backdrop-blur-md rounded-[5px] text-amber-300 shrink-0">
            <Flame size={18} />
          </span>
          <div className="min-w-0">
            <h2 className="text-xs font-light text-blue-100 uppercase tracking-wider truncate">
              Progres Tugas Harian
            </h2>
            <p className="text-sm font-semibold truncate">
              {activeSummaryTotal === 0
                ? 'Tidak ada tugas aktif'
                : `${activeDoneCount} dari ${activeSummaryTotal} tugas selesai (${percentage}%)`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs shrink-0">
          <div
            className="flex items-center gap-1 text-emerald-300 font-medium bg-white/10 px-2 py-1 rounded-[5px]"
            title="Selesai hari ini"
          >
            <CheckCircle2 size={14} />
            <span>{activeDoneCount}</span>
          </div>
          <div
            className="flex items-center gap-1 text-blue-100 font-medium bg-white/10 px-2 py-1 rounded-[5px]"
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
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="bg-emerald-400 h-full rounded-full"
        />
      </div>

      {/* Section/Badge Terpisah: Total Done Keseluruhan */}
      <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs">
        <span className="text-blue-100 text-[11px] flex items-center gap-1.5">
          <Trophy size={13} className="text-amber-300" />
          <span>Total Selesai Keseluruhan</span>
        </span>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-[5px] bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 font-medium text-[11px]">
          <CheckCircle2 size={12} className="text-emerald-300" />
          <span>{totalAllDoneCount} task done</span>
        </div>
      </div>
    </div>
  );
}
