<!--
Nama File    : README.md
Deskripsi    : Dokumentasi proyek To-Do Reminder PWA dengan Integrasi Telegram Bot
Dibuat oleh  : Tim Pengembang (Built with Vibe Coding)
Tanggal      : Agustus 2026
-->

# To-Do Reminder PWA dengan Integrasi Telegram Bot

> ⚡ **Aplikasi ini dibangun dengan pendekatan *Vibe Coding*** — perancangan cepat, iteratif, dan fokus pada efisiensi serta user experience yang seamless.

Aplikasi manajemen tugas personal berbasis **Progressive Web App (PWA)** yang terintegrasi secara dua arah dengan **Telegram Bot**. Dirancang untuk mempermudah pengelolaan tugas harian dengan notifikasi pengingat persisten (*persistent reminder*) langsung ke akun Telegram pengguna serta aksi instan tanpa perlu membuka aplikasi web.

Untuk spesifikasi detail kebutuhan fungsional dan teknis, silakan lihat [Product Requirements Document (PRD)](docs/PRD.md).

---

## 🚀 Fitur & Kemampuan Utama

- 📋 **Manajemen Tugas**: Pembuatan, pengeditan, penyortiran descending, pengelompokan tanggal, hingga filter summary progres harian dan total tugas selesai.
- 🔔 **Persistent Reminder via Telegram**: Pengingat otomatis berkala langsung ke chat Telegram saat tugas jatuh tempo.
- 🤖 **Integrasi Dua Arah Telegram Bot**: Koneksi akun satu-klik via token dan tombol inline keyboard (`callback_query`) untuk menyelesaikan tugas instan dari chat Telegram.
- 📱 **Progressive Web App (PWA)**: UI responsif mobile-first, instalasi *Home Screen* (Android, iOS, Desktop), dan aset visual maskot resmi.
- 🔒 **Keamanan & Multi-User**: Autentikasi Supabase (Email & Google OAuth), Row Level Security (RLS) terisolasi per user, dan penonaktifan akun via *Soft Delete*.

> 📖 **Detail Spesifikasi & Logika Bisnis**: Seluruh rincian kebutuhan fungsional (FR-0.1 s/d FR-4.6), diagram alur, dan aturan bisnis dipusatkan pada [docs/PRD.md](docs/PRD.md).

---

## 🛠️ Teknologi yang Digunakan

