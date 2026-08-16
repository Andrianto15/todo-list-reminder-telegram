'use client';

import { useState, useMemo } from 'react';
import { Task, TaskStatus } from '@/types';
import { useTasks } from '@/hooks/useTasks';
import {
  sortTasksDescending,
  paginateTasks,
  groupTasksByDate,
} from '@/lib/taskHistory';
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
import { ChevronDown } from 'lucide-react';

const PAGE_SIZE = 5;

export default function DashboardPage() {
  const { tasks, loading, addTask, updateStatus, editTask, deleteTask } = useTasks();

  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setVisibleCount(PAGE_SIZE);
  };

  const handleStatusFilterChange = (value: TaskStatus | 'all') => {
    setStatusFilter(value);
    setVisibleCount(PAGE_SIZE);
  };

  // Filter tasks berdasarkan query pencarian dan tab status, lalu urutkan descending (terbaru ke terlama)
  const filteredTasks = useMemo(() => {
    const filtered = tasks.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.notes && t.notes.toLowerCase().includes(search.toLowerCase()));
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
    return sortTasksDescending(filtered);
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

  // Potong task sesuai limit pagination
  const displayedTasks = useMemo(() => {
    return paginateTasks(filteredTasks, visibleCount);
  }, [filteredTasks, visibleCount]);

  // Kelompokkan displayed tasks berdasarkan tanggal pengingat (descending)
  const grouped = useMemo(() => {
    return groupTasksByDate(displayedTasks);
  }, [displayedTasks]);

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
              onSearchChange={handleSearchChange}
              statusFilter={statusFilter}
              onStatusFilterChange={handleStatusFilterChange}
              counts={filterCounts}
            />

            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 text-xs text-gray-400 dark:text-slate-500">
                Tidak ada pengingat yang cocok dengan pencarian / filter.
              </div>
            ) : (
              <>
                {Object.entries(grouped).map(([date, dayTasks]) => (
                  <TaskGroup
                    key={date}
                    date={date}
                    tasks={dayTasks}
                    onEdit={setEditTarget}
                    onStatusChange={updateStatus}
                    onDelete={setDeleteTarget}
                  />
                ))}

                {visibleCount < filteredTasks.length && (
                  <div className="mt-2 mb-4 flex justify-center">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                      className="w-full py-3 px-4 rounded-2xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 hover:bg-indigo-100/80 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 border border-indigo-100 dark:border-indigo-900/60 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99]"
                    >
                      <span>Load More...</span>
                      <ChevronDown size={14} />
                    </button>
                  </div>
                )}
              </>
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


