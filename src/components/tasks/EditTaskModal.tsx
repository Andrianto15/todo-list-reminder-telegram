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
          <label htmlFor="edit-task-title" className="block text-xs font-semibold text-[#0f172a] dark:text-[#f8fafc] mb-1.5">Judul Task *</label>
          <input
            id="edit-task-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-[#cbd5e1] dark:border-[#1e293b] rounded-lg px-3.5 py-2.5 text-sm text-[#0f172a] dark:text-[#f8fafc] bg-white dark:bg-[#0f172a] placeholder:text-[#64748b] dark:placeholder:text-[#94a3b8] outline-none focus:ring-2 focus:ring-[#4682b4] focus:border-[#4682b4] min-h-[44px]"
          />
        </div>

        <div>
          <label htmlFor="edit-task-status" className="block text-xs font-semibold text-[#0f172a] dark:text-[#f8fafc] mb-1.5">Status</label>
          <select
            id="edit-task-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="w-full border border-[#cbd5e1] dark:border-[#1e293b] rounded-lg px-3.5 py-2.5 text-sm text-[#0f172a] dark:text-[#f8fafc] outline-none focus:ring-2 focus:ring-[#4682b4] focus:border-[#4682b4] bg-white dark:bg-[#0f172a] min-h-[44px]"
          >
            <option value="to_do">To Do</option>
            <option value="hold">Hold (Ditunda)</option>
            <option value="done">Done (Selesai)</option>
            <option value="cancel">Cancel (Dibatalkan)</option>
          </select>
        </div>

        <div>
          <label htmlFor="edit-task-reminder" className="block text-xs font-semibold text-[#0f172a] dark:text-[#f8fafc] mb-1.5">Tanggal & Waktu Pengingat *</label>
          <input
            id="edit-task-reminder"
            type="datetime-local"
            required
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)}
            className="w-full border border-[#cbd5e1] dark:border-[#1e293b] rounded-lg px-3.5 py-2.5 text-sm text-[#0f172a] dark:text-[#f8fafc] bg-white dark:bg-[#0f172a] outline-none focus:ring-2 focus:ring-[#4682b4] focus:border-[#4682b4] min-h-[44px]"
          />
        </div>

        <div>
          <label htmlFor="edit-task-notes" className="block text-xs font-semibold text-[#0f172a] dark:text-[#f8fafc] mb-1.5">Catatan</label>
          <textarea
            id="edit-task-notes"
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
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </Modal>
  );
}
