'use client';

import { ClipboardList, Plus } from 'lucide-react';

interface Props {
  onAdd: () => void;
}

export default function EmptyState({ onAdd }: Props) {
  return (
    <div className="text-center py-16 px-4 space-y-4">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm shadow-indigo-100">
        <ClipboardList size={30} />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-gray-900">Belum ada pengingat</h3>
        <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
          Buat tugas pertama Anda agar Telegram dapat mengingatkan Anda tepat waktu.
        </p>
      </div>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-sm shadow-indigo-200 transition hover:scale-105 active:scale-95"
      >
        <Plus size={16} />
        <span>Tambah Task Baru</span>
      </button>
    </div>
  );
}