### Frontend & UI
- **[Next.js 16 (App Router)](https://nextjs.org/)** — Framework React modern berbasis server & client component.
- **[React 19](https://react.dev/)** — Library inti antarmuka deklaratif.
- **[TypeScript](https://www.typescriptlang.org/)** — Static typing untuk keandalan kode.
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Framework utilitas styling modern.
- **[Framer Motion](https://www.framer.com/motion/)** & **[Lucide React](https://lucide.dev/)** — Animasi UI halus dan icon pack modern.
- **[Sonner](https://sonner.emilkowal.ski/)** — Notifikasi toast interaktif.

### Backend, Database & Auth
- **[Supabase](https://supabase.com/)** — PostgreSQL Database, Authentication (Email & Google OAuth), dan Row Level Security (RLS).
- **[@supabase/ssr](https://supabase.com/docs/guides/auth/server-side/nextjs)** — Session management sisi server pada Next.js App Router.

### Integrasi Telegram, PWA & Scheduler
- **[grammY](https://grammy.dev/)** — Framework TypeScript untuk Telegram Bot API & Webhook handler.
- **[@ducanh2912/next-pwa](https://github.com/DuCanhDe/next-pwa)** — PWA engine & Service Worker builder.
- **[date-fns](https://date-fns.org/)** — Manipulasi dan pemformatan tanggal/waktu.
- **[Upstash QStash](https://upstash.com/docs/qstash)** — Serverless cron scheduler pemanggil endpoint pengingat (`/api/remind`).

### Testing
- **[Jest](https://jestjs.io/)** & **[ts-jest](https://kulshekhar.github.io/ts-jest/)** — Automated unit test runner & TypeScript preprocessor.

---

## 📁 Struktur Proyek

```text
todo-list-reminder-telegram/
├── changelogs/                 # Catatan riwayat perubahan berkala (CHANGELOG_<DD_MM_YYYY>.md)
├── docs/                       # Dokumentasi arsitektur, PRD, dan implementasi
│   ├── PRD.md                  # Product Requirements Document & spesifikasi fungsional
│   ├── TASKS.md                # Checklist progress pengembangan
│   ├── implementation.md       # Panduan teknis implementasi & setup DDL
│   └── summaries.md            # Rangkuman brainstorming & keputusan arsitektur
├── public/                     # Aset statis PWA & Web App Manifest
│   ├── favicon.ico
│   ├── icons/                  # Icon PWA (192x192, 512x512) & logo maskot
│   └── manifest.json
├── src/
│   ├── app/                    # Next.js App Router (Routes, API & UI Pages)
│   │   ├── (auth)/             # Route grup autentikasi (login & register)
│   │   ├── api/                # API Endpoints (tasks, remind, telegram, account, webhook)
│   │   ├── auth/callback/      # Redirect handler Google OAuth
│   │   ├── dashboard/          # Dashboard utama PWA
│   │   ├── settings/           # Pengaturan akun & koneksi Telegram Bot
│   │   ├── globals.css         # Styling global Tailwind CSS
│   │   └── layout.tsx          # Root Layout aplikasi
│   ├── components/             # Komponen UI modular
│   │   ├── tasks/              # Komponen task (TaskCard, TaskGroup, TaskStats, Modals, Top3Highlight)
│   │   └── ui/                 # Komponen UI umum (Navbar, Modal, FAB, StatusBadge, EmptyState)
│   ├── hooks/                  # Custom React hooks (useTasks, useTelegram, useTheme)
│   ├── lib/                    # Helper logika & konfigurasi eksternal
│   │   ├── supabase/           # Client Supabase Browser & SSR Server
│   │   ├── telegram/           # Bot grammY & utilitas reminder
│   │   ├── taskHistory.ts      # Helper sorting, pagination & grouping tanggal
│   │   └── taskStats.ts        # Helper kalkulasi progres harian & total tugas
│   ├── types/                  # Definisi TypeScript interface
│   └── middleware.ts           # Middleware proteksi autentikasi Next.js
├── tests/                      # Unit test suites (Jest & ts-jest)
├── next.config.ts              # Konfigurasi Next.js & PWA plugin
├── jest.config.js              # Konfigurasi Jest
├── package.json                # Dependencies dan script npm
└── tsconfig.json               # Konfigurasi TypeScript
```

---

## 🗄️ Skema Database (Supabase PostgreSQL)

Aplikasi menggunakan 3 tabel utama yang dilindungi kebijakan **Row Level Security (RLS)**:

- `users` — Data profil pengguna terhubung dengan `auth.users` Supabase.
- `tasks` — Data tugas harian, status (`to_do`, `done`, `hold`, `cancel`), dan metadata persistent reminder (`next_remind_at`, `reminder_count`).
- `telegram_connections` — Relasi akun pengguna ke Telegram (`telegram_chat_id`, `connect_token`, `is_connected`).

> 📝 Panduan query DDL SQL lengkap tersedia di file [docs/implementation.md](docs/implementation.md).

---

## 🔑 Environment Variables

Buat file `.env.local` pada root direktori dan sesuaikan nilai variabel berikut:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your-bot-token-from-botfather
TELEGRAM_WEBHOOK_SECRET=your-webhook-secret-token

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Catatan Keamanan**: Jangan pernah mempublikasikan `SUPABASE_SERVICE_ROLE_KEY` atau `TELEGRAM_BOT_TOKEN` ke repositori publik.

---

## ⚙️ Cara Instalasi & Setup Lokal

### 1. Prasyarat
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
2. Eksekusi script DDL SQL dari file [docs/implementation.md](docs/implementation.md) pada SQL Editor Supabase.
3. Aktifkan provider **Email** dan **Google OAuth** di menu *Authentication -> Providers*.

### 4. Setup Telegram Bot
1. Hubungi [@BotFather](https://t.me/BotFather) di Telegram dan jalankan perintah `/newbot`.
2. Salin token bot yang diberikan ke variabel `TELEGRAM_BOT_TOKEN` di `.env.local`.

### 5. Jalankan Server Development
```bash
npm run dev
```
Akses aplikasi melalui browser di [http://localhost:3000](http://localhost:3000).

---

## 🕹️ Perintah CLI (Scripts)

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server development Next.js lokal |
| `npm run build` | Membuat build produksi teroptimasi |
| `npm run start` | Menjalankan server produksi |
| `npm run lint` | Memeriksa kualitas & styling kode (ESLint) |
| `npm test` | Menjalankan seluruh automated unit test suite (Jest) |

---

## 📜 Lisensi & Pengembang

Proyek ini dibangun secara independen dengan pendekatan **Vibe Coding** untuk mempermudah produktivitas harian.

**Dibuat oleh**: Tim Pengembang  
**Tanggal**: Juni – Agustus 2026

