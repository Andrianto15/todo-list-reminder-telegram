import { filterSummaryTasks, calculateTaskStats } from '../src/lib/taskStats';
import { Task } from '../src/types';

function createMockTask(
  id: string,
  reminderDate: string,
  status: Task['status'] = 'to_do'
): Task {
  return {
    id,
    user_id: 'user-123',
    title: `Task ${id}`,
    notes: null,
    status,
    reminder_date: reminderDate,
    next_remind_at: null,
    reminder_count: 0,
    last_reminded_at: null,
    created_at: '2026-08-16T00:00:00.000Z',
    updated_at: '2026-08-16T00:00:00.000Z',
  };
}

describe('Task Stats Helper', () => {
  const referenceDate = new Date('2026-08-16T10:00:00.000Z');
  const todayStr = '2026-08-16T08:00:00.000Z';
  const yesterdayStr = '2026-08-15T08:00:00.000Z';
  const tomorrowStr = '2026-08-17T08:00:00.000Z';

  describe('filterSummaryTasks', () => {
    it('returns empty array when given empty tasks list', () => {
      const result = filterSummaryTasks([], referenceDate);
      expect(result).toEqual([]);
    });

    it('includes all tasks from today regardless of status', () => {
      const tasks = [
        createMockTask('1', todayStr, 'done'),
        createMockTask('2', todayStr, 'to_do'),
        createMockTask('3', todayStr, 'hold'),
        createMockTask('4', todayStr, 'cancel'),
      ];

      const result = filterSummaryTasks(tasks, referenceDate);
      expect(result).toHaveLength(4);
      expect(result.map((t) => t.id)).toEqual(['1', '2', '3', '4']);
    });

    it('excludes done tasks from past and future days, but includes non-done tasks', () => {
      const tasks = [
        createMockTask('past-done', yesterdayStr, 'done'),
        createMockTask('past-todo', yesterdayStr, 'to_do'),
        createMockTask('today-done', todayStr, 'done'),
        createMockTask('today-todo', todayStr, 'to_do'),
        createMockTask('future-done', tomorrowStr, 'done'),
        createMockTask('future-hold', tomorrowStr, 'hold'),
      ];

      const result = filterSummaryTasks(tasks, referenceDate);
      const resultIds = result.map((t) => t.id);

      expect(resultIds).toContain('past-todo');
      expect(resultIds).toContain('today-done');
      expect(resultIds).toContain('today-todo');
      expect(resultIds).toContain('future-hold');

      expect(resultIds).not.toContain('past-done');
      expect(resultIds).not.toContain('future-done');
      expect(result).toHaveLength(4);
    });
  });

  describe('calculateTaskStats', () => {
    it('handles empty task list correctly', () => {
      const stats = calculateTaskStats([], referenceDate);
      expect(stats).toEqual({
        activeSummaryTotal: 0,
        activeDoneCount: 0,
        activePendingCount: 0,
        percentage: 0,
        totalAllDoneCount: 0,
        totalAllTasksCount: 0,
      });
    });

    it('calculates active summary and total all done accurately', () => {
      const tasks = [
        // Yesterday: 2 tasks (1 done -> ignored from summary, 1 pending -> included)
        createMockTask('1', yesterdayStr, 'done'),
        createMockTask('2', yesterdayStr, 'to_do'),
        // Today: 3 tasks (2 done, 1 pending -> all included)
        createMockTask('3', todayStr, 'done'),
        createMockTask('4', todayStr, 'done'),
        createMockTask('5', todayStr, 'to_do'),
        // Tomorrow: 2 tasks (1 done -> ignored, 1 pending -> included)
        createMockTask('6', tomorrowStr, 'done'),
        createMockTask('7', tomorrowStr, 'hold'),
      ];

      const stats = calculateTaskStats(tasks, referenceDate);

      // Total all tasks: 7
      expect(stats.totalAllTasksCount).toBe(7);
      // Total all done: 1 (yesterday) + 2 (today) + 1 (tomorrow) = 4
      expect(stats.totalAllDoneCount).toBe(4);

      // Active summary tasks:
      // '2' (yesterday to_do), '3' (today done), '4' (today done), '5' (today to_do), '7' (tomorrow hold) -> total 5
      expect(stats.activeSummaryTotal).toBe(5);
      // Active done in summary: '3' and '4' -> 2
      expect(stats.activeDoneCount).toBe(2);
      // Active pending in summary: 5 - 2 = 3 ('2', '5', '7')
      expect(stats.activePendingCount).toBe(3);
      // Percentage: 2 / 5 * 100 = 40%
      expect(stats.percentage).toBe(40);
    });

    it('calculates 100% when all summary tasks are done', () => {
      const tasks = [
        createMockTask('1', yesterdayStr, 'done'),
        createMockTask('2', todayStr, 'done'),
        createMockTask('3', todayStr, 'done'),
      ];

      const stats = calculateTaskStats(tasks, referenceDate);
      expect(stats.activeSummaryTotal).toBe(2);
      expect(stats.activeDoneCount).toBe(2);
      expect(stats.activePendingCount).toBe(0);
      expect(stats.percentage).toBe(100);
      expect(stats.totalAllDoneCount).toBe(3);
    });
  });
});
