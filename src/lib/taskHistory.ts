import { Task } from '@/types';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

/**
 * Mengurutkan task dari yang terbaru ke terlama berdasarkan reminder_date
 */
export function sortTasksDescending(tasks: Task[]): Task[] {
  return [...tasks].sort(
    (a, b) => new Date(b.reminder_date).getTime() - new Date(a.reminder_date).getTime()
  );
}

/**
 * Membatasi data task sesuai limit pagination
 */
export function paginateTasks(tasks: Task[], limit: number): Task[] {
  if (limit <= 0) return [];
  return tasks.slice(0, limit);
}

/**
 * Mengelompokkan task per tanggal (YYYY-MM-DD) dengan mempertahankan urutan descending
 */
export function groupTasksByDate(tasks: Task[]): Record<string, Task[]> {
  const sorted = sortTasksDescending(tasks);
  return sorted.reduce<Record<string, Task[]>>((acc, task) => {
    const day = format(new Date(task.reminder_date), 'yyyy-MM-dd');
    if (!acc[day]) acc[day] = [];
    acc[day].push(task);
    return acc;
  }, {});
}

/**
 * Format header tanggal kelompok task ke bahasa Inggris dengan tahun.
 * Contoh output: "Monday, 3 Aug 2026" (dapat diubah jadi UPPERCASE di CSS atau UI)
 */
export function formatDateGroupHeader(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return dateStr;
  }
  return format(date, 'EEEE, d MMM yyyy', { locale: enUS });
}
