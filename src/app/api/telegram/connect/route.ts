import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Buat random connect token 16 karakter unik
  const connectToken = crypto.randomBytes(8).toString('hex');

  // Upsert record ke tabel telegram_connections
  const { data, error } = await supabase
    .from('telegram_connections')
    .upsert(
      {
        user_id: user.id,
        connect_token: connectToken,
        is_connected: false,
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
