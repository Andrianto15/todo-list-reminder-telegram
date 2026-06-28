# Summaries: Brainstorming Session — To-Do Reminder PWA

**Tanggal:** Juni 2026
**Metode:** AI-assisted brainstorming (Claude)

---

## 1. Latar Belakang Proyek

Proyek ini adalah aplikasi **To-Do Reminder** berbasis **Progressive Web App (PWA)** yang terintegrasi dua arah dengan **Telegram Bot**. Tujuannya membangun task manager yang ringan dan frictionless, di mana notifikasi reminder dikirim langsung ke Telegram user — dan user bisa menandai task selesai langsung dari Telegram tanpa perlu membuka app.

---

## 2. Keputusan Desain dari Sesi Brainstorming

### 2.1 Scope & User
| Pertanyaan | Keputusan |
| :--- | :--- |
| Untuk siapa? | **Multi-user** — tiap user punya akun, data, dan Telegram sendiri |
| Kolaborasi / share task? | **Tidak** — strictly personal task manager |

### 2.2 Autentikasi
| Pertanyaan | Keputusan |
| :--- | :--- |
| Metode login | **Email + Password** dan **Google OAuth** via Supabase Auth |
| Hapus akun | **Soft delete** — set `is_active = false`, data tidak dihapus |

### 2.3 Koneksi Telegram
| Pertanyaan | Keputusan |
| :--- | :--- |
| Flow koneksi | **Fleksibel** — ditentukan saat implementasi. Kandidat: generate token di app → user kirim ke bot → bot verifikasi & simpan `telegram_chat_id` |

### 2.4 Reminder
| Pertanyaan | Keputusan |
| :--- | :--- |
| Reminder per task | **Satu** `reminder_date` per task |
| Persistent reminder | **Ya** — reminder dikirim ulang sampai user klik selesai |
| Interval | **15 menit** selama 1 jam pertama → **1 jam** setelahnya |
| Batas maksimal | **24 jam** sejak reminder pertama, lalu otomatis berhenti |
| Tandai selesai | Bisa dari **app PWA** atau langsung dari **Telegram** (inline button) |

---

## 3. Arsitektur Sistem

```
User (Browser/Mobile)
  └── Next.js PWA (Vercel)
        ├── Supabase Auth     → Login Email + Google OAuth
        ├── Supabase PostgreSQL → Tabel: users, tasks, telegram_connections
        ├── Supabase Edge Functions → send-reminder, webhook handler
        └── API Routes Next.js → /api/tasks, /api/webhook/telegram

Cron Job (Upstash Workflow, tiap 1-5 menit)
  └── Query tasks WHERE next_remind_at <= NOW() AND status IN ('to_do','hold')
        └── Edge Function → format pesan HTML → kirim via Telegram Bot API
              └── Update next_remind_at di DB

Telegram Bot (grammY)
  └── Kirim reminder → Inline button "✅ Tandai Selesai"
        └── User klik → callback_query → Webhook → update status = done → konfirmasi
```

---

## 4. Data Model (Ringkasan)

### Tabel `users`
- `id`, `email`, `full_name`, `avatar_url`, `provider` (email/google)
- `is_active`, `deactivated_at` — untuk soft delete
- `created_at`

### Tabel `tasks`
- `id`, `user_id` (FK), `title`, `notes`, `status`
- `reminder_date` — waktu reminder pertama
- `next_remind_at` — waktu reminder berikutnya *(tambahan vs PRD awal)*
- `reminder_count` — berapa kali sudah dikirimi *(tambahan vs PRD awal)*
- `last_reminded_at` — timestamp reminder terakhir *(tambahan vs PRD awal)*
- `created_at`, `updated_at`

### Tabel `telegram_connections`
- `id`, `user_id` (FK), `telegram_chat_id`
- `connect_token` — untuk verifikasi koneksi
- `is_connected`, `connected_at`, `created_at`

> **Catatan:** Tabel `telegram_connections` dipisah dari `users` untuk desain yang lebih clean dan mudah di-extend.

---

## 5. Komponen Frontend (Next.js App Router)

### Halaman
| Route | Deskripsi |
| :--- | :--- |
| `/(auth)/login` | Form login Email + Google OAuth |
| `/(auth)/register` | Form register Email baru |
| `/dashboard` | Halaman utama — Top 3 Highlight + TaskGroup per hari |
| `/settings/telegram` | Koneksi & status akun Telegram |

### Komponen Utama
| Komponen | Fungsi |
| :--- | :--- |
| `Top3Highlight` | Tampilkan 3 task dengan reminder terdekat (status bukan done) |
| `TaskGroup` | Grouping task per hari |
| `TaskCard` | Card per task — title, status, reminder time |
| `StatusBadge` | Badge warna untuk 4 status: to_do, done, hold, cancel |
| `FAB + AddTask` | Floating button + modal form tambah task |
| `EditTask` | Modal edit task yang belum done/cancel |
| `TelegramConnect` | Flow koneksi akun Telegram |
| `TelegramStatus` | Indikator connected/disconnected |

### API Routes
| Route | Method | Fungsi |
| :--- | :--- | :--- |
| `/api/tasks` | GET, POST | Ambil semua task user / tambah task baru |
| `/api/tasks/[id]` | PATCH | Edit atau update status task |
| `/api/webhook/telegram` | POST | Terima callback_query dari Telegram |

---

## 6. Flow Telegram Bot

### Kirim Reminder
1. Cron Job (Upstash) trigger tiap 1–5 menit
2. Query DB: tasks dengan `next_remind_at <= NOW()`, status `to_do` atau `hold`
3. Edge Function format pesan HTML + inline button
4. Kirim via Telegram Bot API
5. Update `next_remind_at`, `reminder_count`, `last_reminded_at` di DB

### Terima Callback (User Tandai Selesai)
1. User klik "✅ Tandai Selesai" di Telegram
2. Telegram kirim `callback_query` berisi task ID ke webhook
3. Edge Function validasi secret token
4. Update `status = done` di DB
5. Edit pesan Telegram → konfirmasi selesai

---

## 7. Milestones

| Fase | Scope | Estimasi |
| :--- | :--- | :--- |
| Fase 1 | Fondasi & Setup | ~1 minggu |
| Fase 2 | Auth & Manajemen Akun | ~1 minggu |
| Fase 3 | Frontend & Core CRUD | ~2 minggu |
| Fase 4 | Integrasi Telegram Bot | ~1 minggu |
| Fase 5 | Cron Job, Testing & Deployment | ~1 minggu |
| **Total** | | **~6 minggu** |

---

## 8. Perubahan dari PRD Awal

| Aspek | PRD Awal | Keputusan Baru |
| :--- | :--- | :--- |
| User scope | Tidak disebutkan | Multi-user eksplisit |
| Auth | Tidak disebutkan | Email/Password + Google OAuth |
| Hapus akun | Tidak ada | Soft delete (`is_active = false`) |
| Reminder | Satu kali di `reminder_date` | Persistent: 15 menit → 1 jam, maks 24 jam |
| Data model `tasks` | 8 kolom | +3 kolom: `next_remind_at`, `reminder_count`, `last_reminded_at` |
| `telegram_chat_id` | Di tabel `users` | Dipisah ke tabel `telegram_connections` |
