# Menambahkan Lisensi MIT Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menambahkan lisensi MIT resmi ke repositori `todo-list-reminder-telegram`, memperbarui metadata `package.json`, dokumentasi `README.md` & `docs/PRD.md`, membuat unit test verifikasi, dan mencatat ringkasan ke `changelogs/CHANGELOG_25_10_2026.md`.

---

## Proposed Changes

### 1. File Lisensi Root
- Buat file `LICENSE` baru di root repositori dengan teks lisensi MIT standar:
  - Tahun: 2026
  - Pemegang Hak Cipta: Andrianto Nur Iskandar

### 2. Konfigurasi `package.json`
- Tambahkan field `"license": "MIT"`.

### 3. Dokumentasi
- **`README.md`**: Tambahkan bagian Lisensi di bagian akhir dokumen yang menyatakan proyek ini berlisensi MIT di bawah hak cipta Andrianto Nur Iskandar.
- **`docs/PRD.md`**: Perbarui changelog dokumen ke versi 3.12 untuk mencatat penambahan lisensi MIT resmi dan metadata hak cipta proyek.
- **`changelogs/CHANGELOG_25_10_2026.md`**: Buat ringkasan perubahan tertanggal 25-10-2026 sesuai aturan nomor 10.

### 4. Unit Test Otomatis
- **`tests/license.test.ts`**:
  - Verifikasi eksistensi file `LICENSE`.
  - Verifikasi konten lisensi mengandung teks lisensi MIT dan nama copyright holder.
  - Verifikasi properti `license` di `package.json` bernilai `MIT`.
  - Verifikasi `README.md` memuat referensi lisensi MIT.

---

## Plan Tasks

### Task 1: TDD Unit Test Lisensi
- [x] Buat file test `tests/license.test.ts` yang menguji keberadaan file `LICENSE`, isi lisensi MIT, properti `package.json`, dan bagian lisensi di `README.md`.
- [x] Jalankan `npm test` untuk memastikan test gagal (Red phase).

### Task 2: Implementasi File Lisensi & Metadata
- [x] Buat file `LICENSE` dengan teks lisensi MIT dan copyright 2026 Andrianto Nur Iskandar.
- [x] Perbarui `package.json` dengan `"license": "MIT"`.
- [x] Perbarui `README.md` dengan seksi Lisensi.
- [x] Jalankan `npm test` untuk memastikan test berhasil (Green phase).

### Task 3: Pembaruan Dokumentasi & Changelog
- [x] Perbarui `docs/PRD.md` (tambahkan changelog v3.12).
- [x] Buat `changelogs/CHANGELOG_25_10_2026.md` sesuai format aturan repositori.
- [x] Jalankan `npm test` dan `npm run lint` untuk verifikasi menyeluruh.
