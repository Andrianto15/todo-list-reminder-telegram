import { Task, TaskStatus } from '@/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const HOURLY_INTERVAL_MINUTES = 60;
const MAX_REMINDER_HOURS = 6;
const MAX_REMINDER_COUNT = 6;

export function isTaskEligibleForReminder(status: TaskStatus): boolean {
  return status === 'to_do';
}

export function getNextRemindAt(task: Task): Date | null {
  const now = new Date();
  const firstReminder = new Date(task.reminder_date);
  const hoursSinceFirst = (now.getTime() - firstReminder.getTime()) / (1000 * 60 * 60);

  // Berhenti setelah 6 jam atau sudah mencapai 6 kali pengingat
  if (hoursSinceFirst >= MAX_REMINDER_HOURS || task.reminder_count + 1 >= MAX_REMINDER_COUNT) {
    return null;
  }

  return new Date(now.getTime() + HOURLY_INTERVAL_MINUTES * 60 * 1000);
}

export function formatReminderMessage(task: Task): string {
  const urgencyEmoji = task.reminder_count === 0 ? '🔔' : task.reminder_count <= 3 ? '⚠️' : '🚨';
  const reminderText = task.reminder_count > 0 ? `\n<i>Pengingat ke-${task.reminder_count + 1}</i>` : '';

  return `${urgencyEmoji} <b>Pengingat Tugas</b>${reminderText}

📌 <b>${task.title}</b>

🕐 ${format(new Date(task.reminder_date), "EEEE, d MMMM yyyy · HH:mm", { locale: id })}${
    task.notes ? `\n\n📝 ${task.notes}` : ''
  }`;
}

export function getReminderInlineKeyboard(taskId: string) {
  return {
    inline_keyboard: [
      [
        { text: '✅ Tandai Selesai', callback_data: `done:${taskId}` },
      ],
    ],
  };
}
