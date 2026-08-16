import { Task } from '@/types';
import { formatDateGroupHeader } from '@/lib/taskHistory';
import TaskCard from './TaskCard';

interface Props {
  date: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
  onDelete: (task: Task) => void;
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
      <h3 className="text-xs font-light text-[#737373] dark:text-slate-400 uppercase tracking-wider mb-2 px-1">
        {formatDateGroupHeader(date)}
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

