'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { CheckSquare, Send, LogOut, Sun, Moon } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/useTheme';

export default function Navbar() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Berhasil keluar');
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 sticky top-0 z-30 transition-colors">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shadow-sm shadow-indigo-200 dark:shadow-none group-hover:scale-105 transition-transform">
            <CheckSquare size={18} />
          </span>
          <span className="font-semibold text-sm text-gray-900 dark:text-slate-100 tracking-tight">
            Todo Reminder
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          <Link
            href="/settings/telegram"
            className={`text-xs font-medium px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              pathname === '/settings/telegram'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
            }`}
          >
            <Send size={14} className={pathname === '/settings/telegram' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-slate-400'} />
            <span>Telegram</span>
          </Link>

          <button
            onClick={toggleTheme}
            className="text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800"
            title={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} className="text-amber-400" />}
          </button>

          <button
            onClick={handleLogout}
            className="text-gray-400 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40"
            title="Keluar"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}


