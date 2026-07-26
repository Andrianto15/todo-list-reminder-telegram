import { TaskStatus } from '@/types';

const config: Record<TaskStatus, { label: string; className: string }> = {
  to_do: { label: 'To Do', className: 'bg-blue-50 text-blue-600 border-blue-100' },
  done: { label: 'Done', className: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  hold: { label: 'Hold', className: 'bg-amber-50 text-amber-600 border-amber-100' },
  cancel: { label: 'Cancel', className: 'bg-gray-100 text-gray-400 border-gray-200' },
};

export default function StatusBadge({ status }: { status: TaskStatus }) {
  const { label, className } = config[status];
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${className}`}>
      {label}
    </span>
  );
}
