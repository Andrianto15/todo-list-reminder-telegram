'use client';

import { ClipboardList, Plus } from 'lucide-react';

interface Props {
  onAdd: () => void;
}

export default function EmptyState({ onAdd }: Props) {
  return (
    <div className="text-center py-16 px-4 space-y-4">
      <div className="w-14 h-14 bg-[#eef5fa] dark:bg-[#18283d] text-[#4682b4] dark:text-[#6ba3ce] rounded-xl flex items-center justify-center mx-auto border border-border">
        <ClipboardList size={26} />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">Belum ada pengingat</h3>
        <p className="text-sm text-muted max-w-xs mx-auto leading-relaxed">
          Buat tugas pertama Anda agar Telegram dapat mengingatkan Anda tepat waktu.
        </p>
      </div>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-1.5 bg-[#4682b4] hover:bg-[#36648b] text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-xs transition hover:scale-102 active:scale-98 min-h-[44px]"
      >
        <Plus size={16} />
        <span>Tambah Task Baru</span>
      </button>
    </div>
  );
}
