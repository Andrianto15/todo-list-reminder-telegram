# Upgrade Minor & Patch Dependencies Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade npm minor and patch dependencies safely to resolve outdated libraries while preserving stability and passing all tests and builds.

**Architecture:** Incrementally update `package.json` dependencies and devDependencies to their latest minor/patch versions, execute `npm install`, and verify with Jest test suite, ESLint, and Next.js production build.

**Tech Stack:** Next.js 16, React 19, Supabase, Jest, TypeScript, npm.

**Spec:** [docs/PRD.md](file:///Users/andriantonuriskandar/Documents/Playground/todo-list-reminder-telegram/docs/PRD.md)

## Global Constraints

- Keep major versions intact (do not bump framer-motion to v14 or typescript to v7).
- All unit tests must pass before completion.
- ESLint and Next.js build must pass cleanly.
- If user requests version bump on completion, update `package.json` / `package-lock.json`.
- Create changelog in `changelogs/CHANGELOG_24_10_2026.md` upon completion.

## Review Focus

- React / ReactDOM 19.3.x compatibility with Next.js 16.4.x and `@types/react`.
- Supabase SSR and JS client updates without deprecation breakages.
- Grammy bot framework update compatibility with existing webhook handler.
- TypeScript compiler and ts-jest compatibility without typecheck regressions.
- ESLint 10.13.0 and eslint-config-next 16.4.3 rule alignment.

---

### Task 1: Update Dependencies and DevDependencies in package.json

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: Updated semver bounds for target packages.

- [ ] **Step 1: Update package.json version numbers for target minor/patch packages**

Update dependencies:
- `@supabase/ssr`: `^0.12.7`
- `@supabase/supabase-js`: `^2.118.0`
- `grammy`: `^1.46.0`
- `lucide-react`: `^1.61.0`
- `next`: `^16.4.3`
- `react`: `^19.3.1`
- `react-dom`: `^19.3.1`

Update devDependencies:
- `@types/node`: `^26.6.5`
- `@types/react`: `^19.3.0`
- `@types/react-dom`: `^19.3.0`
- `eslint`: `^10.13.0`
- `eslint-config-next`: `^16.4.3`
- `jest`: `^30.5.2`
- `ts-jest`: `^29.4.15`
- `typescript`: `^5.9.3`

- [ ] **Step 2: Run npm install**

Run: `rtk npm install`
Expected: Lockfile updated, exit code 0.

- [ ] **Step 3: Verify outdated list**

Run: `rtk npm outdated`
Expected: Only `framer-motion` (v14) and `typescript` (v7) listed under major outdated.

---

### Task 2: Verification and Quality Checks

**Files:**
- None modified directly (read/verify).

**Interfaces:**
- Consumes: Updated `node_modules` and `package-lock.json`.

- [ ] **Step 1: Run Jest unit tests**

Run: `rtk npm test`
Expected: All 5 test suites pass (33 tests passed).

- [ ] **Step 2: Run ESLint**

Run: `rtk npm run lint`
Expected: No errors found.

- [ ] **Step 3: Run Next.js build check**

Run: `rtk npm run build`
Expected: Build succeeds with exit code 0.

---

### Task 3: Documentation and Changelog

**Files:**
- Create: `changelogs/CHANGELOG_24_10_2026.md`

- [ ] **Step 1: Write changelog record**

Record package upgrade summary in `changelogs/CHANGELOG_24_10_2026.md`.

- [ ] **Step 2: Confirm version bump preference with user**

Follow rule 2: Ask user if package version should be bumped.
