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

---

## Ringkasan Perubahan: Sorting Descending, Load More Pagination (5 Data) & English Date Format - v0.2.6

### 1. Logic & Helper (`src/lib/taskHistory.ts`)

- Menambahkan helper:
  - `sortTasksDescending`: Mengurutkan daftar task dari tanggal terbaru ke terlama (`reminder_date` descending).
  - `paginateTasks`: Membatasi slice task sesuai jumlah `limit` aktif.
  - `groupTasksByDate`: Mengelompokkan task per hari dengan urutan descending.
  - `formatDateGroupHeader`: Memformat tanggal ke bahasa Inggris lengkap dengan tahun (`EEEE, d MMM yyyy`, contoh: `Monday, 3 Aug 2026` / `MONDAY, 3 AUG 2026`).

### 2. UI & Dashboard (`src/app/dashboard/page.tsx` & `src/components/tasks/TaskGroup.tsx`)

- Membatasi tampilan awal maksimal 5 task teratas.
- Menambahkan tombol aksi mobile-first **"Load More..."** di bawah list task jika ada data berikutnya (bertambah +5 per klik).
- Tombol otomatis disembunyikan ketika seluruh data sudah ditampilkan.
- Reset counter tampilan ke 5 setiap kali filter status atau pencarian diubah.
- Mengubah format header group tanggal menjadi format bahasa Inggris dan menyertakan tahun.

### 3. Server API (`src/app/api/tasks/route.ts`)

- Mengubah sorting query Supabase default menjadi `.order('reminder_date', { ascending: false })`.

### 4. Automated Testing (`tests/taskHistory.test.ts`)

- Menambahkan unit test Jest untuk verifikasi:
  - Sorting descending.
  - Slicing pagination / load more kelipatan 5.
  - Grouping task per tanggal descending.
  - Format header tanggal bahasa Inggris dengan tahun.

### 5. Dokumentasi (`docs/PRD.md`)

- Menambahkan item **FR-3.4 Task Sorting & Load More Pagination** serta memperbarui **FR-3.1 Grouping View**.

---

## Ringkasan Perubahan: Sinkronisasi README.md & Info Vibe Coding

### 1. Dokumentasi (`README.md`)
- Menambahkan informasi identitas bahwa aplikasi dibangun dengan pendekatan **Vibe Coding**.
- Memusatkan rincian spesifikasi kebutuhan fungsional dan aturan bisnis ke `docs/PRD.md` untuk menghindari duplikasi data.
- Memperbarui daftar Tech Stack terkini (Next.js 16, React 19, Tailwind CSS v4, Lucide React, Framer Motion, Sonner, Jest, ts-jest).
- Memperbarui diagram struktur direktori proyek sesuai pohon file aktual (termasuk folder `hooks/`, `tests/`, `changelogs/`).
- Memperbarui tabel perintah CLI dengan menambahkan script `npm test`.
- Memperbaiki path referensi dokumentasi implementasi.

---

## Ringkasan Perubahan: Filter Pengingat Telegram Hanya Status 'to_do' (v0.2.8)

### 1. Endpoint & Cron Logic (`src/app/api/remind/route.ts`)
- Memperbarui query Supabase pada endpoint pengingat dari `.in('status', ['to_do', 'hold'])` menjadi `.eq('status', 'to_do')`.
- Task dengan status `hold`, `done`, atau `cancel` tidak akan memicu notifikasi Telegram.

### 2. Logic & Helper (`src/lib/telegram/reminder.ts`)
- Menambahkan fungsi helper `isTaskEligibleForReminder(status: TaskStatus): boolean` yang mengembalikan `true` khusus untuk status `to_do`.

### 3. Automated Testing (`tests/reminder.test.ts`)
- Menambahkan unit test Jest untuk `isTaskEligibleForReminder` yang menguji status `to_do` (true) serta `hold`, `done`, dan `cancel` (false).

### 4. Dokumentasi (`docs/PRD.md`, `docs/summaries.md`, `docs/TASKS.md`)
- Memperbarui bagian *Persistent Reminder Logic* dan *Cron Query* di `docs/PRD.md` serta dokumen terkait agar konsisten dengan filter status `to_do`.

---

## Ringkasan Perubahan: Notifikasi Telegram UTC+7 & Inline Keyboard Status (Done, Hold, Cancel)

### 1. Telegram Message Formatting (`src/lib/telegram/reminder.ts`)
- Menambahkan fungsi helper `formatReminderDate(dateStr: string): string` menggunakan standard `Intl.DateTimeFormat` dengan zona waktu `Asia/Jakarta` (UTC+7 / WIB) dan format `EEEE, d MMMM yyyy · HH:mm`.
- Memperbarui `formatReminderMessage` untuk menampilkan waktu reminder dalam zona waktu UTC+7.
- Memperbarui `getReminderInlineKeyboard` untuk menyertakan 3 tombol aksi:
  - `✅ Done` (`callback_data: done:<taskId>`)
  - `⏸️ Hold` (`callback_data: hold:<taskId>`)
  - `❌ Cancel` (`callback_data: cancel:<taskId>`)

### 2. Telegram Webhook Callback Handler (`src/app/api/webhook/telegram/route.ts`)
- Memperluas callback handler untuk menangani query callback `done:`, `hold:`, dan `cancel:`.
- Mengubah status task di database Supabase sesuai tombol yang diklik (`done`, `hold`, atau `cancel`) dan mematikan pengingat berikutnya (`next_remind_at = null`).
- Memberikan feedback callback toast dan mengupdate pesan asli Telegram dengan indikator status akhir (`✅ SUDAH SELESAI`, `⏸️ STATUS: HOLD`, atau `❌ DIBATALKAN`).

### 3. Automated Testing (`tests/reminder.test.ts`)
- Menambahkan unit test untuk konversi waktu UTC ISO ke WIB / UTC+7 (`formatReminderDate`).
- Memperbarui test `formatReminderMessage` untuk memastikan format UTC+7.
- Memperbarui test `getReminderInlineKeyboard` untuk memvalidasi struktur 3 tombol (`Done`, `Hold`, `Cancel`).

### 4. Dokumentasi (`docs/PRD.md`)
- Memperbarui versi PRD menjadi v3.2.
- Memperbarui item spesifikasi **FR-4.4** (Format waktu UTC+7), **FR-4.5** (Inline keyboard Done, Hold, Cancel), dan **FR-4.6** (Webhook status handling).



