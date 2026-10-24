# Changelog - 25/10/2026 (v0.4.6)

## Ringkasan Perubahan: Penambahan Lisensi MIT

### 1. Lisensi Open Source (`LICENSE`)
- Menambahkan file `LICENSE` resmi di root direktori dengan standar MIT License:
  - Tahun: 2026
  - Pemegang Hak Cipta: Andrianto Nur Iskandar

### 2. Metadata Package (`package.json`)
- Menambahkan properti `"license": "MIT"`.

### 3. Dokumentasi (`README.md` & `docs/PRD.md`)
- **`README.md`**: Menambahkan seksi "Lisensi" di bagian penutup yang mereferensikan file `LICENSE`.
- **`docs/PRD.md`**: Memperbarui status versi PRD menjadi v3.12 bertanggal 25 Oktober 2026 dengan ringkasan pembaruan lisensi MIT.

### 4. Unit Testing (`tests/license.test.ts`)
- Menambahkan test suite baru untuk memvalidasi:
  - Keberadaan file `LICENSE` beserta klausul legal standar MIT dan nama copyright holder.
  - Kesesuaian field `license` pada `package.json`.
  - Keberadaan seksi lisensi pada `README.md`.
- Status pengujian: 15 test suites passed (72 automated unit tests pass).
