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
    <div className={`bg-white dark:bg-slate-800/90 border border-[#ebebeb] dark:border-slate-700/80 rounded-[5px] p-3.5 transition-all hover:border-[#0051c3]/40 dark:hover:border-slate-600 shadow-xs ${isDone || isCancel ? 'opacity-50' : ''}`}>
      <div className="flex items-start gap-3">
        {/* Checkbox done */}
        <button
          onClick={() => onStatusChange(task.id, isDone ? 'to_do' : 'done')}
          aria-label={isDone ? "Tandai belum selesai" : "Tandai selesai"}
          className={`mt-0.5 w-4.5 h-4.5 rounded-[5px] border flex-shrink-0 flex items-center justify-center transition-all ${
            isDone
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-[#ebebeb] dark:border-slate-600 hover:border-[#0051c3] dark:hover:border-blue-400 hover:bg-[#eef4fc] dark:hover:bg-blue-950/40'
          }`}
        >
          {isDone && <Check size={11} strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-[13px] font-normal ${isDone ? 'line-through text-[#a3a3a3] dark:text-slate-500' : 'text-[#404040] dark:text-slate-100'}`}>
            {task.title}
          </p>
          {task.notes && (
            <p className="text-xs text-[#737373] dark:text-slate-400 mt-0.5 truncate">{task.notes}</p>
          )}
          <div className="flex items-center gap-2.5 mt-2 text-[11px] text-[#737373] dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-[#737373] dark:text-slate-500" />
              {format(new Date(task.reminder_date), 'HH:mm', { locale: id })}
            </span>
            {task.reminder_count > 0 && (
              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-[5px] font-medium text-[10px]">
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
              className="text-[#737373] dark:text-slate-400 hover:text-[#0051c3] dark:hover:text-blue-400 p-1.5 rounded-[5px] hover:bg-[#ebebeb]/50 dark:hover:bg-slate-700/60 transition"
              title="Edit Task"
            >
              <Pencil size={13} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-[#737373] dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-1.5 rounded-[5px] hover:bg-red-50 dark:hover:bg-red-950/40 transition"
              title="Hapus Task"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


