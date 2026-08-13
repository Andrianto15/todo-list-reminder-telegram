import { useState, useCallback, useEffect } from 'react';
import { Task, TaskStatus } from '@/types';
import { toast } from 'sonner';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      } else {
        toast.error('Gagal mengambil daftar pengingat');
      }
    } catch {
      toast.error('Koneksi terputus. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Optimistic Add Task
  const addTask = async (data: { title: string; notes?: string; reminder_date: string }) => {
    const tempId = `temp-${Date.now()}`;
    const tempTask: Task = {
      id: tempId,
      user_id: 'temp',
      title: data.title,
      notes: data.notes || null,
      status: 'to_do',
      reminder_date: data.reminder_date,
      next_remind_at: data.reminder_date,
      reminder_count: 0,
      last_reminded_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTasks((prev) => [tempTask, ...prev]);
    toast.success('Task baru ditambahkan');

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to create task');
      }
      fetchTasks();
    } catch {
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      toast.error('Gagal menyimpan task ke server');
    }
  };

  // Optimistic Update Status
  const updateStatus = async (taskId: string, newStatus: TaskStatus) => {
    const previousTasks = [...tasks];

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    if (newStatus === 'done') {
      toast.success('Task diselesaikan! 🎉');
    } else {
      toast.info('Status task diperbarui');
    }

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }
    } catch {
      setTasks(previousTasks);
      toast.error('Gagal memperbarui status task');
    }
  };

  // Optimistic Edit Task
  const editTask = async (taskId: string, data: Partial<Task>) => {
    const previousTasks = [...tasks];

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...data } : t))
    );
    toast.success('Perubahan task disimpan!');

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to edit task');
      }
      fetchTasks();
    } catch {
      setTasks(previousTasks);
      toast.error('Gagal mengedit task');
    }
  };


  // Optimistic Delete Task
  const deleteTask = async (taskId: string) => {
    const previousTasks = [...tasks];

    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    toast.success('Task dihapus');

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete task');
      }
    } catch {
      setTasks(previousTasks);
      toast.error('Gagal menghapus task dari server');
    }
  };

  return {
    tasks,
    loading,
    fetchTasks,
    addTask,
    updateStatus,
    editTask,
    deleteTask,
  };
}
