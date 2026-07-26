'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TelegramConnection } from '@/types';
import Navbar from '@/components/ui/Navbar';

export default function TelegramSettingsPage() {
  const supabase = createClient();
  const [conn, setConn] = useState<TelegramConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchConnection = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from('telegram_connections')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    setConn(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchConnection();
  }, [fetchConnection]);

  const generateToken = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/telegram/connect', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setConn(data);
      }
    } catch (err) {
      console.error('Failed to generate token:', err);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-lg font-bold text-gray-900 mb-6">Integrasi Telegram</h1>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-sm text-gray-400 gap-2">
            <span className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
            <span>Memuat status koneksi...</span>
          </div>
        ) : conn?.is_connected ? (
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 text-lg">✅</span>
              <p className="text-sm font-semibold text-emerald-900">Telegram Terhubung</p>
            </div>
            <p className="text-xs text-emerald-700">
              Notifikasi reminder akan dikirimkan otomatis ke Telegram Chat ID: {' '}
              <code className="font-mono bg-emerald-100/80 px-1.5 py-0.5 rounded text-emerald-900 font-bold">
                {conn.telegram_chat_id}
              </code>
            </p>
          </div>
        ) : (
          <div className="space-y-5 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
            <p className="text-sm text-gray-600 leading-relaxed">
              Hubungkan akun Telegram Anda untuk menerima pesan pengingat tugas harian secara proaktif.
            </p>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2.5">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Langkah-langkah:</p>
              <ol className="text-xs text-gray-600 space-y-2 list-decimal list-inside leading-relaxed">
                <li>Klik tombol di bawah untuk membuat <b>Token Koneksi</b>.</li>
                <li>Buka Telegram Bot Anda.</li>
                <li>Kirim pesan dengan format: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-gray-800">/start TOKEN_ANDA</code></li>
              </ol>
            </div>

            {conn?.connect_token && (
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 space-y-2">
                <p className="text-xs font-medium text-indigo-600">Token Koneksi Anda:</p>
                <div className="flex items-center justify-between gap-2 bg-white border border-indigo-200/80 rounded-lg p-2 px-3">
                  <code className="text-sm font-mono font-bold text-indigo-900 break-all">
                    /start {conn.connect_token}
                  </code>
                  <button
                    onClick={() => copyToClipboard(`/start ${conn.connect_token}`)}
                    className="text-xs text-indigo-600 font-medium hover:underline flex-shrink-0"
                  >
                    {copied ? 'Tersalin! ✓' : 'Salin'}
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={generateToken}
              disabled={generating}
              className="w-full bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition shadow-sm shadow-indigo-200"
            >
              {generating
                ? 'Memproses...'
                : conn?.connect_token
                ? 'Generate Token Baru'
                : 'Buat Token Koneksi'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
