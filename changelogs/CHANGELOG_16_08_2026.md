## 16/08/2026 - v0.2.3

- **Refactor Reminder Interval & Limit**:
  - Ubah interval pengingat persisten menjadi tetap setiap 1 jam (menghapus fase 4x 15 menit).
  - Batasi batas waktu pengingat maksimal 6 jam atau maksimal 6 kali pengiriman.
- **Testing**:
  - Konfigurasi Jest dan `ts-jest` untuk automated testing.
  - Tambah unit test untuk helper telegram reminder di `tests/reminder.test.ts`.
- **Documentation**:
  - Update `docs/PRD.md` (FR-4.3 & Catatan Teknis) menyesuaikan aturan interval 1 jam dan batas maksimal 6 jam/6x pengingat.

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

---

## Ringkasan Perubahan: Update Logo Aplikasi (Favicon, PWA Icon, Navbar) - v0.2.5

### 1. Visual Assets & Branding

- Memproses gambar maskot jam alarm pengguna menjadi aset resmi aplikasi:
  - `public/icons/icon-512x512.png` (PWA 512x512)
  - `public/icons/icon-192x192.png` (PWA 192x192)
  - `public/icons/logo.png` (UI Logo)
  - `src/app/favicon.ico` & `public/favicon.ico` (Multi-resolution Favicon ICO: 16x16, 32x32, 64x64)

### 2. UI Component (`src/components/ui/Navbar.tsx`)

- Mengganti generic icon `<CheckSquare />` dengan komponen Next.js `<Image />` menampilkan logo maskot.
- Desain mobile-first dengan kontainer rounded, bayangan halus, dan hover scale micro-animation.

### 3. Automated Testing (`tests/assets.test.ts`)

- Menambahkan test suite pengujian integritas file aset ikon PWA, Favicon, serta validasi `public/manifest.json`.

### 4. Dokumentasi (`docs/PRD.md`)

- Update versi dokumen menjadi v3.1 dan menambahkan item **FR-1.3 App Branding & Assets**.
