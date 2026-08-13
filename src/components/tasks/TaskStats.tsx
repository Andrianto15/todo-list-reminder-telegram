'use client';

import { Task } from '@/types';
import { CheckCircle2, ListTodo, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  tasks: Task[];
}

export default function TaskStats({ tasks }: Props) {
  if (tasks.length === 0) return null;

  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;
  const percentage = Math.round((doneCount / total) * 100);

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-900 dark:to-slate-900 rounded-3xl p-5 text-white shadow-lg shadow-indigo-200/50 dark:shadow-none mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-white/10 backdrop-blur-md rounded-xl text-amber-300">
            <Flame size={18} />
          </span>
          <div>
            <h2 className="text-xs font-semibold text-indigo-100 uppercase tracking-wider">
              Progres Tugas Harian
            </h2>
            <p className="text-sm font-bold">
              {doneCount} dari {total} tugas selesai ({percentage}%)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-emerald-300 font-medium">
            <CheckCircle2 size={14} />
            <span>{doneCount}</span>
          </div>
          <div className="flex items-center gap-1 text-indigo-200 font-medium">
            <ListTodo size={14} />
            <span>{total - doneCount}</span>
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
    </div>
  );
}
