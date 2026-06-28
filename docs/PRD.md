# Product Requirements Document (PRD)

## Project: To-Do Reminder PWA with Telegram Integration
* **Status:** Ready for Development
* **Version:** 3.0
* **Date:** Juni 2026
* **Author:** Project Owner
* **Changelog:**
  * v1.0 — Draft awal
  * v2.0 — Tambah auth, soft delete, persistent reminder, pisah tabel `telegram_connections`
  * v3.0 — Tambah detail API routes, struktur folder, flow koneksi Telegram, catatan teknis deployment

---

## 1. Executive Summary & Objective

### 1.1 Background
Banyak pengguna membutuhkan aplikasi pengingat tugas yang ringan, cepat diakses, dan tidak membebani memori perangkat. Mengintegrasikan aplikasi to-do dengan Telegram sebagai media pengingat interaktif akan meningkatkan retensi pengguna dan kecepatan penyelesaian tugas langsung dari ruang obrolan.

### 1.2 Objective
Membangun aplikasi **To-Do Reminder** berbasis **Progressive Web App (PWA)** multi-user yang minimalis, memiliki fitur manajemen tugas harian yang efisien, serta terintegrasi dua arah dengan Telegram Bot untuk sistem notifikasi **persistent** dan pembaruan status instan.

---

## 2. Target User & Persona

* **Target User:** Profesional, developer, pelajar, atau individu mandiri yang aktif menggunakan Telegram dan membutuhkan sistem manajemen tugas harian yang praktis.
* **Karakteristik Pengguna:**
  * Menyukai aplikasi bersih, minimalis, dan cepat dibuka di mobile.
  * Sering melewatkan notifikasi biasa, tetapi sangat responsif terhadap pesan Telegram.
  * Membutuhkan visualisasi tugas yang teratur per hari.

---

## 3. Tech Stack Architecture

| Layer | Teknologi |
| :--- | :--- |
| **Frontend** | Next.js 14+ (App Router, TypeScript) + Tailwind CSS |
| **PWA Engine** | `@ducanh2912/next-pwa` + Web App Manifest |
| **Backend & Database** | Supabase (PostgreSQL) + Supabase Edge Functions (Deno/TypeScript) |
| **Auth** | Supabase Auth — Email/Password + Google OAuth |
| **Bot Integration** | Telegram Bot API via `grammY` |
| **Cron Job** | Upstash Workflow (interval 1–5 menit) |
| **Hosting** | Vercel (Frontend & API) + Supabase Cloud |

---

## 4. Functional Requirements

### 4.1 Authentication & User Management
* **FR-0.1:** User dapat register dan login via Email/Password atau Google OAuth.
* **FR-0.2:** Setiap user hanya dapat mengakses data miliknya sendiri (multi-user isolation via RLS).
* **FR-0.3:** Penghapusan akun menggunakan **soft delete**: set `is_active = false` dan `deactivated_at`, data tidak dihapus permanen.

### 4.2 PWA Core Capability
* **FR-1.1:** Aplikasi dapat diinstal di Android, iOS, dan Desktop (Add to Home Screen).
* **FR-1.2:** Aplikasi memiliki Web App Manifest dan mendukung pemuatan instan via Service Workers.

### 4.3 Task Management (CRUD)
* **FR-2.1 Input Task:** User dapat memasukkan judul tugas, tanggal & waktu reminder, dan catatan tambahan (opsional).
* **FR-2.2 Task Status:** Setiap task wajib memiliki satu status:
  * `to_do` — Aktif
  * `done` — Selesai
  * `hold` — Ditangguhkan
  * `cancel` — Dibatalkan
* **FR-2.3 Edit Task:** User dapat mengubah judul, tanggal reminder, dan catatan task yang belum `done` atau `cancel`.
* **FR-2.4 Cancel Task:** Tidak ada fitur hapus. Pembatalan hanya melakukan soft update status menjadi `cancel`.

### 4.4 Dashboard View
* **FR-3.1 Grouping View:** Halaman utama menampilkan task yang dikelompokkan per hari (Hari Ini, Besok, Rabu 11 Juni, dst).
* **FR-3.2 Top 3 Highlight:** Di bagian paling atas dashboard, sistem memunculkan maksimal 3 task dengan `reminder_date` terdekat, filter status `to_do` atau `hold`, diurutkan ascending.

