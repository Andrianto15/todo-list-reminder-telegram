'use client';

import { ClipboardList, Plus } from 'lucide-react';

interface Props {
  onAdd: () => void;
}

export default function EmptyState({ onAdd }: Props) {
  return (
    <div className="text-center py-16 px-4 space-y-4">
      <div className="w-14 h-14 bg-[#eef4fc] dark:bg-blue-950/60 text-[#0051c3] dark:text-blue-400 rounded-[5px] flex items-center justify-center mx-auto border border-[#ebebeb] dark:border-slate-800">
        <ClipboardList size={26} />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-[#404040] dark:text-slate-100">Belum ada pengingat</h3>
        <p className="text-xs text-[#737373] dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
          Buat tugas pertama Anda agar Telegram dapat mengingatkan Anda tepat waktu.
        </p>
      </div>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-1.5 bg-[#0051c3] hover:bg-[#0041a8] text-white text-xs font-medium px-4 py-2.5 rounded-[5px] shadow-xs transition hover:scale-102 active:scale-98"
      >
        <Plus size={16} />
        <span>Tambah Task Baru</span>
      </button>
    </div>
  );
}


