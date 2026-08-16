# Checklist: To-Do Reminder PWA

**Project:** To-Do Reminder PWA with Telegram Integration  
**Versi:** 1.0 | **Tanggal:** Juni 2026  
**Progress:** 0 / 58 selesai

---

## Persiapan

- [ ] Buat akun Vercel
- [ ] Buat akun & project Supabase
- [ ] Buat Telegram Bot via BotFather → simpan `BOT_TOKEN`
- [ ] Buat akun Upstash → setup QStash
- [ ] Buat Google OAuth credentials di Google Cloud Console
- [ ] Buat file `.env.local` dengan semua environment variables

---

## Fase 1: Fondasi & Setup

### Init Project
- [ ] `npx create-next-app@latest` dengan flag TypeScript, Tailwind, App Router
- [ ] Install dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `grammy`, `@ducanh2912/next-pwa`, `date-fns`
- [ ] Buat struktur folder sesuai implementation.md

### Konfigurasi PWA
- [ ] Setup `next.config.js` dengan `withPWA`
- [ ] Buat `public/manifest.json`
- [ ] Tambah icon PWA: `icon-192x192.png` dan `icon-512x512.png`

### Supabase — Database
- [ ] Jalankan SQL: buat tabel `users`
- [ ] Jalankan SQL: buat tabel `tasks` (termasuk kolom `next_remind_at`, `reminder_count`, `last_reminded_at`)
- [ ] Jalankan SQL: buat tabel `telegram_connections`
- [ ] Buat index: `idx_tasks_next_remind` dan `idx_tasks_user_id`
- [ ] Buat trigger `tasks_updated_at` untuk auto-update `updated_at`

### Supabase — RLS
- [ ] Aktifkan RLS di tabel `users`
- [ ] Aktifkan RLS di tabel `tasks`
- [ ] Aktifkan RLS di tabel `telegram_connections`
- [ ] Buat policy "own data only" untuk ketiga tabel

### TypeScript & Supabase Client
- [ ] Buat `src/types/index.ts` (types: `Task`, `User`, `TelegramConnection`, `TaskStatus`)
- [ ] Buat `src/lib/supabase/client.ts` (browser client)
- [ ] Buat `src/lib/supabase/server.ts` (server client SSR)

---

## Fase 2: Auth & Manajemen Akun

- [ ] Buat `src/middleware.ts` — proteksi route, redirect ke `/login` jika belum auth
- [ ] Buat halaman `/(auth)/login/page.tsx` — form Email/Password + tombol Google OAuth
- [ ] Buat halaman `/(auth)/register/page.tsx` — form register Email baru
- [ ] Buat `src/app/auth/callback/route.ts` — handler redirect setelah Google OAuth
- [ ] Aktifkan Google OAuth di Supabase dashboard (Authentication → Providers)
- [ ] Buat `src/app/api/account/deactivate/route.ts` — soft delete akun (`is_active = false`)
- [ ] Test: register → login → redirect dashboard ✓
- [ ] Test: akses `/dashboard` tanpa login → redirect `/login` ✓

---

## Fase 3: Frontend & Core CRUD

### Komponen UI
- [ ] Buat `src/components/ui/Modal.tsx` — wrapper modal reusable
- [ ] Buat `src/components/ui/FAB.tsx` — floating action button
- [ ] Buat `src/components/ui/EmptyState.tsx` — tampilan saat belum ada task
- [ ] Buat `src/components/ui/Navbar.tsx` — header navigasi

### Komponen Tasks
- [ ] Buat `src/components/tasks/StatusBadge.tsx` — badge 4 status (to_do, done, hold, cancel)
- [ ] Buat `src/components/tasks/TaskCard.tsx` — card per task dengan checkbox done
- [ ] Buat `src/components/tasks/TaskGroup.tsx` — grouping task per hari
- [ ] Buat `src/components/tasks/Top3Highlight.tsx` — 3 task reminder terdekat
- [ ] Buat `src/components/tasks/AddTaskModal.tsx` — modal form tambah task
- [ ] Buat `src/components/tasks/EditTaskModal.tsx` — modal form edit task

### API Routes
- [ ] Buat `src/app/api/tasks/route.ts` — `GET` semua task, `POST` tambah task
- [ ] Buat `src/app/api/tasks/[id]/route.ts` — `PATCH` edit/update status task
- [ ] Pastikan `POST` task: set `next_remind_at = reminder_date` dan `reminder_count = 0`
- [ ] Pastikan `PATCH` task: jika `reminder_date` berubah, reset `next_remind_at` dan `reminder_count`

### Dashboard
- [ ] Buat `src/app/dashboard/page.tsx` — layout utama dengan semua komponen
- [ ] Implementasi grouping task per hari (`format(date, 'yyyy-MM-dd')`)
- [ ] Implementasi logic Top 3 Highlight (filter + sort ascending)
- [ ] Buat `src/app/page.tsx` — redirect ke `/dashboard`

