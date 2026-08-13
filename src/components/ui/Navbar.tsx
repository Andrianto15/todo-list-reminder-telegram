'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { CheckSquare, Send, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function Navbar() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Berhasil keluar');
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
            <CheckSquare size={18} />
          </span>
          <span className="font-semibold text-sm text-gray-900 tracking-tight">
            Todo Reminder
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/settings/telegram"
            className={`text-xs font-medium px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              pathname === '/settings/telegram'
                ? 'bg-indigo-50 text-indigo-600 font-semibold'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Send size={14} className={pathname === '/settings/telegram' ? 'text-indigo-600' : 'text-gray-400'} />
            <span>Telegram</span>
          </Link>

          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-red-600 transition p-2 rounded-xl hover:bg-red-50 flex items-center gap-1"
            title="Keluar"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}

