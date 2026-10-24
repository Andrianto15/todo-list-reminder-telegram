# Security Audit Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Memperbaiki celah keamanan teridentifikasi pada API routes, Telegram reminder formatting, sanitasi input, dan proteksi HTTP headers.

**Architecture:** Menerapkan otentikasi secret token pada `/api/remind` (Cron Upstash), escaping HTML entities pada pesan Telegram di `reminder.ts`, allowlist payload di `/api/tasks/[id]`, penguatan validasi secret webhook Telegram dengan timing-safe comparison, serta konfigurasi HTTP security headers pada `next.config.ts`.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Supabase SSR/JS, crypto (Node.js stdlib), Jest.

**Spec:** Dokumen `docs/PRD.md` (bagian 5 NFR Security & bagian 6 API Routes) serta temuan audit keamanan berbasis source code.

## Global Constraints

- Tetap mempertahankan backwards compatibility dengan Upstash Cron dan Telegram Bot API.
- Seluruh unit test Jest harus tetap 100% pass sebelum commit.
- Tidak menambahkan dependency eksternal baru jika dapat diselesaikan dengan standard library Node.js / Next.js (`crypto`, stdlib).
- Menjaga kepatuhan aturan Caveman dan AGENTS.md.

## Review Focus

1. Unauthenticated invocation pada `/api/remind` yang dapat memicu spam atau denial of service.
2. Karakter HTML khusus (`<`, `>`, `&`) pada judul atau catatan task yang menyebabkan Telegram API menolak pengiriman pesan (400 Bad Request) dan stuck looping.
3. Mass assignment / field injection pada PATCH `/api/tasks/[id]` yang berpotensi mengubah kolom sensitif.
4. Nilai `TELEGRAM_WEBHOOK_SECRET` kosong atau tidak terkonfigurasi yang berisiko bypass autentikasi webhook.
5. Ketiadaan HTTP security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) pada response aplikasi.

---

### Task 1: HTML Entity Escaping pada Telegram Reminder

**Files:**
- Modify: `src/lib/telegram/reminder.ts`
- Test: `tests/reminder.test.ts`

**Interfaces:**
- Produces: `escapeHtml(text: string): string`
- Updates: `formatReminderMessage(task: Task): string` untuk meng-escape `task.title` dan `task.notes`

- [x] **Step 1: Write the failing test**
Tambahkan test di `tests/reminder.test.ts` yang memverifikasi bahwa karakter `<test>`, `&`, `"`, dan `'` pada title dan notes task di-escape menjadi entity HTML (`&lt;`, `&gt;`, `&amp;`, `&quot;`, `&#39;`) sehingga pesan Telegram valid dan aman dari injeksi tag.

- [x] **Step 2: Run test to verify it fails**
Run: `npm test tests/reminder.test.ts`
Expected: FAIL karena helper escape belum diimplementasikan.

- [x] **Step 3: Implement `escapeHtml` & update `formatReminderMessage` in `src/lib/telegram/reminder.ts`**
Implementasikan fungsi utilitas murni `escapeHtml` dan terapkan pada `task.title` serta `task.notes` sebelum dirakit ke template pesan Telegram.

- [x] **Step 4: Run test to verify it passes**
Run: `npm test tests/reminder.test.ts`
Expected: PASS.

- [x] **Step 5: Commit**
```bash
git add src/lib/telegram/reminder.ts tests/reminder.test.ts
git commit -m "fix(security): escape html entities in telegram reminder messages"
```

---

### Task 2: Proteksi Autentikasi Secret Token pada `/api/remind`

**Files:**
- Modify: `src/app/api/remind/route.ts`
- Test: `tests/apiRemindAuth.test.ts`

**Interfaces:**
- Consumes: Header `Authorization: Bearer <CRON_SECRET>` atau header `x-cron-secret` dari request.
- Produces: Return 401 Unauthorized jika secret tidak valid atau tidak cocok dengan `process.env.CRON_SECRET`.

- [x] **Step 1: Write the failing test**
Buat test di `tests/apiRemindAuth.test.ts` yang memvalidasi fungsi autentikasi token cron: menolak request tanpa header, menolak request dengan secret salah, dan menerima request dengan secret yang benar.

- [x] **Step 2: Run test to verify it fails**
Run: `npm test tests/apiRemindAuth.test.ts`
Expected: FAIL.

- [x] **Step 3: Implement cron secret verification in `src/app/api/remind/route.ts`**
Tambahkan verifikasi `CRON_SECRET` sebelum menjalankan query database dan pengiriman Telegram. Dukung format header `authorization` (`Bearer <token>`) dan `x-cron-secret`.

- [x] **Step 4: Run test to verify it passes**
Run: `npm test tests/apiRemindAuth.test.ts`
Expected: PASS.

- [x] **Step 5: Commit**
```bash
git add src/app/api/remind/route.ts tests/apiRemindAuth.test.ts
git commit -m "fix(security): require cron secret authorization on remind endpoint"
```

---

### Task 3: Input Allowlisting & Mass Assignment Guard pada PATCH `/api/tasks/[id]`

