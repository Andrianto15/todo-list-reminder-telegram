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

---

## Ringkasan Perubahan: Implementasi Design System Baru Berdasarkan DESIGN.md (v0.4.0)

### 1. Sinkronisasi Dokumen Desain
- Sinkronisasi token desain dari file root `DESIGN.md` ke `docs/DESIGN.md`.

### 2. Implementasi Token Desain & Tipografi (`src/app/globals.css` & `src/app/layout.tsx`)
- Pembaruan CSS custom properties `:root` dan `.dark`:
  - Primary: `#4682b4` (Steel Blue) dan hover `#36648b`.
  - Accent: `#0ea5e9` (Sky Glow) dan dark `#38bdf8`.
  - Surface: `#ffffff` (dark: `#0f172a`).
  - Border: `#e2e8f0` (dark: `#1e293b`).
  - Canvas Background: `#f8fafc` (dark: `#090d16`).
  - Foreground: `#0f172a` (dark: `#f8fafc`).
  - Text Muted: `#64748b` (dark: `#94a3b8`).
- Penerapan tipografi `Public Sans` dan `JetBrains Mono` serta type scale body `0.875rem` (14px).
- Penerapan shadow vocabulary (`card-rest`, `card-hover`, `modal-float`) dan radius tokens (`xs: 4px`, `sm: 0.375rem`, `md: 0.5rem`, `lg: 0.75rem`, `xl: 1rem`, `full: 9999px`).
- Penyesuaian form controls (input, textarea, select) dengan min-height 44px dan focus ring Steel Blue.

### 3. Komponen UI & Task (Mobile-first Prioritas)
- `Navbar.tsx`: Adaptasi background `#0f172a` dark mode, border `#e2e8f0`, logo container Steel Blue, dan 44px min tap targets.
- `Modal.tsx`: Elevasi modal float shadow, radius `rounded-xl`, dan keyboard accessibility (Escape key).
- `ConfirmDialog.tsx`: Pembaruan tombol aksi (Steel Blue & red), radius `rounded-lg`, dan 44px tap targets.
- `FAB.tsx`: Bentuk `rounded-full` pill floating action button dengan warna Steel Blue dan safe-area insets.
- `EmptyState.tsx`: Penyesuaian icon box `rounded-xl`, warna Steel Blue, dan tombol aksi 44px.
- `TaskSkeleton.tsx`: Penyesuaian border hairline `#e2e8f0` dan corner `rounded-xl`.
- `StatusBadge.tsx`: Badge pill `rounded-full`, tracking wide, font bold uppercase nano (`10px`), dan palet warna Steel Blue.
- `TaskStats.tsx`: Gradient kartu Steel Blue (`#4682b4` ke `#36648b`), Sky Glow progress bar, dan pill status.
- `Top3Highlight.tsx`: Card surface `rounded-xl`, Steel Blue highlight, dan typography hierarki.
- `TaskFilter.tsx`: Search input 44px, pill filter tabs `rounded-full` dengan badge count.
- `TaskCard.tsx`: Card `rounded-xl`, checkbox 44px hit bounds, action buttons 44px touch targets, dan border hover.
- `TaskGroup.tsx`: Header group tanggal dengan styling text muted dan font semibold.
- `AddTaskModal.tsx` & `EditTaskModal.tsx`: Form inputs 44px min height, labels semibold, dan primary button Steel Blue.

### 4. Halaman Aplikasi
- `src/app/dashboard/page.tsx`: Background canvas `#f8fafc` (dark: `#090d16`), tombol Load More Steel Blue dengan 44px tap target.
- `src/app/(auth)/login/page.tsx`: Card container `rounded-xl`, background canvas `#f8fafc`, input controls 44px, dan primary button.
- `src/app/(auth)/register/page.tsx`: Card container `rounded-xl`, background canvas `#f8fafc`, input controls 44px, dan primary button.
- `src/app/settings/telegram/page.tsx`: Background canvas, token box `rounded-xl`, dan tombol aksi Steel Blue.

### 5. Verifikasi & Testing
- Unit tests `tests/designTokens.test.ts` diperbarui untuk memvalidasi token baru.
- Seluruh 5 test suites lulus: **33/33 tests passed**.
- Pemeriksaan linter ESLint: **0 errors**.
- Production build Next.js: **berhasil (exit code 0)**.

### 6. Dokumentasi
- Update `docs/PRD.md` ke versi 3.6 (FR-1.4 dan Changelog).