### 4.5 Telegram Bot Integration & Persistent Reminder
* **FR-4.1 Koneksi Akun:** User menghubungkan akun Telegram mereka melalui halaman Settings. Flow: generate token unik di app → user kirim token ke bot → bot verifikasi & simpan `telegram_chat_id`.
* **FR-4.2 Automated Alert:** Sistem otomatis mengirimkan reminder ke Telegram user tepat pada `reminder_date`.
* **FR-4.3 Persistent Reminder:** Setelah reminder pertama terkirim, sistem mengirim ulang secara otomatis dengan interval:
  * **15 menit** sekali selama 1 jam pertama.
  * **1 jam** sekali setelahnya.
  * **Berhenti otomatis** setelah 24 jam atau jika task di-mark `done`.
* **FR-4.4 Message Design:** Pesan Telegram menggunakan format HTML dengan header urgensi, judul bold, tanggal & waktu, dan catatan.
* **FR-4.5 Interactive Inline Button:** Setiap pesan reminder menyertakan tombol **"✅ Tandai Selesai"**.
* **FR-4.6 Webhook Status Update:** Klik tombol di Telegram → Webhook → update status task jadi `done` di DB → konfirmasi di Telegram. User tidak perlu membuka app PWA.

---

## 5. Non-Functional Requirements (NFR)

* **NFR-1 Security:** Webhook Telegram diamankan dengan Secret Token Verification.
* **NFR-2 Performance:** Load time dashboard < 1.5 detik (dioptimalkan via SSR + Supabase query).
* **NFR-3 Reliability:** Cron Job berjalan tiap 1–5 menit untuk akurasi pengiriman reminder.
* **NFR-4 Data Isolation:** Row Level Security (RLS) Supabase memastikan tiap user hanya bisa akses data miliknya.

---

## 6. API Routes

| Method | Route | Deskripsi | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Ambil semua task milik user | ✅ Required |
| `POST` | `/api/tasks` | Tambah task baru | ✅ Required |
| `PATCH` | `/api/tasks/[id]` | Edit task atau update status | ✅ Required |
| `POST` | `/api/telegram/connect` | Generate token koneksi Telegram | ✅ Required |
| `POST` | `/api/account/deactivate` | Soft delete akun user | ✅ Required |
| `POST` | `/api/remind` | Trigger cron: kirim reminder ke Telegram | 🔒 Internal (Upstash) |
| `POST` | `/api/webhook/telegram` | Terima callback dari Telegram Bot | 🔒 Secret Token |
| `GET` | `/auth/callback` | Handler redirect setelah Google OAuth | — |

**Catatan:**
- `/api/remind` dipanggil oleh Upstash QStash, bukan oleh user langsung.
- `/api/webhook/telegram` divalidasi via header `x-telegram-bot-api-secret-token`.
- Semua route yang butuh auth menggunakan Supabase SSR session — tidak ada JWT manual.

---

## 7. Data Model

### Tabel `users`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Supabase Auth user ID |
| `email` | VARCHAR | Email pengguna |
| `full_name` | VARCHAR | Nama lengkap |
| `avatar_url` | TEXT | URL foto profil (dari Google OAuth) |
| `provider` | VARCHAR(20) | `email` atau `google` |
| `is_active` | BOOLEAN | `false` jika akun di-deactivate (soft delete) |
| `deactivated_at` | TIMESTAMP | Waktu deactivation |
| `created_at` | TIMESTAMP | Waktu pembuatan akun |

### Tabel `tasks`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | ID unik task |
| `user_id` | UUID (FK → users.id) | Pemilik task |
| `title` | VARCHAR(255) | Judul task |
| `notes` | TEXT | Catatan tambahan (opsional) |
| `status` | VARCHAR(20) | `to_do`, `done`, `hold`, `cancel` |
| `reminder_date` | TIMESTAMP WITH TZ | Tanggal & waktu reminder pertama |
| `next_remind_at` | TIMESTAMP WITH TZ | Waktu reminder berikutnya (untuk persistent) |
| `reminder_count` | INTEGER | Jumlah reminder yang sudah terkirim |
| `last_reminded_at` | TIMESTAMP WITH TZ | Timestamp reminder terakhir |
| `created_at` | TIMESTAMP | Waktu pembuatan task |
| `updated_at` | TIMESTAMP | Waktu terakhir diupdate |

