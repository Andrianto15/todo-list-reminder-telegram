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
    <div className={`bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-xl p-3.5 sm:p-4 transition-all hover:border-[#4682b4]/40 hover:shadow-md shadow-xs ${isDone || isCancel ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-2.5">
        {/* Checkbox done with 44px hit bounds */}
        <button
          role="checkbox"
          aria-checked={isDone}
          onClick={() => onStatusChange(task.id, isDone ? 'to_do' : 'done')}
          aria-label={isDone ? 'Tandai belum selesai' : 'Tandai selesai'}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 -m-2"
        >
          <div
            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
              isDone
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : 'border-[#cbd5e1] dark:border-[#334155] hover:border-[#4682b4] dark:hover:border-[#6ba3ce] hover:bg-[#eef5fa] dark:hover:bg-[#18283d]'
            }`}
          >
            {isDone && <Check size={13} strokeWidth={3} />}
          </div>
        </button>

        <div className="flex-1 min-w-0 pt-0.5">
          <p className={`text-sm font-semibold leading-snug ${isDone ? 'line-through text-[#94a3b8] dark:text-[#64748b]' : 'text-[#0f172a] dark:text-[#f8fafc]'}`}>
            {task.title}
          </p>
          {task.notes && (
            <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mt-1 truncate">{task.notes}</p>
          )}
          <div className="flex items-center gap-2.5 mt-2 text-xs text-[#64748b] dark:text-[#94a3b8]">
            <span className="flex items-center gap-1">
              <Clock size={13} className="text-[#64748b] dark:text-[#94a3b8]" />
              {format(new Date(task.reminder_date), 'HH:mm', { locale: id })}
            </span>
            {task.reminder_count > 0 && (
              <span className="inline-flex items-center gap-1 text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full font-semibold text-[10px]">
                <Bell size={10} />
                <span>Pengingat #{task.reminder_count}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 pt-0.5">
          <StatusBadge status={task.status} />
          {isEditable && (
            <button
              onClick={onEdit}
              className="text-[#64748b] dark:text-[#94a3b8] hover:text-[#4682b4] dark:hover:text-[#6ba3ce] p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-[#e2e8f0]/50 dark:hover:bg-[#1e293b] transition"
              title="Edit Task"
              aria-label="Edit Task"
            >
              <Pencil size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-[#64748b] dark:text-[#94a3b8] hover:text-red-600 dark:hover:text-red-400 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition"
              title="Hapus Task"
              aria-label="Hapus Task"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
