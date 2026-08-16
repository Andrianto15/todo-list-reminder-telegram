import { getNextRemindAt, formatReminderMessage, getReminderInlineKeyboard } from '@/lib/telegram/reminder';
import { Task } from '@/types';

describe('Telegram Reminder Helper', () => {
  const baseTask: Task = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    user_id: 'user-123',
    title: 'Test Reminder Task',
    notes: 'Important notes',
    status: 'to_do',
    reminder_date: new Date().toISOString(),
    next_remind_at: new Date().toISOString(),
    reminder_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  describe('getNextRemindAt', () => {
    it('schedules next reminder 60 minutes later for first reminder (count 0)', () => {
      const now = new Date();
      const task: Task = {
        ...baseTask,
        reminder_date: now.toISOString(),
        reminder_count: 0,
      };

      const next = getNextRemindAt(task);
      expect(next).not.toBeNull();
      const diffMinutes = Math.round((next!.getTime() - now.getTime()) / (1000 * 60));
      expect(diffMinutes).toBe(60);
    });

    it('schedules next reminder 60 minutes later for subsequent reminders under limit', () => {
      const now = new Date();
      const task: Task = {
        ...baseTask,
        reminder_date: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        reminder_count: 2,
      };

      const next = getNextRemindAt(task);
      expect(next).not.toBeNull();
      const diffMinutes = Math.round((next!.getTime() - now.getTime()) / (1000 * 60));
      expect(diffMinutes).toBe(60);
    });

    it('returns null when reminder_count reaches maximum 6 times (count 5 before update)', () => {
      const now = new Date();
      const task: Task = {
        ...baseTask,
        reminder_date: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
        reminder_count: 5,
      };

      const next = getNextRemindAt(task);
      expect(next).toBeNull();
    });

    it('returns null when task has exceeded 6 hours since initial reminder_date', () => {
      const now = new Date();
      const task: Task = {
        ...baseTask,
        reminder_date: new Date(now.getTime() - 7 * 60 * 60 * 1000).toISOString(), // 7 hours ago
        reminder_count: 2,
      };

      const next = getNextRemindAt(task);
      expect(next).toBeNull();
    });
  });

  describe('formatReminderMessage', () => {
    it('formats initial reminder message with bell icon', () => {
      const task: Task = {
        ...baseTask,
        reminder_count: 0,
      };

      const msg = formatReminderMessage(task);
      expect(msg).toContain('🔔 <b>Pengingat Tugas</b>');
      expect(msg).toContain('📌 <b>Test Reminder Task</b>');
      expect(msg).toContain('📝 Important notes');
      expect(msg).not.toContain('Pengingat ke-');
    });

    it('formats subsequent reminder message with warning icon and reminder count indicator', () => {
      const task: Task = {
        ...baseTask,
        reminder_count: 2,
      };

      const msg = formatReminderMessage(task);
      expect(msg).toContain('⚠️ <b>Pengingat Tugas</b>');
      expect(msg).toContain('<i>Pengingat ke-3</i>');
    });

    it('formats late reminder message (> 3) with siren icon', () => {
      const task: Task = {
        ...baseTask,
        reminder_count: 4,
      };

      const msg = formatReminderMessage(task);
      expect(msg).toContain('🚨 <b>Pengingat Tugas</b>');
      expect(msg).toContain('<i>Pengingat ke-5</i>');
    });
  });

  describe('getReminderInlineKeyboard', () => {
    it('generates inline keyboard with done action callback', () => {
      const keyboard = getReminderInlineKeyboard('task-id-abc');
      expect(keyboard.inline_keyboard[0][0]).toEqual({
        text: '✅ Tandai Selesai',
        callback_data: 'done:task-id-abc',
      });
    });
  });
});
