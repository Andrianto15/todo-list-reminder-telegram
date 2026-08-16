import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import {
  formatReminderMessage,
  getReminderInlineKeyboard,
  getNextRemindAt,
} from '@/lib/telegram/reminder';

export async function POST() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing SUPABASE env variables for api/remind');
    return NextResponse.json(
      { error: 'Server configuration error: Missing Supabase keys' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const now = new Date().toISOString();

  // 1. Ambil koneksi Telegram yang aktif
  const { data: connections, error: connError } = await supabase
    .from('telegram_connections')
    .select('user_id, telegram_chat_id')
    .eq('is_connected', true)
    .not('telegram_chat_id', 'is', null);

  if (connError) {
    console.error('Error fetching telegram connections:', connError);
    return NextResponse.json({ error: connError.message }, { status: 500 });
  }

  if (!connections?.length) {
    return NextResponse.json({ sent: 0, message: 'No active telegram connections' });
  }

  // Buat map user_id -> telegram_chat_id
  const chatMap = new Map<string, string>();
  for (const conn of connections) {
    if (conn.telegram_chat_id) {
      chatMap.set(conn.user_id, conn.telegram_chat_id);
    }
  }

  const userIds = Array.from(chatMap.keys());

  // 2. Ambil tasks yang sudah waktunya dikirimi reminder untuk user tersebut
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .in('user_id', userIds)
    .eq('status', 'to_do')
    .lte('next_remind_at', now);

  if (error) {
    console.error('Error fetching tasks for reminder:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!tasks?.length) {
    return NextResponse.json({ sent: 0, message: 'No tasks due' });
  }

  let sent = 0;

  for (const task of tasks) {
    const chatId = chatMap.get(task.user_id);
    if (!chatId) continue;

    try {
      console.info(`Mengirim reminder task ${task.id} ke telegram chat_id: ${chatId}`);

      const response = await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: formatReminderMessage(task),
            parse_mode: 'HTML',
            reply_markup: getReminderInlineKeyboard(task.id),
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Telegram API error for task ${task.id}: ${response.status} ${errorText}`);
        continue;
      }

      console.info(`Berhasil kirim telegram task ${task.id}`);

      // Hitung waktu pengingat berikutnya
      const nextRemindAt = getNextRemindAt(task);

      // Update jumlah reminder & next_remind_at di database
      await supabase
        .from('tasks')
        .update({
          reminder_count: task.reminder_count + 1,
          last_reminded_at: now,
          next_remind_at: nextRemindAt ? nextRemindAt.toISOString() : null,
        })
        .eq('id', task.id);

      sent++;
    } catch (err) {
      console.error(`Gagal mengirim reminder untuk task ${task.id}:`, err);
    }
  }

  return NextResponse.json({ sent });
}

// Support GET method jika dipanggil langsung dari browser/ping service
export async function GET() {
  return POST();
}
