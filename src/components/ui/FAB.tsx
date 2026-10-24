'use client';

import { Plus } from 'lucide-react';

interface Props {
  onClick: () => void;
}

export default function FAB({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label="Tambah Task Baru"
      className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-6 z-40 bg-[#4682b4] hover:bg-[#36648b] text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 min-h-[48px] min-w-[48px]"
    >
      <Plus size={24} />
    </button>
  );
}
