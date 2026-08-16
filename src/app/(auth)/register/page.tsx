/**
 * Nama File    : page.tsx
 * Deskripsi    : Halaman registrasi akun pengguna baru dengan input Nama Lengkap, Email, dan Password
 * Dibuat oleh  : Tim Pengembang
 * Tanggal      : 2026-08-01
 */

'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Jika email sudah terdaftar di Supabase dengan email confirmation aktif
    if (data?.user && data.user.identities && data.user.identities.length === 0) {
      setError('Email ini sudah terdaftar. Silakan masuk dengan akun Anda.');
      setLoading(false);
      return;
    }

    if (data?.session) {
      // Sesi langsung dibuat (auto-confirm aktif)
      router.push('/dashboard');
      router.refresh();
    } else {
      // Email confirmation aktif di Supabase
      setSuccess('Registrasi berhasil! Silakan periksa email Anda untuk verifikasi akun, lalu masuk di halaman login.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-slate-900">
      <div className="w-full max-w-sm space-y-5 bg-white dark:bg-slate-800 p-8 rounded-[5px] shadow-sm border border-[#ebebeb] dark:border-slate-700">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-light tracking-tight text-[#404040] dark:text-slate-100">Buat Akun</h1>
          <p className="text-xs text-[#737373] dark:text-slate-400">Mulai catat dan dapatkan pengingat tugas</p>
        </div>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200/70 p-3 rounded-[5px]">
            {error}
          </div>
        )}

        {success && (
          <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/70 p-3 rounded-[5px]">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-normal text-[#404040] dark:text-slate-300 mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              placeholder="Nama Anda"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-[#ebebeb] dark:border-slate-700 rounded-[5px] px-3.5 py-2 text-[13px] text-[#404040] dark:text-slate-100 bg-white dark:bg-slate-900 placeholder:text-[#a3a3a3] outline-none focus:ring-2 focus:ring-[#0051c3]/20 focus:border-[#0051c3] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-normal text-[#404040] dark:text-slate-300 mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#ebebeb] dark:border-slate-700 rounded-[5px] px-3.5 py-2 text-[13px] text-[#404040] dark:text-slate-100 bg-white dark:bg-slate-900 placeholder:text-[#a3a3a3] outline-none focus:ring-2 focus:ring-[#0051c3]/20 focus:border-[#0051c3] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-normal text-[#404040] dark:text-slate-300 mb-1">Kata Sandi</label>
            <input
              type="password"
              required
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#ebebeb] dark:border-slate-700 rounded-[5px] px-3.5 py-2 text-[13px] text-[#404040] dark:text-slate-100 bg-white dark:bg-slate-900 placeholder:text-[#a3a3a3] outline-none focus:ring-2 focus:ring-[#0051c3]/20 focus:border-[#0051c3] transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0051c3] hover:bg-[#0041a8] text-white rounded-[5px] py-2.5 text-[13px] font-medium transition disabled:opacity-50 shadow-xs"
          >
            {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
          </button>
        </form>

        <p className="text-center text-xs text-[#737373] dark:text-slate-400">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-[#0051c3] dark:text-blue-400 font-semibold hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
