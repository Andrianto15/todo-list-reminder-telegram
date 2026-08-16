# Changelog

## 16/08/2026 - v0.2.4

- **Task Summary Filter & Total Done Badge**:
  - Filter summary progres hanya menghitung task hari ini + task sebelum/sesudahnya yang belum `done`.
  - Tambah badge terpisah untuk menampilkan total seluruh task yang berstatus `done`.
  - Tambah unit test Jest di `tests/taskStats.test.ts`.
  - Update `docs/PRD.md` (FR-3.3).

## 16/08/2026 - v0.2.3

- **Refactor Reminder Interval & Limit**:
  - Ubah interval pengingat persisten menjadi tetap setiap 1 jam (menghapus fase 4x 15 menit).
  - Batasi batas waktu pengingat maksimal 6 jam atau maksimal 6 kali pengiriman.
- **Testing**:
  - Konfigurasi Jest dan `ts-jest` untuk automated testing.
  - Tambah unit test untuk helper telegram reminder di `tests/reminder.test.ts`.
- **Documentation**:
  - Update `docs/PRD.md` (FR-4.3 & Catatan Teknis) menyesuaikan aturan interval 1 jam dan batas maksimal 6 jam/6x pengingat.