### Tabel `telegram_connections`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | ID koneksi |
| `user_id` | UUID (FK → users.id) | Pemilik koneksi |
| `telegram_chat_id` | VARCHAR(50) | Chat ID Telegram user |
| `connect_token` | VARCHAR(64) | Token untuk verifikasi koneksi |
| `is_connected` | BOOLEAN | Status koneksi |
| `connected_at` | TIMESTAMP | Waktu koneksi berhasil |
| `created_at` | TIMESTAMP | Waktu token dibuat |

---

## 8. Milestones & Timeline

| Fase | Scope | Estimasi |
| :--- | :--- | :--- |
| **Fase 1** | Fondasi & Setup (Next.js, Supabase, skema DB, PWA config) | ~1 minggu |
| **Fase 2** | Auth & Manajemen Akun (login, register, middleware, soft delete) | ~1 minggu |
| **Fase 3** | Frontend & Core CRUD (dashboard, task management, API routes) | ~2 minggu |
| **Fase 4** | Integrasi Telegram Bot (koneksi akun, kirim reminder, webhook) | ~1 minggu |
| **Fase 5** | Cron Job, Testing & Deployment | ~1 minggu |
| **Total** | | **~6 minggu** |

---

## 9. Struktur Folder (Ringkasan)

```
todo-pwa/
├── src/
│   ├── app/
│   │   ├── (auth)/login & register
│   │   ├── dashboard/
│   │   ├── settings/telegram/
│   │   ├── api/tasks/, api/remind/, api/webhook/telegram/
│   │   └── auth/callback/
│   ├── components/
│   │   ├── tasks/        → Top3Highlight, TaskGroup, TaskCard, StatusBadge, AddTaskModal, EditTaskModal
│   │   ├── telegram/     → TelegramConnect, TelegramStatus
│   │   └── ui/           → Modal, FAB, EmptyState, Navbar
│   ├── lib/
│   │   ├── supabase/     → client.ts, server.ts
│   │   └── telegram/     → bot.ts, reminder.ts
│   ├── types/index.ts
│   └── middleware.ts
├── public/
│   ├── manifest.json
│   └── icons/
├── .env.local
└── next.config.js
```

---

## 10. Catatan Teknis

### Security
- `SUPABASE_SERVICE_ROLE_KEY` **hanya** dipakai di server-side API routes (`/api/remind`, `/api/webhook`). Jangan pernah diekspos ke client.
- Webhook Telegram divalidasi via header `x-telegram-bot-api-secret-token` — tolak request jika tidak cocok.
- RLS aktif di semua tabel — user hanya bisa akses data dengan `user_id = auth.uid()`.

### Persistent Reminder Logic
- Saat task dibuat: `next_remind_at = reminder_date`, `reminder_count = 0`.
- Setiap kali reminder terkirim: increment `reminder_count`, update `last_reminded_at`, kalkulasi `next_remind_at` baru.
- Interval: 15 menit untuk 4 pengiriman pertama (1 jam), lalu 60 menit setelahnya.
- Jika sudah 24 jam sejak `reminder_date`: set `next_remind_at = null` → cron berhenti memproses task ini.
- Jika task di-`done`: cron query otomatis skip karena filter `status IN ('to_do', 'hold')`.
- Jika `reminder_date` diubah lewat edit: reset `next_remind_at = reminder_date_baru`, `reminder_count = 0`.

### Cron Query
```sql
SELECT tasks.*, telegram_connections.telegram_chat_id
FROM tasks
JOIN telegram_connections ON tasks.user_id = telegram_connections.user_id
WHERE tasks.status IN ('to_do', 'hold')
  AND tasks.next_remind_at <= NOW()
  AND tasks.next_remind_at IS NOT NULL
  AND telegram_connections.is_connected = true;
```

### Environment Variables
| Variable | Scope | Keterangan |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Anon key Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Service role key — jangan ekspos ke client |
| `TELEGRAM_BOT_TOKEN` | Server only | Token dari BotFather |
| `TELEGRAM_WEBHOOK_SECRET` | Server only | String random untuk validasi webhook |
| `NEXT_PUBLIC_APP_URL` | Public | URL production app (untuk OAuth callback) |

### Dokumen Terkait
- `summaries.md` — ringkasan sesi brainstorming dan keputusan desain
- `implementation.md` — panduan implementasi detail + boilerplate kode fase 1–5
- `checklist.md` — tracking progress per item (80 item total)

