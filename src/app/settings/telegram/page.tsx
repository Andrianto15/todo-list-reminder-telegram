'use client';

import { useState } from 'react';
import { useTelegram } from '@/hooks/useTelegram';
import Navbar from '@/components/ui/Navbar';
import { CheckCircle2, Copy, Check, Loader2, Send, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function TelegramSettingsPage() {
  const { conn, loading, generating, generateToken } = useTelegram();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Command /start berhasil disalin ke clipboard! 📋');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background transition-colors">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Send className="text-primary dark:text-[#6ba3ce]" size={22} />
          <h1 className="text-xl font-bold text-foreground">Integrasi Telegram</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-sm text-muted gap-2">
            <Loader2 size={18} className="animate-spin text-primary dark:text-[#6ba3ce]" />
            <span>Memuat status koneksi...</span>
          </div>
        ) : conn?.is_connected ? (
          <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl p-5 space-y-2.5 shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
              <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">Telegram Terhubung</p>
            </div>
            <p className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">
              Notifikasi pengingat akan dikirimkan otomatis ke Telegram Chat ID:{' '}
              <code className="font-mono bg-emerald-100/90 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md text-emerald-900 dark:text-emerald-200 font-bold">
                {conn.telegram_chat_id}
              </code>
            </p>
          </div>
        ) : (
          <div className="space-y-5 bg-surface border border-border p-6 rounded-xl shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-[#eef5fa] dark:bg-[#18283d] text-primary dark:text-[#6ba3ce] rounded-xl shrink-0">
                <ShieldCheck size={22} />
              </div>
              <p className="text-sm text-muted leading-relaxed">
                Hubungkan akun Telegram Anda untuk menerima pesan pengingat tugas harian secara otomatis.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/40 border border-border rounded-xl p-4 space-y-2.5">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Langkah-langkah:</p>
              <ol className="text-sm text-muted space-y-2 list-decimal list-inside leading-relaxed">
                <li>Klik tombol di bawah untuk membuat <b>Token Koneksi</b>.</li>
                <li>Buka Telegram Bot Anda.</li>
                <li>Kirim pesan dengan format: <code className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded-md font-mono text-foreground">/start TOKEN_ANDA</code></li>
              </ol>
            </div>

            {conn?.connect_token && (
              <div className="bg-[#eef5fa] dark:bg-[#18283d] border border-primary/30 dark:border-border rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-primary dark:text-[#6ba3ce]">Token Koneksi Anda:</p>
                <div className="flex items-center justify-between gap-2 bg-surface border border-border rounded-lg p-2 px-3 shadow-xs">
                  <code className="text-xs font-mono font-bold text-[#4682b4] dark:text-[#6ba3ce] break-all">
                    /start {conn.connect_token}
                  </code>
                  <button
                    onClick={() => copyToClipboard(`/start ${conn.connect_token}`)}
                    className="text-xs text-[#4682b4] dark:text-[#6ba3ce] font-semibold hover:text-[#36648b] transition flex items-center gap-1 shrink-0 bg-[#eef5fa] hover:bg-[#e0edf7] dark:bg-[#18283d] dark:hover:bg-[#203652] px-3 py-2 min-h-[44px] rounded-lg"
                    aria-label="Salin token"
                  >
                    {copied ? (
                      <>
                        <Check size={15} className="text-emerald-600" />
                        <span className="text-emerald-600">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy size={15} />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={generateToken}
              disabled={generating}
              className="w-full bg-[#4682b4] hover:bg-[#36648b] text-white rounded-lg py-2.5 text-sm font-semibold disabled:opacity-50 transition shadow-xs flex items-center justify-center gap-2 min-h-[44px]"
            >
              {generating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : conn?.connect_token ? (
                'Generate Token Baru'
              ) : (
                'Buat Token Koneksi'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
