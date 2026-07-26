'use client';

import { useEffect, useState, useCallback } from 'react';
import { Task } from '@/types';
import { format } from 'date-fns';
import Top3Highlight from '@/components/tasks/Top3Highlight';
import TaskGroup from '@/components/tasks/TaskGroup';
import AddTaskModal from '@/components/tasks/AddTaskModal';
import EditTaskModal from '@/components/tasks/EditTaskModal';
import FAB from '@/components/ui/FAB';
import EmptyState from '@/components/ui/EmptyState';
import Navbar from '@/components/ui/Navbar';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Kelompokkan tasks berdasarkan tanggal pengingat
  const grouped = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    const day = format(new Date(task.reminder_date), 'yyyy-MM-dd');
    if (!acc[day]) acc[day] = [];
    acc[day].push(task);
    return acc;
  }, {});

  const handleAdd = async (data: { title: string; notes?: string; reminder_date: string }) => {
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    fetchTasks();
  };

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-sm text-gray-400 gap-2">
            <span className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
            <span>Memuat pengingat...</span>
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState onAdd={() => setShowAdd(true)} />
        ) : (
          <>
            <Top3Highlight tasks={tasks} />
            {Object.entries(grouped).map(([date, dayTasks]) => (
              <TaskGroup
                key={date}
                date={date}
                tasks={dayTasks}
                onEdit={setEditTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </>
        )}
      </div>

      <FAB onClick={() => setShowAdd(true)} />
      <AddTaskModal open={showAdd} onClose={() => setShowAdd(false)} onAdd={handleAdd} />
      {editTask && (
        <EditTaskModal
          task={editTask}
          onClose={() => setEditTask(null)}
          onSave={async (data) => {
            await fetch(`/api/tasks/${editTask.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
            fetchTasks();
            setEditTask(null);
          }}
        />
      )}
    </div>
  );
}
