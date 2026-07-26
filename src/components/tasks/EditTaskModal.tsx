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
          <label className="block text-xs font-medium text-gray-700 mb-1">Judul Task *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
          >
            <option value="to_do">To Do</option>
            <option value="hold">Hold (Ditunda)</option>
            <option value="done">Done (Selesai)</option>
            <option value="cancel">Cancel (Dibatalkan)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal & Waktu Pengingat *</label>
          <input
            type="datetime-local"
            required
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Catatan</label>
          <textarea
            placeholder="Tambah catatan detail..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !title.trim() || !reminderDate}
          className="w-full bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition shadow-sm shadow-indigo-200"
        >
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </Modal>
  );
}
