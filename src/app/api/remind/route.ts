import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import {
  formatReminderMessage,
  getReminderInlineKeyboard,
  getNextRemindAt,
} from '@/lib/telegram/reminder';

// Menggunakan service role key untuk bypass RLS (karena dijalankan oleh cron job)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  const now = new Date().toISOString();

  // Ambil tasks yang sudah waktunya dikirimi reminder
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select(`
      *,
      telegram_connections!inner(telegram_chat_id, is_connected)
    `)
    .in('status', ['to_do', 'hold'])
    .lte('next_remind_at', now)
    .not('telegram_connections.telegram_chat_id', 'is', null)
    .eq('telegram_connections.is_connected', true);

  if (error || !tasks?.length) {
    return NextResponse.json({ sent: 0 });
  }

  let sent = 0;

  for (const task of tasks) {
    const chatId = task.telegram_connections.telegram_chat_id;

    try {
      // Kirim pesan pengingat ke Telegram
      await fetch(
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
