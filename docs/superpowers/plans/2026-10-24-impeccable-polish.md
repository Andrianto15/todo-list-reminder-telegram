# Impeccable Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Execute final quality polish pass across the application, adding themed browser surfaces (selection, caret), propagating semantic tokens to remaining utility components, and perfecting interactive micro-states.

**Architecture:** Refine styling details at the CSS and component level without altering layout or component boundaries. Connect all remaining surfaces to semantic tokens (`bg-surface`, `border-border`, `text-foreground`, `text-muted`).

**Tech Stack:** Next.js 16, Tailwind CSS v4, CSS Custom Properties, Framer Motion, Jest.

**Spec:** [reference/polish.md](file:///Users/andriantonuriskandar/.gemini/config/skills/impeccable/reference/polish.md) and [reference/craft-floor.md](file:///Users/andriantonuriskandar/.gemini/config/skills/impeccable/reference/craft-floor.md).

## Global Constraints

- No functional regressions; 100% test pass rate maintained.
- Zero ESLint errors or warnings.
- Preserves all existing design choices from DESIGN.md.
- Mobile-first responsiveness preserved.

---

### Task 1: Themed Browser Surfaces & Token Refinement

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/ui/ConfirmDialog.tsx`
- Modify: `src/components/tasks/Top3Highlight.tsx`
- Modify: `src/components/ui/EmptyState.tsx`
- Modify: `src/components/ui/TaskSkeleton.tsx`
- Modify: `src/app/settings/telegram/page.tsx`
- Test: `tests/auditPolish.test.ts`

- [ ] **Step 1: Write unit tests verifying themed browser surfaces and token adoption**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement themed selection/caret in `globals.css` and semantic classes across components**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Run full test suite and verify 0 lint errors**

---

### Task 2: Documentation & Changelog

**Files:**
- Modify: `docs/PRD.md`
- Modify: `changelogs/CHANGELOG_24_10_2026.md`

- [ ] **Step 1: Document polish refinements in `docs/PRD.md`**
- [ ] **Step 2: Update `changelogs/CHANGELOG_24_10_2026.md` with polish summary**
- [ ] **Step 3: Verify build (`npm run build`) and mechanical detector (`impeccable detect`)**
