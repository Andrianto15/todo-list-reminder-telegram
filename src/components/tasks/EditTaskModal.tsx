/**
 * Nama File    : EditTaskModal.tsx
 * Deskripsi    : Komponen modal untuk mengedit task yang sudah ada
 * Dibuat oleh  : Tim Pengembang
 * Tanggal      : 2026-08-01
 */

'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { Task, TaskStatus } from '@/types';
import { format } from 'date-fns';

interface Props {
  task: Task;
  onClose: () => void;
  onSave: (data: Partial<Task>) => Promise<void>;
}

export default function EditTaskModal({ task, onClose, onSave }: Props) {
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes || '');
  const [status, setStatus] = useState<TaskStatus>(task.status);

  // Format ke YYYY-MM-DDTHH:mm untuk datetime-local input
  const initialDate = task.reminder_date
    ? format(new Date(task.reminder_date), "yyyy-MM-dd'T'HH:mm")
    : '';

  const [reminderDate, setReminderDate] = useState(initialDate);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !reminderDate) return;
    setLoading(true);

    const updatePayload: Partial<Task> = {
      title: title.trim(),
      notes: notes || null,
      status,
    };

    const newIsoDate = new Date(reminderDate).toISOString();
    if (newIsoDate !== task.reminder_date) {
      updatePayload.reminder_date = newIsoDate;
    }

    await onSave(updatePayload);
    setLoading(false);
    onClose();
  };

  return (
    <Modal open={true} onClose={onClose} title="Edit Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-normal text-[#404040] dark:text-slate-300 mb-1">Judul Task *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-[#ebebeb] dark:border-slate-700 rounded-[5px] px-3 py-2 text-[13px] text-[#404040] dark:text-slate-100 bg-white dark:bg-slate-900 placeholder:text-[#a3a3a3] dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-[#0051c3]/20 focus:border-[#0051c3]"
          />
        </div>

        <div>
          <label className="block text-xs font-normal text-[#404040] dark:text-slate-300 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="w-full border border-[#ebebeb] dark:border-slate-700 rounded-[5px] px-3 py-2 text-[13px] text-[#404040] dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#0051c3]/20 focus:border-[#0051c3] bg-white dark:bg-slate-900"
          >
            <option value="to_do">To Do</option>
            <option value="hold">Hold (Ditunda)</option>
            <option value="done">Done (Selesai)</option>
            <option value="cancel">Cancel (Dibatalkan)</option>
          </select>
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
          <label className="block text-xs font-normal text-[#404040] dark:text-slate-300 mb-1">Catatan</label>
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
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </Modal>
  );
}
