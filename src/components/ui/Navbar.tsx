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
    <nav className="bg-white dark:bg-[#0f172a] border-b border-[#e2e8f0] dark:border-[#1e293b] sticky top-0 z-30 transition-colors">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 group min-h-[44px]">
          <div className="w-8 h-8 rounded-lg overflow-hidden shadow-xs group-hover:opacity-90 transition-opacity flex items-center justify-center bg-[#eef5fa] dark:bg-[#18283d] border border-[#e2e8f0] dark:border-[#1e293b]">
            <Image
              src="/icons/logo.png"
              alt="Todo Reminder Logo"
              width={32}
              height={32}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <span className="font-semibold text-sm text-[#0f172a] dark:text-[#f8fafc] tracking-tight">
            Todo Reminder
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          <Link
            href="/settings/telegram"
            className={`text-xs font-medium px-3 py-2 min-h-[44px] rounded-lg transition flex items-center gap-1.5 ${
              pathname === '/settings/telegram'
                ? 'bg-[#eef5fa] dark:bg-[#18283d] text-[#4682b4] dark:text-[#6ba3ce] font-semibold'
                : 'text-[#64748b] dark:text-[#94a3b8] hover:bg-[#e2e8f0]/50 dark:hover:bg-[#1e293b]'
            }`}
          >
            <Send size={15} className={pathname === '/settings/telegram' ? 'text-[#4682b4] dark:text-[#6ba3ce]' : 'text-[#64748b] dark:text-[#94a3b8]'} />
            <span>Telegram</span>
          </Link>

          <button
            onClick={toggleTheme}
            className="text-[#64748b] dark:text-[#94a3b8] hover:text-[#4682b4] dark:hover:text-[#6ba3ce] transition p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-[#e2e8f0]/50 dark:hover:bg-[#1e293b]"
            title={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} className="text-amber-400" />}
          </button>

          <button
            onClick={handleLogout}
            className="text-[#64748b] dark:text-[#94a3b8] hover:text-red-600 dark:hover:text-red-400 transition p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40"
            title="Keluar"
            aria-label="Keluar"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}
