import { TaskStatus } from '@/types';

const config: Record<TaskStatus, { label: string; className: string }> = {
  to_do: { label: 'To Do', className: 'bg-[#eef5fa] dark:bg-[#18283d] text-[#4682b4] dark:text-[#6ba3ce] border-[#4682b4]/30 dark:border-[#4682b4]/40' },
  done: { label: 'Done', className: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60' },
  hold: { label: 'Hold', className: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60' },
  cancel: { label: 'Cancel', className: 'bg-[#f1f5f9] dark:bg-[#1e293b] text-[#64748b] dark:text-[#94a3b8] border-[#e2e8f0] dark:border-[#334155]' },
};

export default function StatusBadge({ status }: { status: TaskStatus }) {
  const { label, className } = config[status];
  return (
    <span className={`text-[10px] tracking-wide font-bold uppercase px-2.5 py-0.5 rounded-full border ${className}`}>
      {label}
    </span>
  );
}
