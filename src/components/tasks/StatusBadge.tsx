import { TaskStatus } from '@/types';

const config: Record<TaskStatus, { label: string; className: string }> = {
  to_do: { label: 'To Do', className: 'bg-[#eef4fc] dark:bg-blue-950/60 text-[#0051c3] dark:text-blue-400 border-[#0051c3]/30 dark:border-blue-900/60' },
  done: { label: 'Done', className: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60' },
  hold: { label: 'Hold', className: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/60' },
  cancel: { label: 'Cancel', className: 'bg-[#ebebeb] dark:bg-slate-800 text-[#737373] dark:text-slate-400 border-[#ebebeb] dark:border-slate-700' },
};

export default function StatusBadge({ status }: { status: TaskStatus }) {
  const { label, className } = config[status];
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-[5px] border ${className}`}>
      {label}
    </span>
  );
}
