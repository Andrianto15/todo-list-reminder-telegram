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
          <label htmlFor="add-task-title" className="block text-xs font-semibold text-[#0f172a] dark:text-[#f8fafc] mb-1.5">Judul Task *</label>
          <input
            id="add-task-title"
            type="text"
            required
            placeholder="Contoh: Bayar Listrik..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-[#cbd5e1] dark:border-[#1e293b] rounded-lg px-3.5 py-2.5 text-sm text-[#0f172a] dark:text-[#f8fafc] bg-white dark:bg-[#0f172a] placeholder:text-[#64748b] dark:placeholder:text-[#94a3b8] outline-none focus:ring-2 focus:ring-[#4682b4] focus:border-[#4682b4] min-h-[44px]"
          />
        </div>

        <div>
          <label htmlFor="add-task-reminder" className="block text-xs font-semibold text-[#0f172a] dark:text-[#f8fafc] mb-1.5">Tanggal & Waktu Pengingat *</label>
          <input
            id="add-task-reminder"
            type="datetime-local"
            required
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)}
            className="w-full border border-[#cbd5e1] dark:border-[#1e293b] rounded-lg px-3.5 py-2.5 text-sm text-[#0f172a] dark:text-[#f8fafc] bg-white dark:bg-[#0f172a] outline-none focus:ring-2 focus:ring-[#4682b4] focus:border-[#4682b4] min-h-[44px]"
          />
        </div>

        <div>
          <label htmlFor="add-task-notes" className="block text-xs font-semibold text-[#0f172a] dark:text-[#f8fafc] mb-1.5">Catatan (opsional)</label>
          <textarea
            id="add-task-notes"
            placeholder="Tambah catatan detail..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full border border-[#cbd5e1] dark:border-[#1e293b] rounded-lg px-3.5 py-2.5 text-sm text-[#0f172a] dark:text-[#f8fafc] bg-white dark:bg-[#0f172a] placeholder:text-[#64748b] dark:placeholder:text-[#94a3b8] outline-none focus:ring-2 focus:ring-[#4682b4] focus:border-[#4682b4] resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !title.trim() || !reminderDate}
          className="w-full bg-[#4682b4] hover:bg-[#36648b] text-white rounded-lg py-2.5 text-sm font-semibold disabled:opacity-50 transition shadow-xs min-h-[44px]"
        >
          {loading ? 'Menyimpan...' : 'Simpan Task'}
        </button>
      </form>
    </Modal>
  );
}
