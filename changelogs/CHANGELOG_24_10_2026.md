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

---

## Ringkasan Perubahan: Impeccable Audit Technical Remediation

### 1. Aksesibilitas Form & Dialog (WCAG 2.1 AA)
- Menambahkan atribut `id` dan `htmlFor` pada seluruh kontrol form: `AddTaskModal.tsx`, `EditTaskModal.tsx`, `src/app/(auth)/login/page.tsx`, dan `src/app/(auth)/register/page.tsx`.
- Menambahkan accessible label `aria-label="Cari tugas"` pada input pencarian `TaskFilter.tsx`.
- Menerapkan keyboard focus trap loop (Tab / Shift+Tab) dan auto-focus restoration pada `Modal.tsx` saat dialog dibuka dan ditutup.
- Menambahkan semantik ARIA:
  - `role="progressbar"`, `aria-valuenow`, `aria-valuemin={0}`, `aria-valuemax={100}` pada `TaskStats.tsx`.
  - `role="tablist"` dan `role="tab"` dengan `aria-selected` pada filter tabs `TaskFilter.tsx`.
  - `role="checkbox"` dan `aria-checked` pada tombol toggle status task di `TaskCard.tsx`.
  - Standardisasi label tombol tema menjadi `aria-label="Ubah Tema"` di `Navbar.tsx`.

### 2. Motion Sensitivity & Kontras Warna
- Mengganti aturan global `0.01ms !important` kill di `globals.css` dengan durasi intentional `0.08s` pada `@media (prefers-reduced-motion: reduce)` guna mempertahankan feedback visual saat pergantian status.
- Memperbaiki rasio kontras teks status badge agar melampaui ambang batas WCAG AA (≥ 4.5:1):
  - Badge `to_do` menggunakan teks `#2b5373` pada background `#eef5fa` (~7.5:1).
  - Badge `hold` menggunakan teks `text-amber-800` pada background `bg-amber-50` (~6.2:1).
  - Badge reminder count di `TaskCard.tsx` diperbarui ke `text-amber-800`.
  - Inactive pill count badge di `TaskFilter.tsx` diperbarui ke `text-[#334155]`.

### 3. Theming & Token Semantik
- Mengganti kelas warna hex manual pada canvas root dan navbar (`layout.tsx`, `dashboard/page.tsx`, `Navbar.tsx`) dengan token semantik Tailwind v4 (`bg-background`, `bg-surface`, `text-foreground`, `border-border`).

### 4. Performa, Tipografi, & Responsiveness
- Migrasi external `<link>` Google Fonts di `layout.tsx` ke native `next/font/google` (`Public_Sans`, `JetBrains_Mono`) dengan variabel CSS `--font-public-sans` dan `--font-jetbrains-mono` (mengeliminasi render-blocking network requests dan warning `@next/next/no-page-custom-font`).
- Memperbaiki warning cascading render (`react-hooks/set-state-in-effect`) pada `useTheme.ts`, `useTasks.ts`, dan `useTelegram.ts`.
- Meningkatkan touch target filter pills di `TaskFilter.tsx` dari `min-h-[40px]` menjadi `min-h-[44px]`.

### 5. Verifikasi & Testing
- Menambahkan 3 test suite baru:
  - `tests/auditAccessibility.test.ts` (8 tests)
  - `tests/auditContrast.test.ts` (3 tests)
  - `tests/auditPerformance.test.ts` (2 tests)
- Seluruh 8 test suites lulus: **46/46 tests passed (100%)**.
- Pemeriksaan linter ESLint: **0 errors, 0 warnings**.
- Mechanical detector Impeccable: **0 violations (`[]`)**.
- Next.js production build (`npm run build`): **berhasil (exit code 0)**.

---

## Ringkasan Perubahan: Impeccable Polish Pass (v0.4.2)

### 1. Themed Browser Surfaces
- Menambahkan styling seleksi teks bertema di `src/app/globals.css`:
  - `::selection`: background semi-transparan Steel Blue (`rgba(70, 130, 180, 0.25)`).
  - `caret-color: var(--primary)` pada semua text input dan textarea guna memperkuat identitas brand saat interaksi input aktif.

### 2. Standardisasi Token Semantik Komponen
- Menyelesaikan propagasi utility class semantik pada sisa komponen utilitas:
  - `ConfirmDialog.tsx`: Dialog background menggunakan `text-foreground`, border `border-border`, dan tombol batal menggunakan `hover:bg-slate-100 dark:hover:bg-slate-800`.
  - `EmptyState.tsx`: Penyesuaian container dan border dengan `border-border`, judul `text-foreground`, deskripsi `text-muted`.
  - `Top3Highlight.tsx`: Card surface `bg-surface`, border `border-border`, label judul `text-foreground`, dan badge rank `text-primary`.
  - `src/app/settings/telegram/page.tsx`: Background canvas `bg-background`, teks `text-foreground`, token card `bg-surface border-border`, dan deskripsi `text-muted`.

### 3. Verifikasi & Testing
- Menambahkan test suite baru `tests/auditPolish.test.ts` (3 tests) untuk memverifikasi rule seleksi browser, caret color, dan propagasi token semantik pada dialog dan empty state.
- Seluruh 9 test suites lulus: **49/49 tests passed (100%)**.
- Mechanical detector Impeccable: **0 violations (`[]`)**.
- Pemeriksaan linter ESLint: **0 errors, 0 warnings**.


