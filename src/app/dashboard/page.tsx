'use client';

import { useState, useMemo } from 'react';
import { Task, TaskStatus } from '@/types';
import { format } from 'date-fns';
import { useTasks } from '@/hooks/useTasks';
import TaskStats from '@/components/tasks/TaskStats';
import Top3Highlight from '@/components/tasks/Top3Highlight';
import TaskGroup from '@/components/tasks/TaskGroup';
import TaskFilter from '@/components/tasks/TaskFilter';
import AddTaskModal from '@/components/tasks/AddTaskModal';
import EditTaskModal from '@/components/tasks/EditTaskModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import TaskSkeleton from '@/components/ui/TaskSkeleton';
import FAB from '@/components/ui/FAB';
import EmptyState from '@/components/ui/EmptyState';
import Navbar from '@/components/ui/Navbar';

export default function DashboardPage() {
  const { tasks, loading, addTask, updateStatus, editTask, deleteTask } = useTasks();

  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');

  // Filter tasks berdasarkan query pencarian dan tab status
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.notes && t.notes.toLowerCase().includes(search.toLowerCase()));
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [tasks, search, statusFilter]);

  // Hitung jumlah task per status untuk badge filter
  const filterCounts = useMemo(() => {
    const counts: Record<TaskStatus | 'all', number> = {
      all: tasks.length,
      to_do: 0,
      done: 0,
      hold: 0,
      cancel: 0,
    };
    tasks.forEach((t) => {
      if (counts[t.status] !== undefined) {
        counts[t.status]++;
      }
    });
    return counts;
  }, [tasks]);

  // Kelompokkan filtered tasks berdasarkan tanggal pengingat
  const grouped = useMemo(() => {
    return filteredTasks.reduce<Record<string, Task[]>>((acc, task) => {
      const day = format(new Date(task.reminder_date), 'yyyy-MM-dd');
      if (!acc[day]) acc[day] = [];
      acc[day].push(task);
      return acc;
    }, {});
  }, [filteredTasks]);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 transition-colors">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        {loading ? (
          <TaskSkeleton />
        ) : tasks.length === 0 ? (
          <EmptyState onAdd={() => setShowAdd(true)} />
        ) : (
          <>
            <TaskStats tasks={tasks} />
            <Top3Highlight tasks={tasks} />

            <TaskFilter
              search={search}
              onSearchChange={setSearch}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              counts={filterCounts}
            />

            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 text-xs text-gray-400 dark:text-slate-500">
                Tidak ada pengingat yang cocok dengan pencarian / filter.
              </div>
            ) : (
              Object.entries(grouped).map(([date, dayTasks]) => (
                <TaskGroup
                  key={date}
                  date={date}
                  tasks={dayTasks}
                  onEdit={setEditTarget}
                  onStatusChange={updateStatus}
                  onDelete={setDeleteTarget}
                />
              ))
            )}
          </>
        )}
      </div>


      <FAB onClick={() => setShowAdd(true)} />

      <AddTaskModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={addTask}
      />

      {editTarget && (
        <EditTaskModal
          task={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={async (data) => {
            await editTask(editTarget.id, data);
            setEditTarget(null);
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            deleteTask(deleteTarget.id);
            setDeleteTarget(null);
          }}
          title="Hapus Task"
          description={`Apakah Anda yakin ingin menghapus "${deleteTarget.title}"? Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Ya, Hapus"
          isDestructive={true}
        />
      )}
    </div>
  );
}


