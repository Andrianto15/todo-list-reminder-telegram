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
      className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-700 text-white w-14 h-14 rounded-full shadow-lg shadow-indigo-300/80 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
    >
      <Plus size={24} />
    </button>
  );
}

