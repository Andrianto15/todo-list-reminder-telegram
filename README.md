<p align="center">
  <img src="public/icons/logo.png" alt="To-Do Reminder Logo" width="128" height="128" />
</p>

<h1 align="center">To-Do Reminder PWA & Telegram Bot</h1>

<p align="center">
  Progressive Web App (PWA) modern untuk manajemen tugas harian dengan sistem pengingat persisten (persistent reminder) terintegrasi dua arah ke Telegram Bot.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.4.3-black?logo=next.js" alt="Next.js Version" />
  <img src="https://img.shields.io/badge/React-19.3.1-blue?logo=react" alt="React Version" />
  <img src="https://img.shields.io/badge/TypeScript-5.9.3-3178c6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4.3.3-38bdf8?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-SSR-3ecf8e?logo=supabase" alt="Supabase SSR" />
  <img src="https://img.shields.io/badge/grammY-1.46.0-2ca5e0?logo=telegram" alt="grammY" />
  <img src="https://img.shields.io/badge/Tests-69%20passed-brightgreen?logo=jest" alt="Jest Tests" />
  <img src="https://img.shields.io/badge/PWA-Ready-orange" alt="PWA Ready" />
</p>

---

Aplikasi manajemen tugas berbasis **Progressive Web App (PWA)** mobile-first yang dirancang untuk mempermudah produktivitas harian. Dilengkapi sistem pengingat persisten otomatis via **Telegram Bot**, pengguna dapat menerima notifikasi pengingat tepat waktu dan menyelesaikan tugas langsung melalui tombol interaktif di Telegram tanpa perlu membuka aplikasi web.

> [!NOTE]
> Spesifikasi fungsional lengkap (FR-0.1 s/d FR-4.6), aturan bisnis, dan diagram alur sistem terdokumentasi lengkap di [docs/PRD.md](docs/PRD.md).

---

## Fitur Utama

- **Manajemen Tugas**: Buat, edit, hapus, dan tandai tugas dengan status (`to_do`, `done`, `hold`, `cancel`). Dilengkapi grouping tanggal, penyortiran descending, filter status, pencarian instan, dan kartu highlight Top 3 tugas prioritas.
- **Pengingat Persisten Telegram**: Pengingat otomatis berkala langsung ke chat Telegram saat tugas jatuh tempo (`reminder_date`), dengan interval yang meningkat bertahap hingga tugas diselesaikan.
- **Interaksi Dua Arah Telegram Bot**: Sinkronisasi akun satu-klik via pairing token (`/connect <token>`), serta tombol aksi inline (`callback_query`) di chat Telegram untuk menandai tugas selesai secara instan.
- **PWA & Aksesibilitas Mobile-First**: Desain responsif bertema Steel Blue (`#4682b4`) & Sky Glow (`#0ea5e9`), instalasi Home Screen (Android, iOS, Desktop), sentuhan minimal 44px (WCAG 2.1 AA), keyboard focus trap, dan dukungan motion reduction.
- **Keamanan Komprehensif**:
  - Proteksi Row Level Security (RLS) Supabase terisolasi per akun pengguna.
  - Otorisasi endpoint cron `/api/remind` dengan `CRON_SECRET` via header `Authorization: Bearer` atau `x-cron-secret`.
  - Verifikasi signature webhook Telegram menggunakan `crypto.timingSafeEqual` yang aman terhadap timing attack.
  - Sanitasi payload dan pencegahan mass assignment pada pembaruan tugas.
  - Sanitasi HTML entity escaping pada pengiriman pesan notifikasi Telegram.
  - Penguatan HTTP Security Headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).

---

## Arsitektur & Alur Kerja

```
[ Pengguna ] ──(Browser / PWA)──> [ Next.js App Router ] ──(RLS)──> [ Supabase PostgreSQL ]
                                            │
                                  (/api/remind endpoint)
                                            ▲
[ Upstash QStash Cron ] ────────────────────┘ (Bearer CRON_SECRET)
                                            │
                                            ▼
[ Telegram Bot (grammY) ] ◄──(Inline Callback)──► [ Pengguna via Chat Telegram ]
```