### Testing CRUD
- [ ] Tambah task baru → muncul di dashboard dan Top 3 jika relevan
- [ ] Edit task → perubahan title/reminder/notes tersimpan
- [ ] Cancel task → status jadi `cancel`, tidak terhapus dari DB
- [ ] Tandai selesai dari checkbox → status jadi `done`, card jadi opacity
- [ ] Top 3 hanya tampilkan status `to_do` dan `hold`
- [ ] Grouping per hari benar (Hari Ini, Besok, dst)

---

## Fase 4: Integrasi Telegram Bot

### Setup Bot & Library
- [ ] Install `grammy` (sudah di fase 1, pastikan terinstall)
- [ ] Buat `src/lib/telegram/bot.ts` — instance grammY
- [ ] Buat `src/lib/telegram/reminder.ts` — `formatReminderMessage`, `getReminderInlineKeyboard`, `getNextRemindAt`

### Koneksi Akun Telegram
- [ ] Buat `src/app/api/telegram/connect/route.ts` — generate token unik, simpan ke `telegram_connections`
- [ ] Buat `src/components/telegram/TelegramConnect.tsx` — UI flow koneksi + tampilkan token
- [ ] Buat `src/components/telegram/TelegramStatus.tsx` — indikator connected/disconnected
- [ ] Buat `src/app/settings/telegram/page.tsx` — halaman settings koneksi Telegram

### Cron Trigger (Kirim Reminder)
- [ ] Buat `src/app/api/remind/route.ts` — query tasks jatuh tempo, kirim via Bot API, update DB
- [ ] Pastikan query: `next_remind_at <= NOW()`, status `to_do`, `is_connected = true`
- [ ] Pastikan update setelah kirim: increment `reminder_count`, set `last_reminded_at`, kalkulasi `next_remind_at` baru
- [ ] Pastikan `next_remind_at = null` jika sudah 24 jam (reminder berhenti)

### Webhook (Terima Callback)
- [ ] Buat `src/app/api/webhook/telegram/route.ts` — handle `/start <token>` dan `callback_query`
- [ ] Implementasi validasi `x-telegram-bot-api-secret-token` header
- [ ] Implementasi handler `/start <token>`: verifikasi token, update `is_connected = true`, simpan `telegram_chat_id`
- [ ] Implementasi handler `callback_query done:<taskId>`: update status task jadi `done`, edit pesan Telegram

### Testing Telegram
- [ ] Generate token di settings → kirim `/start <token>` ke bot → status "Terhubung"
- [ ] Buat task dengan reminder 1–2 menit ke depan → reminder diterima di Telegram
- [ ] Format pesan benar: judul bold, waktu, catatan, inline button
- [ ] Klik "✅ Tandai Selesai" di Telegram → status task `done` di app PWA
- [ ] Persistent: reminder ke-2 muncul 15 menit kemudian
- [ ] Reminder berhenti setelah task di-done atau 24 jam

---

## Fase 5: Cron, Testing & Deployment

### Cron Job (Upstash)
- [ ] Buat QStash schedule di Upstash: `POST https://your-app.vercel.app/api/remind` tiap `*/5 * * * *`
- [ ] Test cron trigger manual dari Upstash dashboard

### Register Webhook Telegram
- [ ] Deploy ke Vercel (staging/preview dulu)
- [ ] Jalankan `setWebhook` curl ke Telegram API dengan URL production dan secret token
- [ ] Verifikasi webhook aktif: `getWebhookInfo`

### Environment Variables Production
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL` di Vercel
- [ ] Set `NEXT_PUBLIC_SUPABASE_ANON_KEY` di Vercel
- [ ] Set `SUPABASE_SERVICE_ROLE_KEY` di Vercel
- [ ] Set `TELEGRAM_BOT_TOKEN` di Vercel
- [ ] Set `TELEGRAM_WEBHOOK_SECRET` di Vercel
- [ ] Set `NEXT_PUBLIC_APP_URL` di Vercel

### Testing End-to-End
- [ ] Auth flow lengkap: register → login → logout
- [ ] CRUD task lengkap dari browser mobile
- [ ] Reminder diterima di Telegram sesuai waktu
- [ ] Tandai selesai dari Telegram → update real-time di app
- [ ] Persistent reminder berjalan sesuai interval (15 menit → 1 jam)
- [ ] Reminder berhenti otomatis setelah 24 jam

### PWA
- [ ] Install prompt muncul di Android Chrome
- [ ] App bisa dibuka dari home screen (standalone mode)
- [ ] Load time dashboard < 1.5 detik

### Deploy Production
- [ ] `vercel --prod`
- [ ] Smoke test semua fitur di production URL
- [ ] Monitor Supabase logs & Upstash logs untuk error pertama

---

## Progress Tracker

| Fase | Total | Selesai | Status |
| :--- | :---: | :---: | :--- |
| Persiapan | 6 | 0 | ⬜ Belum mulai |
| Fase 1: Fondasi & Setup | 17 | 0 | ⬜ Belum mulai |
| Fase 2: Auth | 8 | 0 | ⬜ Belum mulai |
| Fase 3: Frontend & CRUD | 16 | 0 | ⬜ Belum mulai |
| Fase 4: Telegram | 17 | 0 | ⬜ Belum mulai |
| Fase 5: Deployment | 16 | 0 | ⬜ Belum mulai |
| **Total** | **80** | **0** | |
