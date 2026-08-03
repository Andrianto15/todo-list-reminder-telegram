<!--
Nama File    : README.md
Deskripsi    : Dokumentasi lengkap proyek To-Do Reminder PWA dengan Integrasi Telegram Bot
Dibuat oleh  : Tim Pengembang
Tanggal      : Agustus 2026
-->

# To-Do Reminder PWA dengan Integrasi Telegram Bot

Aplikasi manajemen tugas personal berbasis **Progressive Web App (PWA)** yang terintegrasi secara dua arah dengan **Telegram Bot**. Aplikasi ini dirancang untuk mempermudah pengelolaan tugas harian dengan sistem pengingat persisten (*persistent reminder*) langsung ke akun Telegram pengguna. Pengguna dapat menandai tugas selesai secara instan melalui tombol interaktif di chat Telegram tanpa perlu membuka aplikasi web.

---

## 🚀 Fitur Utama

- 📋 **Manajemen Tugas (Task Management)**:
  - Membuat, mengedit, dan mengelola daftar tugas dengan status: `to_do`, `done`, `hold`, dan `cancel`.
  - Pengelompokan tugas otomatis berdasarkan tanggal (*Task Grouping* per hari).
  - Ringkasan **Top 3 Highlight** untuk menampilkan 3 tugas terdekat yang paling mendesak.
- 🔔 **Persistent Reminder via Telegram**:
  - Notifikasi dikirimkan ke chat Telegram pengguna secara berkala saat tugas masuk tenggat waktu (`reminder_date`).
  - **Interval Pengingat Otomatis**: Dikirim ulang setiap 15 menit pada jam pertama, kemudian setiap 1 jam pada jam-jam berikutnya (berhenti otomatis setelah 24 jam jika tidak direspons).
- 🤖 **Integrasi Dua Arah Telegram Bot**:
  - Menghubungkan akun web PWA dengan Telegram Bot secara mudah menggunakan kode/token unik.
  - Interaksi cepat: Tandai tugas sebagai **Selesai** langsung dari chat Telegram melalui tombol *Inline Keyboard* (`callback_query`).
- 🔒 **Autentikasi & Keamanan Data**:
  - Login menggunakan **Email & Password** atau **Google OAuth 2.0**.
  - Perlindungan data tingkat lanjut menggunakan **Supabase Row Level Security (RLS)** (pengguna hanya dapat mengakses datanya sendiri).
  - Penonaktifan akun secara aman (*Soft Delete* via `is_active = false`).
- 📱 **Progressive Web App (PWA)**:
  - Tampilan responsif dan dioptimalkan untuk perangkat mobile maupun desktop.
  - Dapat diinstal ke *home screen* layaknya aplikasi native (Android & iOS).

---

## 🛠️ Teknologi yang Digunakan

