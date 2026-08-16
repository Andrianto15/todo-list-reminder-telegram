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
      className="fixed bottom-6 right-6 z-40 bg-[#0051c3] hover:bg-[#0041a8] text-white w-12 h-12 rounded-[5px] shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95"
    >
      <Plus size={22} />
    </button>
  );
}

