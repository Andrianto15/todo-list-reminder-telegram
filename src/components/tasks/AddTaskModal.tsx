/**
 * Nama File    : AddTaskModal.tsx
 * Deskripsi    : Komponen modal untuk menambahkan task baru
 * Dibuat oleh  : Tim Pengembang
 * Tanggal      : 2026-08-01
 */

'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (data: { title: string; notes?: string; reminder_date: string }) => Promise<void>;
}

export default function AddTaskModal({ open, onClose, onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !reminderDate) return;
    setLoading(true);
    await onAdd({
      title: title.trim(),
      notes: notes || undefined,
      reminder_date: new Date(reminderDate).toISOString(),
    });
    setTitle('');
    setNotes('');
    setReminderDate('');
    setLoading(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Tambah Task Baru">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-normal text-[#404040] dark:text-slate-300 mb-1">Judul Task *</label>
          <input
            type="text"
            required
            placeholder="Contoh: Bayar Listrik..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-[#ebebeb] dark:border-slate-700 rounded-[5px] px-3 py-2 text-[13px] text-[#404040] dark:text-slate-100 bg-white dark:bg-slate-900 placeholder:text-[#a3a3a3] dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-[#0051c3]/20 focus:border-[#0051c3]"
          />
        </div>

        <div>
          <label className="block text-xs font-normal text-[#404040] dark:text-slate-300 mb-1">Tanggal & Waktu Pengingat *</label>
          <input
            type="datetime-local"
            required
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)}
            className="w-full border border-[#ebebeb] dark:border-slate-700 rounded-[5px] px-3 py-2 text-[13px] text-[#404040] dark:text-slate-100 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-[#0051c3]/20 focus:border-[#0051c3]"
          />
        </div>

        <div>
          <label className="block text-xs font-normal text-[#404040] dark:text-slate-300 mb-1">Catatan (opsional)</label>
          <textarea
            placeholder="Tambah catatan detail..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full border border-[#ebebeb] dark:border-slate-700 rounded-[5px] px-3 py-2 text-[13px] text-[#404040] dark:text-slate-100 bg-white dark:bg-slate-900 placeholder:text-[#a3a3a3] dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-[#0051c3]/20 focus:border-[#0051c3] resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !title.trim() || !reminderDate}
          className="w-full bg-[#0051c3] hover:bg-[#0041a8] text-white rounded-[5px] py-2 text-[13px] font-medium disabled:opacity-50 transition shadow-xs"
        >
          {loading ? 'Menyimpan...' : 'Simpan Task'}
        </button>
      </form>
    </Modal>
  );
}