### Frontend & Framework
- **[Next.js 16 (App Router)](https://nextjs.org/)** — Framework React modern untuk render server & client.
- **[React 19](https://react.dev/)** — Library UI deklaratif.
- **[TypeScript](https://www.typescriptlang.org/)** — Pengetikan statis untuk keamanan kode.
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Framework styling utilitas.

### Backend & Database
- **[Supabase](https://supabase.com/)** — Database PostgreSQL, Authentication, dan Row Level Security (RLS).
- **[@supabase/ssr](https://supabase.com/docs/guides/auth/server-side/nextjs)** — Manajemen sesi server-side Next.js.

### Integrasi Telegram & PWA
- **[grammY](https://grammy.dev/)** — Framework TypeScript modern untuk Telegram Bot API.
- **[@ducanh2912/next-pwa](https://github.com/DuCanhDe/next-pwa)** — Plugin PWA untuk Next.js App Router.
- **[date-fns](https://date-fns.org/)** — Manipulasi dan format tanggal/waktu.

### Cron & Scheduler
- **[Upstash QStash](https://upstash.com/docs/qstash)** — Scheduler Cron serverless untuk mengeksekusi endpoint reminder (`/api/remind`) setiap 5 menit.

---

## 📁 Struktur Proyek

```text
todo-list-reminder-telegram/
├── docs/                       # Dokumentasi arsitektur, PRD, dan rangkuman keputusan
│   ├── IMPLEMENTATION.md
│   ├── PRD.md
│   └── SUMMARIES.md
├── public/                     # Asset statis PWA (manifest, icon, gambar)
│   ├── manifest.json
│   ├── icon-192x192.png
│   └── icon-512x512.png
├── src/
│   ├── app/                    # Next.js App Router (Routes & API)
│   │   ├── (auth)/             # Route grup autentikasi
│   │   │   ├── login/          # Halaman Login (Email & Google OAuth)
│   │   │   └── register/       # Halaman Pendaftaran Akun
│   │   ├── api/                # API Endpoints
│   │   │   ├── account/        # Endpoint penonaktifan akun (Soft Delete)
│   │   │   ├── remind/         # Endpoint Cron Job pengiriman reminder
│   │   │   ├── tasks/          # CRUD Tasks API (`/api/tasks`, `/api/tasks/[id]`)
│   │   │   ├── telegram/       # Endpoint pembuatan token koneksi Telegram
│   │   │   └── webhook/        # Webhook handler Telegram Bot (`/api/webhook/telegram`)
│   │   ├── auth/
│   │   │   └── callback/       # Redirect handler Google OAuth
│   │   ├── dashboard/          # Halaman utama aplikasi PWA
│   │   ├── settings/           # Pengaturan koneksi Telegram
│   │   ├── globals.css         # Styling global Tailwind CSS
│   │   ├── layout.tsx          # Root Layout aplikasi
│   │   └── page.tsx            # Entry point (Redirect ke Dashboard)
│   ├── components/             # Komponen React yang dapat digunakan kembali
│   │   ├── tasks/              # Komponen khusus tugas (TaskCard, TaskGroup, Modals, Top3Highlight)
│   │   └── ui/                 # Komponen dasar UI (Modal, FAB, Navbar, StatusBadge, EmptyState)
│   ├── lib/                    # Utilitas & Konfigurasi Eksternal
│   │   ├── supabase/           # Client Supabase Browser & SSR Server Client
│   │   └── telegram/           # Konfigurasi Bot grammY & utilitas pesan reminder
│   ├── types/                  # Definisi TypeScript interface (Task, User, TelegramConnection)
│   └── middleware.ts           # Middleware proteksi halaman (Authentication guard)
├── .env.local                  # Environment variables lokal (Jangan commit ke repo)
├── next.config.ts              # Konfigurasi Next.js & PWA
├── package.json                # Dependencies dan script npm
├── TASKS.md                    # Checklist progres pengembangan proyek
└── tsconfig.json               # Konfigurasi TypeScript
```

---

## 🗄️ Skema Database (PostgreSQL / Supabase)

Aplikasi ini menggunakan 3 tabel utama di Supabase PostgreSQL dengan konfigurasi Row Level Security (RLS):

### 1. Tabel `users`
| Kolom | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `id` | `UUID` (PK) | Matched dengan `auth.users.id` Supabase |
| `email` | `TEXT` | Alamat email pengguna |
| `full_name` | `TEXT` | Nama lengkap pengguna |
| `avatar_url` | `TEXT` | URL foto profil |
| `provider` | `TEXT` | Provider auth (`email` / `google`) |
| `is_active` | `BOOLEAN` | Status aktif akun (default: `true`) |
| `deactivated_at` | `TIMESTAMPTZ` | Waktu penonaktifan akun |
| `created_at` | `TIMESTAMPTZ` | Timestamp pembuatan akun |

### 2. Tabel `tasks`
| Kolom | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `id` | `UUID` (PK) | ID unik tugas |
| `user_id` | `UUID` (FK) | Referensi ke `users.id` |
| `title` | `TEXT` | Judul / nama tugas |
| `notes` | `TEXT` | Catatan tambahan tugas (opsional) |
| `status` | `TEXT` | Enum status (`to_do`, `done`, `hold`, `cancel`) |
| `reminder_date` | `TIMESTAMPTZ` | Waktu pengingat awal yang ditentukan pengguna |
| `next_remind_at` | `TIMESTAMPTZ` | Jadwal eksekusi pengingat berikutnya |
| `reminder_count` | `INTEGER` | Jumlah pengingat yang sudah terkirim |
| `last_reminded_at`| `TIMESTAMPTZ` | Timestamp pengingat terakhir terkirim |
| `created_at` | `TIMESTAMPTZ` | Timestamp pembuatan tugas |
| `updated_at` | `TIMESTAMPTZ` | Timestamp perubahan terakhir |

### 3. Tabel `telegram_connections`
| Kolom | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `id` | `UUID` (PK) | ID unik koneksi |
| `user_id` | `UUID` (FK) | Referensi ke `users.id` |
| `telegram_chat_id`| `BIGINT` | Chat ID Telegram milik pengguna |
| `connect_token` | `TEXT` | Token unik untuk verifikasi koneksi Telegram Bot |
| `is_connected` | `BOOLEAN` | Status terhubung ke Telegram Bot |
| `connected_at` | `TIMESTAMPTZ` | Timestamp saat berhasil dihubungkan |

---

## 🔑 Environment Variables

Buat file `.env.local` di root proyek dan tambahkan variabel berikut:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your-telegram-bot-token-from-botfather
TELEGRAM_WEBHOOK_SECRET=your-custom-webhook-secret-token

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Catatan Keamanan**: Jangan pernah mempublikasikan `SUPABASE_SERVICE_ROLE_KEY` atau `TELEGRAM_BOT_TOKEN` ke dalam kontrol versi publik (Git).

---

## ⚙️ Cara Instalasi & Setup Lokal

### 1. Prasyarat
Pastikan komputer Anda sudah terinstal:
- **Node.js** (v18.0.0 atau lebih baru)
- **npm**, **yarn**, **pnpm**, atau **bun**

### 2. Clone Repository & Install Dependencies
```bash
git clone https://github.com/Andrianto15/todo-list-reminder-telegram.git
cd todo-list-reminder-telegram
npm install
```

### 3. Setup Supabase
1. Buat proyek baru di [Supabase Dashboard](https://supabase.com/).
2. Masukkan script DDL SQL yang ada pada file [`docs/IMPLEMENTATION.md`](file:///d:/Programming/MiniProject/todo-list-reminder-telegram/docs/IMPLEMENTATION.md) di SQL Editor Supabase untuk membuat tabel `users`, `tasks`, `telegram_connections`, index, dan RLS policy.
3. Aktifkan provider **Email** dan **Google OAuth** di menu *Authentication -> Providers*.

### 4. Setup Telegram Bot
1. Buka Telegram dan cari [@BotFather](https://t.me/BotFather).
2. Kirim perintah `/newbot` dan ikuti petunjuk hingga mendapatkan **Bot Token**.
3. Salin token tersebut ke variabel `TELEGRAM_BOT_TOKEN` di `.env.local`.

### 5. Jalankan Server Development
```bash
npm run dev
```
Buka browser dan akses [http://localhost:3000](http://localhost:3000).

---

## 🕹️ Perintah CLI (Scripts)

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server pengembangan Next.js lokal |
| `npm run build` | Membuat build produksi teroptimasi |
| `npm run start` | Menjalankan server produksi yang telah di-build |
| `npm run lint` | Menjalankan pemeriksaan kualitas kode (ESLint) |

---

## 🔄 Alur Integrasi & Bot Webhook

1. **Menghubungkan Akun PWA ke Telegram**:
   - Pengguna membuka halaman `/settings/telegram` di PWA dan menekan tombol **Hubungkan Telegram**.
   - Sistem meregenerasi token unik (`connect_token`) di tabel `telegram_connections`.
   - Pengguna mengeklik tautan bot `https://t.me/<NamaBot>?start=<connect_token>`.
   - Telegram Webhook (`/api/webhook/telegram`) menerima perintah `/start <connect_token>`, memverifikasi token, dan menyimpan `telegram_chat_id`.

2. **Pengiriman Pengingat Otomatis (Cron Job)**:
   - Upstash QStash atau Cron Job eksternal memanggil `POST /api/remind` setiap 5 menit.
   - Endpoint mencari tugas dengan kriteria: `next_remind_at <= NOW()` dan status `to_do` atau `hold`.
   - Bot mengirimkan pesan HTML berisi detail tugas beserta tombol Inline Keyboard `✅ Tandai Selesai`.
   - Nilai `next_remind_at`, `reminder_count`, dan `last_reminded_at` diperbarui di database.

3. **Menandai Selesai dari Telegram**:
   - Saat pengguna menekan `✅ Tandai Selesai`, Telegram mengirimkan `callback_query` ke `/api/webhook/telegram`.
   - Webhook mengubah status tugas menjadi `done` di database Supabase dan mengedit pesan Telegram menjadi status selesai.

---

## 📜 Lisensi & Pengembang

Proyek ini dibuat untuk keperluan manajemen tugas personal dan dikembangkan secara independen.

**Dibuat oleh**: Tim Pengembang  
**Tanggal**: Juni – Agustus 2026
