# Changelog - 16/08/2026 (v0.2.4)

## Ringkasan Perubahan: Filter Summary Tugas & Badge Total Done

### 1. Logic & Helper (`src/lib/taskStats.ts`)
- Menambahkan fungsi `filterSummaryTasks`:
  - Menyaring task terjadwal tepat **hari ini** (apapun statusnya).
  - Menyaring task **hari sebelum/sesudahnya** hanya jika status belum selesai (`status !== 'done'`).
  - Mengabaikan task selesai (`done`) dari luar hari ini pada progress bar harian.
- Menambahkan fungsi `calculateTaskStats`:
  - Menghitung `activeSummaryTotal`, `activeDoneCount`, `activePendingCount`, `percentage`.
  - Menghitung `totalAllDoneCount` dan `totalAllTasksCount` dari seluruh data task.

### 2. UI Component (`src/components/tasks/TaskStats.tsx`)
- Mengintegrasikan hasil kalkulasi `calculateTaskStats`.
- Menambahkan section/badge terpisah di bagian bawah kartu progres:
  - Menampilkan icon piala dan badge khusus `totalAllDoneCount` task done.
  - Memastikan desain mobile-first responsif dan ramah layar kecil.

### 3. Automated Testing (`tests/taskStats.test.ts`)
- Menambahkan unit test Jest mencakup skenario:
  - Task kosong.
  - Task hari ini (campuran done & to_do).
  - Task hari sebelumnya (done diabaikan, to_do disertakan).
  - Task hari sesudahnya (done diabaikan, hold disertakan).
  - Kasus multi-hari dan kalkulasi persentase akurat.

### 4. Dokumentasi (`docs/PRD.md`)
- Menambahkan item **FR-3.3 Task Summary & Progress Calculation** pada Dashboard View.
