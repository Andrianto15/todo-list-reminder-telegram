export function sanitizeTaskUpdate(body: Record<string, unknown>): {
  payload: Record<string, unknown>;
  hasValidFields: boolean;
} {
  const allowedFields = ['title', 'notes', 'status', 'reminder_date'] as const;
  const payload: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (field in body && body[field] !== undefined) {
      payload[field] = body[field];
    }
  }

  const hasValidFields = Object.keys(payload).length > 0;

  if (payload.reminder_date) {
    payload.next_remind_at = payload.reminder_date;
    payload.reminder_count = 0;
    payload.last_reminded_at = null;
  }

  if (payload.status === 'done' || payload.status === 'cancel') {
    payload.next_remind_at = null;
  }

  return { payload, hasValidFields };
}
