import { Task, TaskStatus } from '@/types';

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

export function formatReminderDate(dateStr: string): string {
  const d = new Date(dateStr);
  const parts = new Intl.DateTimeFormat('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    hourCycle: 'h23',
  }).formatToParts(d);

  const map: Record<string, string> = {};
  for (const p of parts) {
    map[p.type] = p.value;
  }
  return `${map.weekday}, ${map.day} ${map.month} ${map.year} · ${map.hour}:${map.minute}`;
}

export function formatReminderMessage(task: Task): string {
  const urgencyEmoji = task.reminder_count === 0 ? '🔔' : task.reminder_count <= 3 ? '⚠️' : '🚨';
  const reminderText = task.reminder_count > 0 ? `\n<i>Pengingat ke-${task.reminder_count + 1}</i>` : '';

  return `${urgencyEmoji} <b>Pengingat Tugas</b>${reminderText}

📌 <b>${task.title}</b>

🕐 ${formatReminderDate(task.reminder_date)}${
    task.notes ? `\n\n📝 ${task.notes}` : ''
  }`;
}

export function getReminderInlineKeyboard(taskId: string) {
  return {
    inline_keyboard: [
      [
        { text: '✅ Done', callback_data: `done:${taskId}` },
        { text: '⏸️ Hold', callback_data: `hold:${taskId}` },
        { text: '❌ Cancel', callback_data: `cancel:${taskId}` },
      ],
    ],
  };
}
