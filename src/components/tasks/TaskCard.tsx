import { Task } from '@/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import StatusBadge from './StatusBadge';
import { Check, Clock, Bell, Pencil, Trash2 } from 'lucide-react';

interface Props {
  task: Task;
  onEdit: () => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
  onDelete?: () => void;
}

export default function TaskCard({ task, onEdit, onStatusChange, onDelete }: Props) {
  const isDone = task.status === 'done';
  const isCancel = task.status === 'cancel';
  const isEditable = !isDone && !isCancel;

  return (
    <div className={`bg-white dark:bg-slate-800/90 border border-gray-100 dark:border-slate-700/80 rounded-2xl p-4 transition-all hover:border-gray-200 dark:hover:border-slate-600 shadow-sm ${isDone || isCancel ? 'opacity-55' : ''}`}>
      <div className="flex items-start gap-3">
        {/* Checkbox done */}
        <button
          onClick={() => onStatusChange(task.id, isDone ? 'to_do' : 'done')}
          aria-label={isDone ? "Tandai belum selesai" : "Tandai selesai"}
          className={`mt-0.5 w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-all ${
            isDone
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-gray-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40'
          }`}
        >
          {isDone && <Check size={12} strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${isDone ? 'line-through text-gray-400 dark:text-slate-500' : 'text-gray-900 dark:text-slate-100'}`}>
            {task.title}
          </p>
          {task.notes && (
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 truncate">{task.notes}</p>
          )}
          <div className="flex items-center gap-2.5 mt-2 text-[11px] text-gray-400 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-gray-400 dark:text-slate-500" />
              {format(new Date(task.reminder_date), 'HH:mm', { locale: id })}
            </span>
            {task.reminder_count > 0 && (
              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full font-medium text-[10px]">
                <Bell size={10} />
                <span>Pengingat #{task.reminder_count}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <StatusBadge status={task.status} />
          {isEditable && (
            <button
              onClick={onEdit}
              className="text-gray-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/60 transition"
              title="Edit Task"
            >
              <Pencil size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-gray-400 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition"
              title="Hapus Task"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

}


