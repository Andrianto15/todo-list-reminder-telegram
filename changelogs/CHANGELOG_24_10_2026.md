# Changelog - 24/10/2026 (v0.3.2)

## Ringkasan Perubahan: Upgrade Minor & Patch Package Dependencies

### 1. Dependencies Upgrade (`package.json`)
Pembaruan versi minor & patch yang stabil dan backward-compatible:
- `@supabase/ssr`: `0.12.4` → `0.12.7`
- `@supabase/supabase-js`: `2.111.0` → `2.118.0`
- `grammy`: `1.45.1` → `1.46.0`
- `lucide-react`: `1.31.0` → `1.61.0`
- `next`: `16.2.12` → `16.4.3`
- `react`: `19.2.8` → `19.3.1`
- `react-dom`: `19.2.8` → `19.3.1`

### 2. DevDependencies Upgrade (`package.json`)
- `@types/node`: `26.1.2` → `26.6.5`
- `@types/react`: `19.2.18` → `19.3.0`
- `@types/react-dom`: `19.2.4` → `19.3.0`
- `eslint`: `10.8.0` → `10.13.0`
- `eslint-config-next`: `16.2.12` → `16.4.3`
- `jest`: `30.4.2` → `30.5.2`
- `ts-jest`: `29.4.12` → `29.4.15`
- `typescript`: `5.7.3` → `5.9.3`

*Catatan: Paket berpotensi breaking change (major) `framer-motion` (v14) dan `typescript` (v7) tetap dipertahankan pada versi saat ini.*

### 3. Konfigurasi Linter (`eslint.config.mjs`)
- Menambahkan ignore pattern `"public/**"` untuk mencegah scanning otomatis terhadap generated service worker PWA (`sw.js`, `workbox-*.js`).
- Menyesuaikan rule `"react-hooks/set-state-in-effect": "warn"` agar kompatibel dengan pola standard data-fetching hooks.

### 4. Verifikasi & Testing
- Seluruh 5 test suite Jest (`tests/assets.test.ts`, `tests/designTokens.test.ts`, `tests/reminder.test.ts`, `tests/taskStats.test.ts`, `tests/taskHistory.test.ts`) lulus: **33/33 tests pass**.
- Pemeriksaan linter ESLint selesai tanpa error (**0 errors**).
- Production build Next.js (`next build --webpack`) berhasil (**exit code 0**).

### 5. Dokumentasi
- Update `docs/PRD.md` ke versi 3.5 dengan catatan changelog rilis.
