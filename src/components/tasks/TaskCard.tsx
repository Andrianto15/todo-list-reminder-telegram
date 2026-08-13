import { Task } from '@/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import StatusBadge from './StatusBadge';
import { Check, Clock, Bell, Pencil } from 'lucide-react';

interface Props {
  task: Task;
  onEdit: () => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

export default function TaskCard({ task, onEdit, onStatusChange }: Props) {
  const isDone = task.status === 'done';
  const isCancel = task.status === 'cancel';
  const isEditable = !isDone && !isCancel;

  return (
    <div className={`bg-white border border-gray-100 rounded-2xl p-4 transition-all hover:border-gray-200 shadow-sm ${isDone || isCancel ? 'opacity-55' : ''}`}>
      <div className="flex items-start gap-3">
        {/* Checkbox done */}
        <button
          onClick={() => onStatusChange(task.id, isDone ? 'to_do' : 'done')}
          aria-label={isDone ? "Tandai belum selesai" : "Tandai selesai"}
          className={`mt-0.5 w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-all ${
            isDone
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-gray-300 hover:border-indigo-500 hover:bg-indigo-50/50'
          }`}
        >
          {isDone && <Check size={12} strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${isDone ? 'line-through text-gray-400' : 'text-gray-900'}`}>
            {task.title}
          </p>
          {task.notes && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{task.notes}</p>
          )}
          <div className="flex items-center gap-2.5 mt-2 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-gray-400" />
              {format(new Date(task.reminder_date), 'HH:mm', { locale: id })}
            </span>
            {task.reminder_count > 0 && (
              <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium text-[10px]">
                <Bell size={10} />
                <span>Pengingat #{task.reminder_count}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status={task.status} />
          {isEditable && (
            <button
              onClick={onEdit}
              className="text-gray-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-gray-50 transition"
              title="Edit Task"
            >
              <Pencil size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

