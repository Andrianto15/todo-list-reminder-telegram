import { sanitizeTaskUpdate } from '@/app/api/tasks/[id]/route';

describe('sanitizeTaskUpdate', () => {
  it('allows valid fields: title, notes, status, reminder_date', () => {
    const raw = {
      title: 'New Title',
      notes: 'New Notes',
      status: 'hold',
      reminder_date: '2026-10-25T10:00:00.000Z',
    };
    const { payload, hasValidFields } = sanitizeTaskUpdate(raw);
    expect(hasValidFields).toBe(true);
    expect(payload.title).toBe('New Title');
    expect(payload.notes).toBe('New Notes');
    expect(payload.status).toBe('hold');
    expect(payload.reminder_date).toBe('2026-10-25T10:00:00.000Z');
    expect(payload.next_remind_at).toBe('2026-10-25T10:00:00.000Z');
    expect(payload.reminder_count).toBe(0);
    expect(payload.last_reminded_at).toBeNull();
  });

  it('filters out disallowed fields (mass assignment prevention)', () => {
    const raw = {
      title: 'Valid Title',
      user_id: 'malicious-user-id',
      id: 'malicious-task-id',
      created_at: '1970-01-01T00:00:00.000Z',
      reminder_count: 999,
      next_remind_at: '2099-01-01T00:00:00.000Z',
      unknown_field: 'exploit',
    };
    const { payload, hasValidFields } = sanitizeTaskUpdate(raw);
    expect(hasValidFields).toBe(true);
    expect(payload.title).toBe('Valid Title');
    expect(payload.user_id).toBeUndefined();
    expect(payload.id).toBeUndefined();
    expect(payload.created_at).toBeUndefined();
    expect(payload.reminder_count).toBeUndefined();
    expect(payload.unknown_field).toBeUndefined();
  });

  it('sets next_remind_at to null when status is done or cancel', () => {
    const doneUpdate = sanitizeTaskUpdate({ status: 'done' });
    expect(doneUpdate.payload.next_remind_at).toBeNull();

    const cancelUpdate = sanitizeTaskUpdate({ status: 'cancel' });
    expect(cancelUpdate.payload.next_remind_at).toBeNull();
  });

  it('returns hasValidFields: false when no allowed fields are present', () => {
    const emptyUpdate = sanitizeTaskUpdate({});
    expect(emptyUpdate.hasValidFields).toBe(false);

    const maliciousOnly = sanitizeTaskUpdate({ user_id: 'attacker', hacked: true });
    expect(maliciousOnly.hasValidFields).toBe(false);
  });
});
