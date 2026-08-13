import { Task } from '@/types';
import { format, isToday, isTomorrow } from 'date-fns';
import { id } from 'date-fns/locale';
import TaskCard from './TaskCard';

interface Props {
  date: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
  onDelete: (task: Task) => void;
}

function getDayLabel(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return 'Hari Ini';
  if (isTomorrow(date)) return 'Besok';
  return format(date, 'EEEE, d MMM', { locale: id });
}

export default function TaskGroup({
  date,
  tasks,
  onEdit,
  onStatusChange,
  onDelete,
}: Props) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
        {getDayLabel(date)}
      </h3>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => onEdit(task)}
            onStatusChange={onStatusChange}
            onDelete={() => onDelete(task)}
          />
        ))}
      </div>
    </div>
  );
}

