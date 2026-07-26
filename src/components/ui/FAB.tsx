'use client';

interface Props {
  onClick: () => void;
}

export default function FAB({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label="Tambah Task"
      className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-700 text-white w-14 h-14 rounded-full shadow-lg shadow-indigo-300 flex items-center justify-center text-2xl font-light transition-transform hover:scale-105 active:scale-95"
    >
      +
    </button>
  );
}
