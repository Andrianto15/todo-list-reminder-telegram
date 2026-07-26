import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await supabase
    .from('users')
    .update({ is_active: false, deactivated_at: new Date().toISOString() })
    .eq('id', user.id);

  await supabase.auth.signOut();
  return NextResponse.json({ success: true });
}
