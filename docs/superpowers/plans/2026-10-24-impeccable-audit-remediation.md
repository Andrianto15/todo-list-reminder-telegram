# Impeccable Audit Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve all 9 technical quality issues identified in `/impeccable audit` across accessibility, theming, performance, and responsive design, raising the audit score from 13/20 to 19+/20.

**Architecture:** Standardize semantic design tokens in Tailwind v4 and CSS variables; migrate external Google Fonts to `next/font/google` for zero-CLS self-hosting; enforce WCAG AA accessibility (form labeling with `htmlFor`/`id`, dialog focus trapping, ARIA roles, contrast thresholds ≥4.5:1, and intentional reduced motion); and expand Jest unit test suite.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion, Jest, Sonner, Lucide React.

**Spec:** Codebase audit findings from `/impeccable audit` on 2026-10-24 and [DESIGN.md](file:///Users/andriantonuriskandar/Documents/Playground/todo-list-reminder-telegram/DESIGN.md).

## Global Constraints

- Preserve all existing functionality and mobile-first layout priorities.
- Maintain existing test suite passing at 100% (all existing 33 tests must continue to pass).
- Strictly adhere to WCAG 2.1 AA standards for contrast (≥ 4.5:1 for normal/small text) and interactive touch targets (≥ 44x44px).
- Zero ESLint warnings (`eslint` must report 0 errors and 0 warnings).
- Follow anti-slop guidelines: no generic filler comments or unnecessary abstractions.

## Review Focus

1. Modal dialog keyboard navigation: Tab must not escape modal, Escape must close, and focus must return to trigger button upon close.
2. Form fields across auth pages and task modals: Every input/textarea/select must have a distinct `id` paired with `htmlFor` on its label.
3. Contrast on status badges: Text on `to_do`, `hold`, and counter pills must meet ≥4.5:1 against light-mode backgrounds.
4. Next.js font rendering: `next/font/google` must replace `<link>` in `layout.tsx` without breaking layout or CSS font variables.
5. React hook mounting: Initial state initialization must not trigger cascading render warnings in ESLint.

---

### Task 1: Accessibility & Form Semantics

**Files:**
- Modify: `src/components/tasks/AddTaskModal.tsx`
- Modify: `src/components/tasks/EditTaskModal.tsx`
- Modify: `src/app/(auth)/login/page.tsx`
- Modify: `src/app/(auth)/register/page.tsx`
- Modify: `src/components/tasks/TaskFilter.tsx`
- Modify: `src/components/tasks/TaskCard.tsx`
- Modify: `src/components/tasks/TaskStats.tsx`
- Modify: `src/components/ui/Navbar.tsx`
- Modify: `src/components/ui/Modal.tsx`
- Modify: `src/app/globals.css`
- Test: `tests/auditAccessibility.test.ts`

- [ ] **Step 1: Write unit tests verifying accessible attributes and roles**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement accessible form labeling, dialog focus trap, ARIA semantics, and intentional motion in `globals.css`**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Verify all existing Jest tests still pass**

---

### Task 2: Badge Contrast Ratios & Semantic Theming Tokens

**Files:**
- Modify: `src/components/tasks/StatusBadge.tsx`
- Modify: `src/components/tasks/TaskCard.tsx`
- Modify: `src/components/tasks/TaskFilter.tsx`
- Modify: `src/app/dashboard/page.tsx`
- Modify: `src/components/ui/Navbar.tsx`
- Modify: `src/app/layout.tsx`
- Test: `tests/auditContrast.test.ts`

- [ ] **Step 1: Write unit tests verifying contrast values and semantic token classes**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Update badge colors to achieve ≥4.5:1 contrast and replace hard-coded hexes with semantic tokens**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Verify all Jest tests pass**

---

### Task 3: Performance, Google Fonts Migration & Hook Refactoring

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/hooks/useTheme.ts`
- Modify: `src/hooks/useTasks.ts`
- Modify: `src/hooks/useTelegram.ts`
- Modify: `src/components/tasks/TaskFilter.tsx`
- Test: `tests/auditPerformance.test.ts`

- [ ] **Step 1: Write unit tests verifying `next/font/google` integration and 44px touch targets**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `next/font/google`, fix hook cascading render warnings, and increase filter pill touch targets to 44px**
- [ ] **Step 4: Run tests and `npm run lint` to verify zero warnings and clean build**
- [ ] **Step 5: Verify all Jest tests pass**

---

### Task 4: Documentation & Final Verification

**Files:**
- Modify: `docs/PRD.md`
- Create: `changelogs/CHANGELOG_24_10_2026.md`

- [ ] **Step 1: Update `docs/PRD.md` with accessibility, font optimization, and design token improvements**
- [ ] **Step 2: Create `changelogs/CHANGELOG_24_10_2026.md` summarizing all fixes**
- [ ] **Step 3: Run full test suite and build verification (`npm test && npm run lint`)**
- [ ] **Step 4: Run `/impeccable detect` to verify 0 violations**
