import { Task } from '@/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import StatusBadge from './StatusBadge';
import { Zap, Clock } from 'lucide-react';

interface Props {
  tasks: Task[];
}

export default function Top3Highlight({ tasks }: Props) {
  const top3 = tasks
    .filter((t) => t.status === 'to_do' || t.status === 'hold')
    .sort(
      (a, b) =>
        new Date(a.reminder_date).getTime() - new Date(b.reminder_date).getTime()
    )
    .slice(0, 3);

  if (top3.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
        <Zap size={14} className="text-amber-500 fill-amber-500" />
        <span>Prioritas Segera</span>
      </h2>
      <div className="space-y-2">
        {top3.map((task) => (
          <div
            key={task.id}
            className="bg-gradient-to-r from-indigo-50/80 to-purple-50/50 border border-indigo-100/80 rounded-2xl p-3.5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-gray-900">{task.title}</p>
              <StatusBadge status={task.status} />
            </div>
            <p className="text-xs text-indigo-600 font-medium mt-1.5 flex items-center gap-1">
              <Clock size={12} />
              <span>{format(new Date(task.reminder_date), 'EEEE, d MMM · HH:mm', { locale: id })}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