1. Pengguna membuat tugas dan menyetel waktu pengingat di PWA.
2. Scheduler eksternal (Upstash QStash) memicu `/api/remind` secara terjadwal dengan autentikasi `CRON_SECRET`.
3. Server memproses tugas yang jatuh tempo, meng-escape karakter input secara aman, dan mengirim pesan notifikasi ke akun Telegram pengguna via grammY.
4. Pengguna dapat menyelesaikan tugas langsung dari chat Telegram melalui inline button tanpa login ke web dashboard.

---

## Teknologi yang Digunakan

| Kategori | Teknologi | Kegunaan |
| :--- | :--- | :--- |
| **Frontend Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | Framework React modern berbasis Server & Client Components |
| **UI Library** | [React 19](https://react.dev/) | Library antarmuka reaktif deklaratif |
| **Bahasa Pemrograman** | [TypeScript 5.9](https://www.typescriptlang.org/) | Tipe statis ketat untuk keandalan kode |
| **Styling & Desain** | [Tailwind CSS v4](https://tailwindcss.com/) | Utilitas CSS modern dengan token semantik |
| **Tipografi** | [Public Sans & JetBrains Mono](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) | Optimalisasi font native `next/font/google` |
| **Animasi & Ikon** | [Framer Motion](https://www.framer.com/motion/) & [Lucide React](https://lucide.dev/) | Transisi visual halus & paket ikon modern |
| **Toast Notification** | [Sonner](https://sonner.emilkowal.ski/) | Notifikasi toast interaktif |
| **Database & Auth** | [Supabase](https://supabase.com/) | PostgreSQL, Email & Google OAuth, Row Level Security |
| **Server-Side Auth** | [@supabase/ssr](https://supabase.com/docs/guides/auth/server-side/nextjs) | Manajemen sesi server aman di Next.js App Router |
| **Telegram Bot API** | [grammY](https://grammy.dev/) | Framework TypeScript untuk Telegram Bot & webhook handler |
| **PWA Engine** | [@ducanh2912/next-pwa](https://github.com/DuCanhDe/next-pwa) | Service Worker builder & caching offline |
| **Cron Scheduler** | [Upstash QStash](https://upstash.com/docs/qstash) | Serverless cron pemanggil endpoint `/api/remind` |
| **Testing Suite** | [Jest](https://jestjs.io/) & [ts-jest](https://kulshekhar.github.io/ts-jest/) | 14 test suites (69 automated unit tests) |

---

## Struktur Direktori

```text
todo-list-reminder-telegram/
├── changelogs/                 # Catatan riwayat versi (CHANGELOG_<DD_MM_YYYY>.md)
├── docs/                       # Dokumentasi arsitektur, PRD, dan implementasi
│   ├── PRD.md                  # Product Requirements Document & spesifikasi teknis
│   ├── DESIGN.md               # Spesifikasi design system, token warna & tipografi
│   └── implementation.md       # Panduan query DDL SQL & panduan integrasi
├── public/                     # Aset statis PWA & Web App Manifest
│   ├── favicon.ico
│   ├── icons/                  # Icon PWA (192x192, 512x512) & logo maskot
│   └── manifest.json
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Halaman autentikasi (login & register)
│   │   ├── api/                # API Endpoints (tasks, remind, telegram, webhook)
│   │   ├── auth/callback/      # Redirect handler Google OAuth
│   │   ├── dashboard/          # Dashboard utama manajemen tugas
│   │   ├── settings/           # Pengaturan akun & koneksi Telegram
│   │   ├── globals.css         # Styling global Tailwind CSS & design tokens
│   │   └── layout.tsx          # Root layout & font provider
│   ├── components/             # Komponen UI modular
│   │   ├── tasks/              # Komponen domain task (TaskCard, TaskFilter, Modal, Stats)
│   │   └── ui/                 # Komponen umum (Navbar, Modal, FAB, StatusBadge, EmptyState)
│   ├── hooks/                  # Custom React hooks (useTasks, useTelegram, useTheme)
│   ├── lib/                    # Helper logika, library client & utilitas
│   │   ├── supabase/           # Client Supabase Browser & SSR Server
│   │   └── telegram/           # Bot grammY & modul formatter reminder
│   ├── types/                  # Definisi antarmuka TypeScript
│   └── middleware.ts           # Middleware session & route protection
├── tests/                      # Automated unit test suites (Jest & ts-jest)
├── next.config.ts              # Konfigurasi Next.js, HTTP security headers & PWA
├── package.json                # Dependencies dan script npm
└── tsconfig.json               # Konfigurasi TypeScript
```

---

## Skema Database

Aplikasi menggunakan 3 tabel utama di **Supabase PostgreSQL** yang dilindungi penuh oleh kebijakan **Row Level Security (RLS)**:

- `users`: Profil pengguna terikat dengan `auth.users` Supabase.
- `tasks`: Penyimpanan tugas harian (`title`, `notes`, `status`, `reminder_date`, `reminder_count`, `next_remind_at`).
- `telegram_connections`: Relasi pairing akun (`telegram_chat_id`, `connect_token`, `is_connected`).

> [!TIP]
> Skrip DDL SQL lengkap beserta fungsi trigger dan RLS policies tersedia pada [docs/implementation.md](docs/implementation.md).

---

## Konfigurasi Lingkungan (Environment Variables)

Buat file `.env.local` pada root repositori:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your-bot-token-from-botfather
TELEGRAM_WEBHOOK_SECRET=your-webhook-secret-token

# Cron Reminder Secret
CRON_SECRET=your-random-secure-cron-secret

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> [!IMPORTANT]
> - `CRON_SECRET` wajib diisi untuk mengamankan endpoint `/api/remind` dari eksekusi tidak sah.
> - `SUPABASE_SERVICE_ROLE_KEY` dan `TELEGRAM_BOT_TOKEN` merupakan kredensial privat; jangan pernah mempublikasikannya ke repositori publik.

---

## Panduan Instalasi Lokal

### 1. Prasyarat
- **Node.js** (v18.0.0 atau lebih baru)
- Paket manajer: **npm**, **pnpm**, atau **bun**
- Akun [Supabase](https://supabase.com/) & akun Telegram

### 2. Clone Repositori & Pasang Dependensi
```bash
git clone https://github.com/Andrianto15/todo-list-reminder-telegram.git
cd todo-list-reminder-telegram
npm install
```

### 3. Setup Database Supabase
1. Buat proyek baru di [Supabase Dashboard](https://supabase.com/).
2. Buka **SQL Editor** di dashboard Supabase dan jalankan seluruh script DDL dari [docs/implementation.md](docs/implementation.md).
3. Aktifkan autentikasi **Email** dan opsi **Google OAuth** pada menu *Authentication -> Providers*.

### 4. Setup Bot Telegram
1. Buka Telegram dan hubungi [@BotFather](https://t.me/BotFather), lalu buat bot baru dengan perintah `/newbot`.
2. Salin token bot ke variabel `TELEGRAM_BOT_TOKEN` pada file `.env.local`.
3. Set webhook bot ke URL endpoint aplikasi:
   ```bash
   curl -F "url=https://<your-domain>/api/webhook/telegram" \
        -F "secret_token=<TELEGRAM_WEBHOOK_SECRET>" \
        https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook
   ```

### 5. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka peramban di [http://localhost:3000](http://localhost:3000).

---

## Otomatisasi Reminder (Upstash QStash)

Untuk memicu pemeriksaan pengingat berkala secara serverless di produksi:
1. Buat jadwal cron di konsol [Upstash QStash](https://upstash.com/).
2. Konfigurasikan target URL: `https://<your-domain>/api/remind` dengan interval tiap 1 menit (`* * * * *`).
3. Tambahkan header HTTP:
   ```http
   Authorization: Bearer <CRON_SECRET>
   ```

---

## Skrip CLI

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server development Next.js lokal |
| `npm run build` | Melakukan build produksi teroptimasi |
| `npm run start` | Menjalankan server hasil build produksi |
| `npm run lint` | Memeriksa kepatuhan linter ESLint |
| `npm test` | Menjalankan seluruh test suite otomatis (Jest) |

---

## Lisensi

Didistribusikan di bawah lisensi MIT. Lihat [`LICENSE`](LICENSE) untuk informasi hak cipta dan ketentuan hukum lengkap.

