'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import packageJson from '../../../../package.json';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8fafc] dark:bg-[#090d16]">
      <div className="w-full max-w-sm space-y-5 bg-white dark:bg-[#0f172a] p-8 rounded-xl shadow-md border border-[#e2e8f0] dark:border-[#1e293b]">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-[#0f172a] dark:text-[#f8fafc]">Masuk</h1>
          <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">Kelola pengingat tugas harian Anda</p>
        </div>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200/70 dark:border-red-900/60 p-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-[#0f172a] dark:text-[#f8fafc] mb-1.5">Email</label>
            <input
              id="login-email"
              type="email"
              required
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#cbd5e1] dark:border-[#1e293b] rounded-lg px-3.5 py-2.5 text-sm text-[#0f172a] dark:text-[#f8fafc] bg-white dark:bg-[#0f172a] placeholder:text-[#64748b] dark:placeholder:text-[#94a3b8] outline-none focus:ring-2 focus:ring-[#4682b4] focus:border-[#4682b4] transition min-h-[44px]"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-semibold text-[#0f172a] dark:text-[#f8fafc] mb-1.5">Kata Sandi</label>
            <input
              id="login-password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#cbd5e1] dark:border-[#1e293b] rounded-lg px-3.5 py-2.5 text-sm text-[#0f172a] dark:text-[#f8fafc] bg-white dark:bg-[#0f172a] placeholder:text-[#64748b] dark:placeholder:text-[#94a3b8] outline-none focus:ring-2 focus:ring-[#4682b4] focus:border-[#4682b4] transition min-h-[44px]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4682b4] hover:bg-[#36648b] text-white rounded-lg py-2.5 text-sm font-semibold transition disabled:opacity-50 shadow-xs min-h-[44px]"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="text-center text-xs text-[#64748b] dark:text-[#94a3b8]">
          Belum punya akun?{' '}
          <Link href="/register" className="text-[#4682b4] dark:text-[#6ba3ce] font-semibold hover:underline">
            Daftar sekarang
          </Link>
        </p>

        <p className="text-center text-xs text-[#94a3b8] dark:text-[#64748b] pt-2 border-t border-[#e2e8f0] dark:border-[#1e293b]">
          v{packageJson.version}
        </p>
      </div>
    </div>
  );
}
