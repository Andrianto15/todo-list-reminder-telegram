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
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Send className="text-[#0051c3] dark:text-blue-400" size={20} />
          <h1 className="text-lg font-light text-[#404040] dark:text-slate-100">Integrasi Telegram</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-xs text-[#737373] dark:text-slate-400 gap-2">
            <Loader2 size={16} className="animate-spin text-[#0051c3] dark:text-blue-400" />
            <span>Memuat status koneksi...</span>
          </div>
        ) : conn?.is_connected ? (
          <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 rounded-[5px] p-5 space-y-2.5 shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">Telegram Terhubung</p>
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
              Notifikasi pengingat akan dikirimkan otomatis ke Telegram Chat ID:{' '}
              <code className="font-mono bg-emerald-100/90 dark:bg-emerald-900/60 px-2 py-0.5 rounded-[5px] text-emerald-900 dark:text-emerald-200 font-bold">
                {conn.telegram_chat_id}
              </code>
            </p>
          </div>
        ) : (
          <div className="space-y-5 bg-white dark:bg-slate-800 border border-[#ebebeb] dark:border-slate-700 p-6 rounded-[5px] shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#eef4fc] dark:bg-blue-950/60 text-[#0051c3] dark:text-blue-400 rounded-[5px]">
                <ShieldCheck size={20} />
              </div>
              <p className="text-xs text-[#737373] dark:text-slate-300 leading-relaxed">
                Hubungkan akun Telegram Anda untuk menerima pesan pengingat tugas harian secara otomatis.
              </p>
            </div>

            <div className="bg-[#ebebeb]/30 dark:bg-slate-800/60 border border-[#ebebeb] dark:border-slate-700 rounded-[5px] p-4 space-y-2.5">
              <p className="text-xs font-semibold text-[#404040] dark:text-slate-200 uppercase tracking-wider">Langkah-langkah:</p>
              <ol className="text-xs text-[#737373] dark:text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
                <li>Klik tombol di bawah untuk membuat <b>Token Koneksi</b>.</li>
                <li>Buka Telegram Bot Anda.</li>
                <li>Kirim pesan dengan format: <code className="bg-[#ebebeb] dark:bg-slate-700 px-1.5 py-0.5 rounded-[5px] font-mono text-[#404040] dark:text-slate-200">/start TOKEN_ANDA</code></li>
              </ol>
            </div>

            {conn?.connect_token && (
              <div className="bg-[#eef4fc] dark:bg-blue-950/40 border border-[#0051c3]/20 dark:border-blue-900/60 rounded-[5px] p-4 space-y-2">
                <p className="text-xs font-medium text-[#0051c3] dark:text-blue-400">Token Koneksi Anda:</p>
                <div className="flex items-center justify-between gap-2 bg-white dark:bg-slate-900 border border-[#ebebeb] dark:border-slate-700 rounded-[5px] p-2.5 px-3 shadow-xs">
                  <code className="text-xs font-mono font-bold text-[#0051c3] dark:text-blue-300 break-all">
                    /start {conn.connect_token}
                  </code>
                  <button
                    onClick={() => copyToClipboard(`/start ${conn.connect_token}`)}
                    className="text-xs text-[#0051c3] dark:text-blue-400 font-medium hover:text-[#0041a8] transition flex items-center gap-1 flex-shrink-0 bg-[#eef4fc] hover:bg-[#e0ecfb] dark:bg-blue-950 dark:hover:bg-blue-900 px-2.5 py-1 rounded-[5px]"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-emerald-600" />
                        <span className="text-emerald-600">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
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
              className="w-full bg-[#0051c3] hover:bg-[#0041a8] text-white rounded-[5px] py-2.5 text-[13px] font-medium disabled:opacity-50 transition shadow-xs flex items-center justify-center gap-2"
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

