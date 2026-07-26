import { Task } from '@/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import StatusBadge from './StatusBadge';

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
    <div className={`bg-white border rounded-xl p-4 transition-all hover:border-gray-300 shadow-sm ${isDone || isCancel ? 'opacity-55' : ''}`}>
      <div className="flex items-start gap-3">
        {/* Checkbox done */}
        <button
          onClick={() => onStatusChange(task.id, isDone ? 'to_do' : 'done')}
          className={`mt-0.5 w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${
            isDone
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-gray-300 hover:border-indigo-500'
          }`}
        >
          {isDone && <span className="text-[10px] font-bold">✓</span>}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${isDone ? 'line-through text-gray-400' : 'text-gray-900'}`}>
            {task.title}
          </p>
          {task.notes && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{task.notes}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-400">
            <span>🕐 {format(new Date(task.reminder_date), 'HH:mm', { locale: id })}</span>
            {task.reminder_count > 0 && (
              <span className="text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded font-medium">
                Pengingat #{task.reminder_count}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status={task.status} />
          {isEditable && (
            <button
              onClick={onEdit}
              className="text-gray-400 hover:text-indigo-600 p-1 transition"
              title="Edit Task"
            >
              ✏️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
