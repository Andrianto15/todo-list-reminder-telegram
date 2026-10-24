# Changelog - 25/10/2026

## Ringkasan Perubahan: Implementasi Footer Aplikasi & Copyright Halaman Login

### 1. Komponen Footer Aplikasi (`src/components/ui/Footer.tsx`)
- Membuat komponen `Footer` reusable dan mobile-first dengan styling token semantik:
  - Informasi hak cipta: `© 2026 Andrianto Nur Iskandar. All rights reserved.`
  - Label lisensi open-source: `MIT License`.
  - Informasi versi aplikasi otomatis dari `package.json`: `v{packageJson.version}`.
  - Border hairline semantik `border-border` dan warna teks tersier `text-muted`.
  - Tata letak responsif: kolom terpusat di layar mobile (`flex-col text-center`) dan sejajar horizontal di layar desktop (`sm:flex-row sm:text-left`).

### 2. Integrasi Halaman Aplikasi
- `src/app/dashboard/page.tsx`:
  - Menghubungkan komponen `Footer` di bagian bawah halaman.
  - Mengonfigurasi layout fleksibel (`flex flex-col min-h-screen` dan `flex-1 w-full`) agar footer selalu menempati bagian dasar tampilan secara stabil tanpa mengganggu tombol Floating Action Button (FAB).
- `src/app/settings/telegram/page.tsx`:
  - Menghubungkan komponen `Footer` di bagian bawah halaman pengaturan integrasi Telegram.
  - Mempertahankan layout responsif dengan sticky bottom alignment.

### 3. Penambahan Copyright Halaman Login (`src/app/(auth)/login/page.tsx`)
- Menambahkan informasi hak cipta (`© 2026 Andrianto Nur Iskandar. All rights reserved.`) berdampingan dengan versi rilis aplikasi (`v{packageJson.version}`) di bagian bawah kartu login.

### 4. Automated Testing & Verifikasi
- Menambahkan test suite baru `tests/footer.test.ts` (5 tests):
  - Memverifikasi keberadaan file komponen dan ekspor `Footer`.
  - Memverifikasi rendering teks copyright, lisensi, versi, dan class styling semantik pada komponen `Footer`.
  - Memverifikasi rendering teks copyright dan nomor versi pada `LoginPage`.
  - Memverifikasi impor dan pemanggilan komponen `Footer` di `DashboardPage` dan `TelegramSettingsPage`.
- Memperbarui type-checking assertions pada `tests/securityHeaders.test.ts` agar kompatibel dengan strict TypeScript.
- Menjalankan seluruh test suites: **16 test suites, 77 automated unit tests passed (100%)**.
- Menjalankan linter ESLint: **0 errors, 0 warnings**.
- Menjalankan TypeScript typecheck: **0 errors**.
- Menjalankan build produksi Next.js: **berhasil (exit code 0)**.

### 5. Dokumentasi
- Memperbarui `docs/PRD.md` ke versi 3.13 dengan penambahan requirement FR-1.5 serta catatan changelog.
