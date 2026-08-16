'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Send, LogOut, Sun, Moon } from 'lucide-react';
import Image from 'next/image';
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
    <nav className="bg-white dark:bg-slate-900 border-b border-[#ebebeb] dark:border-slate-800 sticky top-0 z-30 transition-colors">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-[5px] overflow-hidden shadow-xs group-hover:opacity-90 transition-opacity flex items-center justify-center bg-[#eef4fc] dark:bg-slate-800 border border-[#ebebeb] dark:border-slate-700">
            <Image
              src="/icons/logo.png"
              alt="Todo Reminder Logo"
              width={32}
              height={32}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <span className="font-semibold text-[13px] text-[#404040] dark:text-slate-100 tracking-tight">
            Todo Reminder
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          <Link
            href="/settings/telegram"
            className={`text-xs font-medium px-3 py-1.5 rounded-[5px] transition flex items-center gap-1.5 ${
              pathname === '/settings/telegram'
                ? 'bg-[#eef4fc] dark:bg-blue-950/60 text-[#0051c3] dark:text-blue-400 font-semibold'
                : 'text-[#404040] dark:text-slate-300 hover:bg-[#ebebeb]/50 dark:hover:bg-slate-800'
            }`}
          >
            <Send size={14} className={pathname === '/settings/telegram' ? 'text-[#0051c3] dark:text-blue-400' : 'text-[#737373] dark:text-slate-400'} />
            <span>Telegram</span>
          </Link>

          <button
            onClick={toggleTheme}
            className="text-[#737373] dark:text-slate-400 hover:text-[#0051c3] dark:hover:text-blue-400 transition p-2 rounded-[5px] hover:bg-[#ebebeb]/50 dark:hover:bg-slate-800"
            title={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} className="text-amber-400" />}
          </button>

          <button
            onClick={handleLogout}
            className="text-[#737373] dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition p-2 rounded-[5px] hover:bg-red-50 dark:hover:bg-red-950/40"
            title="Keluar"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}


