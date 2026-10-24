import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let rawBody: Record<string, unknown>;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const { payload, hasValidFields } = sanitizeTaskUpdate(rawBody);
  if (!hasValidFields) {
    return NextResponse.json(
      { error: 'No valid fields provided for update' },
      { status: 400 }
    );
  }

  payload.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('tasks')
    .update(payload)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
