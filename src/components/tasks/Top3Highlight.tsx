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
      <h2 className="text-xs font-light text-[#0051c3] dark:text-blue-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
        <Zap size={14} className="text-amber-500 fill-amber-500" />
        <span>Prioritas Segera</span>
      </h2>
      <div className="space-y-2">
        {top3.map((task) => (
          <div
            key={task.id}
            className="bg-[#eef4fc]/70 dark:bg-slate-800 border border-[#ebebeb] dark:border-slate-700 rounded-[5px] p-3.5 shadow-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[13px] font-medium text-[#404040] dark:text-slate-100">{task.title}</p>
              <StatusBadge status={task.status} />
            </div>
            <p className="text-xs text-[#0051c3] dark:text-blue-400 font-normal mt-1.5 flex items-center gap-1">
              <Clock size={12} />
              <span>{format(new Date(task.reminder_date), 'EEEE, d MMM yyyy · HH:mm', { locale: id })}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

