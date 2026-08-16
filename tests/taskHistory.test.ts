import { Task } from '@/types';
import {
  sortTasksDescending,
  paginateTasks,
  groupTasksByDate,
  formatDateGroupHeader,
} from '@/lib/taskHistory';

const createMockTask = (
  id: string,
  title: string,
  reminder_date: string,
  status: Task['status'] = 'to_do'
): Task => ({
  id,
  user_id: 'user-1',
  title,
  notes: null,
  status,
  reminder_date,
  next_remind_at: reminder_date,
  reminder_count: 0,
  last_reminded_at: null,
  created_at: reminder_date,
  updated_at: reminder_date,
});

describe('taskHistory helpers', () => {
  const mockTasks: Task[] = [
    createMockTask('1', 'Bayar Indihome', '2026-08-03T10:00:00.000Z'),
    createMockTask('2', 'Testing notif tele', '2026-08-04T07:00:00.000Z'),
    createMockTask('3', 'Test', '2026-08-13T21:50:00.000Z'),
    createMockTask('4', 'Test 2', '2026-08-14T16:30:00.000Z'),
    createMockTask('5', 'Lanjut edit BE ITCH', '2026-08-15T13:00:00.000Z'),
    createMockTask('6', 'Task terbaru', '2026-08-16T09:00:00.000Z'),
    createMockTask('7', 'Task masa depan', '2026-08-20T10:00:00.000Z'),
  ];

  describe('sortTasksDescending', () => {
    it('mengurutkan task dari tanggal terbaru ke tanggal terlama', () => {
      const sorted = sortTasksDescending(mockTasks);
      expect(sorted[0].id).toBe('7'); // 2026-08-20
      expect(sorted[1].id).toBe('6'); // 2026-08-16
      expect(sorted[2].id).toBe('5'); // 2026-08-15
      expect(sorted[sorted.length - 1].id).toBe('1'); // 2026-08-03
    });

    it('tidak mengubah array asli (immutable)', () => {
      const originalFirst = mockTasks[0].id;
      sortTasksDescending(mockTasks);
      expect(mockTasks[0].id).toBe(originalFirst);
    });

    it('menangani array kosong', () => {
      expect(sortTasksDescending([])).toEqual([]);
    });
  });

  describe('paginateTasks', () => {
    it('mengambil 5 data pertama secara tepat', () => {
      const paginated = paginateTasks(mockTasks, 5);
      expect(paginated.length).toBe(5);
      expect(paginated[0].id).toBe('1');
      expect(paginated[4].id).toBe('5');
    });

    it('mengambil semua data jika limit melebihi jumlah task', () => {
      const paginated = paginateTasks(mockTasks, 10);
      expect(paginated.length).toBe(mockTasks.length);
    });

    it('mengembalikan array kosong jika limit <= 0', () => {
      expect(paginateTasks(mockTasks, 0)).toEqual([]);
      expect(paginateTasks(mockTasks, -1)).toEqual([]);
    });
  });

  describe('groupTasksByDate', () => {
    it('mengelompokkan task berdasarkan tanggal dengan urutan descending', () => {
      const grouped = groupTasksByDate(mockTasks);
      const keys = Object.keys(grouped);
      // Key pertama harus tanggal paling baru
      expect(keys[0]).toBe('2026-08-20');
      expect(keys[keys.length - 1]).toBe('2026-08-03');
      expect(grouped['2026-08-15'][0].title).toBe('Lanjut edit BE ITCH');
    });
  });

  describe('formatDateGroupHeader', () => {
    it('memformat tanggal ke format bahasa Inggris lengkap dengan tahun', () => {
      const formatted1 = formatDateGroupHeader('2026-08-03T10:00:00.000Z');
      expect(formatted1).toMatch(/Monday, \d+ Aug 2026/);

      const formatted2 = formatDateGroupHeader('2026-08-15T13:00:00.000Z');
      expect(formatted2).toMatch(/Saturday, \d+ Aug 2026/);
    });

    it('menangani string tanggal format YYYY-MM-DD secara konsisten', () => {
      // 2026-08-03 is a Monday
      const formatted = formatDateGroupHeader('2026-08-03');
      expect(formatted).toContain('Aug 2026');
      expect(formatted).toContain('Monday');
    });

    it('mengembalikan string asli jika input tidak valid', () => {
      expect(formatDateGroupHeader('invalid-date')).toBe('invalid-date');
    });
  });
});
