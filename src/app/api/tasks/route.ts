import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET: Ambil semua task milik user yang terautentikasi
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('reminder_date', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST: Tambah task baru
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title, notes, reminder_date } = body;

  if (!title || !reminder_date) {
    return NextResponse.json(
      { error: 'Judul dan tanggal pengingat harus diisi' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: user.id,
      title,
      notes: notes || null,
      status: 'to_do',
      reminder_date,
      next_remind_at: reminder_date,
      reminder_count: 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