**Files:**
- Modify: `src/app/api/tasks/[id]/route.ts`
- Test: `tests/taskApiSecurity.test.ts`

**Interfaces:**
- Consumes: Request body JSON dengan field parsial task.
- Produces: Sanitized update object yang hanya memperbolehkan field: `title`, `notes`, `status`, `reminder_date`. Field berbahaya seperti `user_id`, `id`, `created_at` diabaikan atau ditolak.

- [x] **Step 1: Write the failing test**
Buat unit test di `tests/taskApiSecurity.test.ts` yang memvalidasi bahwa hanya allowed fields yang diproses untuk update dan field terlarang seperti `user_id` tidak diizinkan masuk ke query update.

- [x] **Step 2: Run test to verify it fails**
Run: `npm test tests/taskApiSecurity.test.ts`
Expected: FAIL.

- [x] **Step 3: Implement payload allowlisting in `src/app/api/tasks/[id]/route.ts`**
Ekstrak hanya field yang valid dari request body ke dalam payload bersih sebelum dikirimkan ke `.update(sanitizedPayload)`.

- [x] **Step 4: Run test to verify it passes**
Run: `npm test tests/taskApiSecurity.test.ts`
Expected: PASS.

- [x] **Step 5: Commit**
```bash
git add src/app/api/tasks/[id]/route.ts tests/taskApiSecurity.test.ts
git commit -m "fix(security): prevent mass assignment in task update endpoint"
```

---

### Task 4: Penguatan Validasi Secret Token Webhook Telegram

**Files:**
- Modify: `src/app/api/webhook/telegram/route.ts`
- Test: `tests/telegramWebhookSecurity.test.ts`

**Interfaces:**
- Consumes: Header `x-telegram-bot-api-secret-token`.
- Produces: Verifikasi konstan/timing-safe (`crypto.timingSafeEqual`) dan penanganan error aman pada parsing JSON payload.

- [x] **Step 1: Write the failing test**
Buat test di `tests/telegramWebhookSecurity.test.ts` yang menguji:
1. Rejection jika `TELEGRAM_WEBHOOK_SECRET` di server belum diset/kosong.
2. Rejection jika token di header tidak cocok.
3. Safe error handling jika body request bukan JSON valid.

- [x] **Step 2: Run test to verify it fails**
Run: `npm test tests/telegramWebhookSecurity.test.ts`
Expected: FAIL.

- [x] **Step 3: Implement safe webhook validation in `src/app/api/webhook/telegram/route.ts`**
Gunakan `crypto.timingSafeEqual` untuk komparasi token, pastikan environment variable `TELEGRAM_WEBHOOK_SECRET` terdefinisi, dan bungkus `request.json()` dalam blok `try/catch`.

- [x] **Step 4: Run test to verify it passes**
Run: `npm test tests/telegramWebhookSecurity.test.ts`
Expected: PASS.

- [x] **Step 5: Commit**
```bash
git add src/app/api/webhook/telegram/route.ts tests/telegramWebhookSecurity.test.ts
git commit -m "fix(security): strengthen webhook token validation and json parsing"
```

---

### Task 5: Konfigurasi HTTP Security Headers di `next.config.ts`

**Files:**
- Modify: `next.config.ts`
- Test: `tests/securityHeaders.test.ts`

**Interfaces:**
- Produces: HTTP response headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`).

- [x] **Step 1: Write the failing test**
Buat test di `tests/securityHeaders.test.ts` yang mengimpor konfigurasi Next.js dan memverifikasi array `headers()` memuat security headers yang wajib.

- [x] **Step 2: Run test to verify it fails**
Run: `npm test tests/securityHeaders.test.ts`
Expected: FAIL.

- [x] **Step 3: Implement `headers()` in `next.config.ts`**
Tambahkan method async `headers()` pada `nextConfig` yang mengembalikan header keamanan standar industri.

- [x] **Step 4: Run test to verify it passes**
Run: `npm test tests/securityHeaders.test.ts`
Expected: PASS.

- [x] **Step 5: Commit**
```bash
git add next.config.ts tests/securityHeaders.test.ts
git commit -m "fix(security): add standard http security headers"
```

---

### Task 6: Sinkronisasi Dokumentasi PRD & Changelog

**Files:**
- Modify: `docs/PRD.md`
- Create: `changelogs/CHANGELOG_24_10_2026.md`

- [x] **Step 1: Update `docs/PRD.md`**
Perbarui PRD di bagian NFR Security, Environment Variables (`CRON_SECRET`), dan dokumentasi API routes `/api/remind` serta webhook validation.

- [x] **Step 2: Update/create `changelogs/CHANGELOG_24_10_2026.md`**
Dokumentasikan ringkasan perbaikan audit keamanan (remediation) sesuai format tanggal proyek.

- [x] **Step 3: Run all test suites**
Run: `npm test`
Expected: 100% tests pass.

- [x] **Step 4: Commit**
```bash
git add docs/PRD.md changelogs/
git commit -m "docs: update PRD and changelog for security audit remediation"
```
