import { isSameDay } from 'date-fns';
import { Task } from '@/types';

export interface TaskStatsResult {
  activeSummaryTotal: number;
  activeDoneCount: number;
  activePendingCount: number;
  percentage: number;
  totalAllDoneCount: number;
  totalAllTasksCount: number;
}

/**
 * Filter task untuk summary:
 * - Seluruh task yang dijadwalkan tepat hari ini (apapun statusnya).
 * - Task hari sebelum/sesudahnya HANYA jika status belum 'done'.
 */
export function filterSummaryTasks(tasks: Task[], referenceDate: Date = new Date()): Task[] {
  return tasks.filter((task) => {
    const isTargetDay = isSameDay(new Date(task.reminder_date), referenceDate);
    return isTargetDay || task.status !== 'done';
  });
}

/**
 * Hitung statistik progres tugas aktif/harian serta total task done keseluruhan.
 */
export function calculateTaskStats(tasks: Task[], referenceDate: Date = new Date()): TaskStatsResult {
  const totalAllTasksCount = tasks.length;
  const totalAllDoneCount = tasks.filter((t) => t.status === 'done').length;

  const summaryTasks = filterSummaryTasks(tasks, referenceDate);
  const activeSummaryTotal = summaryTasks.length;
  const activeDoneCount = summaryTasks.filter((t) => t.status === 'done').length;
  const activePendingCount = activeSummaryTotal - activeDoneCount;
  const percentage =
    activeSummaryTotal > 0 ? Math.round((activeDoneCount / activeSummaryTotal) * 100) : 0;

  return {
    activeSummaryTotal,
    activeDoneCount,
    activePendingCount,
    percentage,
    totalAllDoneCount,
    totalAllTasksCount,
  };
}
