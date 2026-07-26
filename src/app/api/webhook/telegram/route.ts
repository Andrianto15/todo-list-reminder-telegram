import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  // Validasi secret token dari Telegram
  const secretToken = request.headers.get('x-telegram-bot-api-secret-token');
  if (secretToken !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  // Handle perintah /start <connect_token>
  if (body.message?.text?.startsWith('/start ')) {
    const token = body.message.text.split(' ')[1];
    const chatId = String(body.message.chat.id);

    const { data: conn } = await supabase
      .from('telegram_connections')
      .select('*')
      .eq('connect_token', token)
      .eq('is_connected', false)
      .single();

    if (conn) {
      await supabase
        .from('telegram_connections')
        .update({
          telegram_chat_id: chatId,
          is_connected: true,
          connected_at: new Date().toISOString(),
          connect_token: null,
        })
        .eq('id', conn.id);

      await sendTelegramMessage(
        chatId,
        '✅ <b>Akun Telegram Berhasil Terhubung!</b>\n\nKamu akan menerima pengingat tugas harian di chat ini.'
      );
    } else {
      await sendTelegramMessage(
        chatId,
        '❌ <b>Token Tidak Valid</b>\n\nToken tidak ditemukan atau sudah digunakan. Silakan generate token baru dari aplikasi.'
      );
    }

    return NextResponse.json({ ok: true });
  }

  // Handle callback_query (saat tombol 'Tandai Selesai' di Telegram diklik)
  if (body.callback_query) {
    const { id: callbackId, data, message } = body.callback_query;
    const chatId = String(message.chat.id);

    if (data?.startsWith('done:')) {
      const taskId = data.replace('done:', '');

      // Ambil user_id pemilik Telegram Chat ini
      const { data: conn } = await supabase
        .from('telegram_connections')
        .select('user_id')
        .eq('telegram_chat_id', chatId)
        .eq('is_connected', true)
        .single();

      if (conn) {
        // Update status task menjadi 'done' dan matikan next_remind_at
        await supabase
          .from('tasks')
          .update({
            status: 'done',
            next_remind_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', taskId)
          .eq('user_id', conn.user_id);

        // Hapus indikator loading di tombol Telegram
        await answerCallbackQuery(callbackId, '✅ Task berhasil ditandai selesai!');

        // Edit isi pesan Telegram agar memperlihatkan status selesai
        await editTelegramMessage(
          chatId,
          message.message_id,
          `${message.text}\n\n✅ <b>SUDAH SELESAI</b>`
        );
      }
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}

async function sendTelegramMessage(chatId: string, text: string) {
  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    }
  );
}

async function answerCallbackQuery(callbackQueryId: string, text: string) {
  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
    }
  );
}

async function editTelegramMessage(
  chatId: string,
  messageId: number,
  text: string
) {
  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/editMessageText`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: 'HTML',
      }),
    }
  );
}
