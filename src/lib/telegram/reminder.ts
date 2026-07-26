import { Task } from '@/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

const REMINDER_INTERVALS_MINUTES = [15, 15, 15, 15]; // 4x 15 menit = 1 jam pertama
const HOURLY_INTERVAL_MINUTES = 60;
const MAX_REMINDER_HOURS = 24;

export function getNextRemindAt(task: Task): Date | null {
  const now = new Date();
  const firstReminder = new Date(task.reminder_date);
  const hoursSinceFirst = (now.getTime() - firstReminder.getTime()) / (1000 * 60 * 60);

  // Berhenti setelah 24 jam jika tidak ditanggapi
  if (hoursSinceFirst >= MAX_REMINDER_HOURS) return null;

  const count = task.reminder_count;
  let minutesUntilNext: number;

  if (count < REMINDER_INTERVALS_MINUTES.length) {
    // Fase 15 menit pertama (4x)
    minutesUntilNext = REMINDER_INTERVALS_MINUTES[count];
  } else {
    // Fase 1 jam berikutnya
    minutesUntilNext = HOURLY_INTERVAL_MINUTES;
  }

  return new Date(now.getTime() + minutesUntilNext * 60 * 1000);
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
