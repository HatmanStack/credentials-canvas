# Phase-2: Code Sanitization, Test Migration, CI/CD & Documentation

## Phase Goal

Complete the modernization by sanitizing all source code, migrating tests from Jest to Vitest, moving tests to the centralized `tests/` directory, configuring GitHub Actions CI, and consolidating documentation.

**Success Criteria:**
- All comments stripped from source code
- All tests pass with Vitest
- Tests located in `tests/frontend/` directory
- GitHub Actions CI workflow passes
- Documentation consolidated into `docs/`
- `npm run check` passes (lint + tests)

**Estimated Tokens:** ~40,000

---

## Prerequisites

- Phase-1 complete (Vite build working, directory structure in place)
- Application runs correctly with `npm run dev`
- `npm run build` exits 0
- `npm run type-check` exits 0

---

## Tasks

### Task 1: Configure Vitest

**Goal:** Set up Vitest as the test runner, integrated with Vite configuration.

**Files to Modify:**
- `frontend/vite.config.ts`
- `frontend/package.json`

**Files to Create:**
- `tests/setup.ts`

**Implementation Steps:**
- Add Vitest configuration to `frontend/vite.config.ts`:
  - Configure test globals (describe, it, expect)
  - Set test environment to jsdom
  - Configure setup file path
  - Set include patterns for `../tests/**/*.test.{ts,tsx}`
  - Configure coverage with v8 provider
  - Set coverage thresholds matching existing (70% for all metrics)
- Update `frontend/package.json` devDependencies:
  - Add vitest
  - Add @vitest/coverage-v8
  - Add @testing-library/react (likely already present)
  - Add @testing-library/jest-dom
  - Add jsdom
- Create `tests/setup.ts` with:
  - Import @testing-library/jest-dom matchers
  - Mock HTMLMediaElement.prototype.play/pause
  - Mock matchMedia
  - Any other browser API mocks from existing setupTests.ts

**Vitest Configuration Pattern:**
```typescript
// in vite.config.ts
export default defineConfig({
  // ... existing config
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['../tests/setup.ts'],
    include: ['../tests/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/main.tsx'],
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
  },
});
```

**Verification Checklist:**
- [ ] Vitest config added to vite.config.ts
- [ ] `tests/setup.ts` created with browser mocks
- [ ] Package.json includes vitest and related deps
- [ ] `npm run test` command works (may fail until tests migrated)

**Testing Instructions:**
- Run `cd frontend && npx vitest --version` to verify installation
- Full test verification after Task 3

**Commit Message Template:**
```
Author & Committer: HatmanStack
Email: 82614182+HatmanStack@users.noreply.github.com

feat(vitest): configure Vitest test runner

Add Vitest configuration to vite.config.ts
Create tests/setup.ts with browser mocks
Configure coverage thresholds at 70%
Set up jsdom test environment
```

---

### Task 2: Create Test Helper Files

**Goal:** Move and update test helper files to the new tests/helpers/ directory.

**Files to Move:**
- `frontend/src/test-helpers/storeMocks.ts` → `tests/helpers/storeMocks.ts`
- `frontend/src/test-helpers/testUtils.tsx` → `tests/helpers/testUtils.tsx`
- `frontend/src/test-helpers/threeMocks.ts` → `tests/helpers/threeMocks.ts`

**Files to Delete (after content migrated):**
- `frontend/src/test-helpers/` directory

**Implementation Steps:**
- Move test helper files to `tests/helpers/`
- Update imports in helper files:
  - Change Jest imports (`jest.fn()`) to Vitest (`vi.fn()`)
  - Update path aliases to point to frontend source
- Update any type imports to use `@/types` pattern
- Ensure mock factories return correctly typed objects
- Remove the empty test-helpers directory from frontend/src

**Import Updates Required:**
```typescript
// Old (Jest)
const mockFn = jest.fn();

// New (Vitest)
import { vi } from 'vitest';
const mockFn = vi.fn();
```

**Verification Checklist:**
- [ ] `tests/helpers/storeMocks.ts` exists
- [ ] `tests/helpers/testUtils.tsx` exists
- [ ] `tests/helpers/threeMocks.ts` exists
- [ ] All `jest.*` references replaced with `vi.*`
- [ ] Path aliases resolve correctly
- [ ] `frontend/src/test-helpers/` removed

**Testing Instructions:**
- TypeScript compilation of helper files (verified in Task 3)

**Commit Message Template:**
```
Author & Committer: HatmanStack
Email: 82614182+HatmanStack@users.noreply.github.com

refactor(test): move test helpers to tests/helpers

Move storeMocks.ts, testUtils.tsx, threeMocks.ts
Update Jest mocks to Vitest (vi.fn, vi.mock)
Update import paths for new location
Remove empty test-helpers directory
```

---

### Task 3: Migrate Test Files to Vitest

**Goal:** Move all test files to the centralized tests/ directory and update them for Vitest compatibility.

**Files to Move:**
- `frontend/src/__tests__/hooks/*.test.ts` → `tests/frontend/hooks/*.test.ts`
- `frontend/src/__tests__/stores/*.test.ts` → `tests/frontend/stores/*.test.ts`
- `frontend/src/__tests__/utils/*.test.ts` → `tests/frontend/utils/*.test.ts`

**Files to Delete (after migration):**
- `frontend/src/__tests__/` directory

**Implementation Steps:**
- Move each test file to corresponding location in `tests/frontend/`
- Update imports in each test file:
  - Add explicit Vitest imports: `import { describe, it, expect, beforeEach, vi } from 'vitest'`
  - Update source imports to use `@/` path alias
  - Update helper imports to use relative paths from tests/helpers
- Replace any Jest-specific APIs:
  - `jest.fn()` → `vi.fn()`
  - `jest.mock()` → `vi.mock()`
  - `jest.spyOn()` → `vi.spyOn()`
  - `jest.clearAllMocks()` → `vi.clearAllMocks()`
- Ensure renderHook and act imports come from @testing-library/react
- Remove the empty __tests__ directory from frontend/src

**Test Files to Migrate:**
1. `useCameraPositionAnimation.test.ts`
2. `useCameraScrollBehavior.test.ts`
3. `useLightingController.test.ts`
4. `sceneInteractionStore.test.ts`
5. `threeJSSceneStore.test.ts`
6. `userInterfaceStore.test.ts`
7. `classNameUtils.test.ts`

**Verification Checklist:**
- [ ] All 7 test files moved to `tests/frontend/`
- [ ] All imports updated to Vitest
- [ ] All Jest APIs replaced with Vitest equivalents
- [ ] `frontend/src/__tests__/` removed
- [ ] `npm run test -- --run` passes all tests

**Testing Instructions:**
- Run `npm run test -- --run` from root
- All tests should pass
- Run `npm run test -- --coverage` to verify coverage thresholds

**Commit Message Template:**
```
Author & Committer: HatmanStack
Email: 82614182+HatmanStack@users.noreply.github.com

refactor(test): migrate tests to Vitest and centralized location

Move hook tests to tests/frontend/hooks/
Move store tests to tests/frontend/stores/
Move util tests to tests/frontend/utils/
Update all tests to use Vitest APIs
Replace jest.* with vi.* throughout
```

---

### Task 4: Sanitize Source Code - Remove Comments

**Goal:** Remove all comments from TypeScript and TSX source files.

**Files to Modify:**
- All `.ts` and `.tsx` files in `frontend/src/`

**Implementation Steps:**
- Process each source file to remove:
  - Single-line comments (`// ...`)
  - Multi-line comments (`/* ... */`)
  - JSDoc comments (`/** ... */`)
- Preserve:
  - `// eslint-disable` and `// eslint-enable` directives
  - `// @ts-ignore` and `// @ts-expect-error` directives
  - Shebang lines if any (`#!/usr/bin/env node`)
- Use a systematic approach:
  - Process files in batches by directory
  - Verify TypeScript compilation after each batch
- Ensure no code is accidentally removed (comments containing code-like strings)

**Directories to Process (in order):**
1. `frontend/src/constants/` (7 files)
2. `frontend/src/utils/` (1 file)
3. `frontend/src/types/` (8 files)
4. `frontend/src/stores/` (4 files)
5. `frontend/src/hooks/` (3 files)
6. `frontend/src/components/` (nested, ~10 files)
7. `frontend/src/` root files (App.tsx, main.tsx)

**Verification Checklist:**
- [ ] No `//` comments remain (except eslint/ts directives)
- [ ] No `/* */` comments remain
- [ ] No `/** */` JSDoc comments remain
- [ ] TypeScript compilation still passes
- [ ] Application still runs correctly

**Testing Instructions:**
- Run `npm run type-check` after each directory batch
- Run `npm run build` after complete
- Run `npm run dev` and verify application works

**Commit Message Template:**
```
Author & Committer: HatmanStack
Email: 82614182+HatmanStack@users.noreply.github.com

style(sanitize): remove all comments from source code

Strip single-line, multi-line, and JSDoc comments
Preserve eslint-disable and ts-ignore directives
Verify TypeScript compilation and runtime behavior
```

---

### Task 5: Sanitize Source Code - Remove Console Statements

**Goal:** Remove any remaining console.log, console.debug, console.info, and debugger statements.

**Files to Modify:**
- All `.ts` and `.tsx` files in `frontend/src/`

**Implementation Steps:**
- Search for and remove:
  - `console.log(...)`
  - `console.debug(...)`
  - `console.info(...)`
  - `console.warn(...)` - evaluate case by case, may keep for genuine warnings
  - `debugger;` statements
- Preserve:
  - `console.error(...)` for genuine error handling
- Verify no functionality depends on console output

**Note:** Based on initial scan, the codebase appears clean (0 console/debugger statements found). This task verifies and documents that state.

**Verification Checklist:**
- [ ] `grep -r "console\.(log|debug|info)" frontend/src/` returns no results
- [ ] `grep -r "debugger" frontend/src/` returns no results
- [ ] Application runs without console output (except genuine errors)

**Testing Instructions:**
- Run grep commands to verify
- Run application and check browser console is clean

**Commit Message Template:**
```
Author & Committer: HatmanStack
Email: 82614182+HatmanStack@users.noreply.github.com

style(sanitize): verify no console/debugger statements

Confirm codebase is free of development console statements
Document clean state for future reference
```

---

### Task 6: Create GitHub Actions CI Workflow

**Goal:** Create a CI workflow that runs lint and tests on push and PR.

**Files to Create:**
- `.github/workflows/ci.yml`

**Implementation Steps:**
- Create CI workflow with three jobs:
  1. `frontend-lint`: Run ESLint
  2. `frontend-tests`: Run Vitest with coverage
  3. `status-check`: Aggregate job for branch protection
- Configure triggers for push and PR to main and develop branches
- Use Node.js 24
- Cache npm dependencies for faster runs
- Configure job dependencies correctly

**Workflow Structure:**
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  frontend-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'npm'
      - run: npm ci
      - run: npm run test -- --run --coverage

  status-check:
    runs-on: ubuntu-latest
    needs: [frontend-lint, frontend-tests]
    if: always()
    steps:
      - name: Check job statuses
        run: |
          if [[ "${{ needs.frontend-lint.result }}" != "success" ]] || \
             [[ "${{ needs.frontend-tests.result }}" != "success" ]]; then
            echo "One or more required jobs failed"
            exit 1
          fi
          echo "All checks passed"
```

**Verification Checklist:**
- [ ] `.github/workflows/ci.yml` exists
- [ ] Workflow syntax is valid (use actionlint or GitHub's validator)
- [ ] Node.js version is 24
- [ ] Three jobs defined: frontend-lint, frontend-tests, status-check
- [ ] Triggers configured for main and develop

**Testing Instructions:**
- Validate YAML syntax: `npx yaml-lint .github/workflows/ci.yml`
- Actual CI testing requires pushing to GitHub

**Commit Message Template:**
```
Author & Committer: HatmanStack
Email: 82614182+HatmanStack@users.noreply.github.com

ci: add GitHub Actions workflow for lint and tests

Create ci.yml with frontend-lint and frontend-tests jobs
Add status-check job for branch protection
Configure Node.js 24 and npm caching
Trigger on push/PR to main and develop
```

---

### Task 7: Consolidate Documentation

**Goal:** Restructure documentation to match the savorswipe pattern with root README and full docs in docs/.

**Files to Create:**
- `docs/README.md` (full documentation)

**Files to Modify:**
- Root `README.md` (simplify to overview + quick start)

**Files to Delete:**
- `docs/TESTING.md` (incorporate into docs/README.md)
- `docs/TAILWIND_PATTERNS.md` (incorporate into docs/README.md)

**Implementation Steps:**
- Create comprehensive `docs/README.md` containing:
  - Full project description and features
  - Technologies used section
  - Architecture overview (Three.js scene structure)
  - Installation instructions
  - Development workflow
  - Testing section (from TESTING.md, updated for Vitest)
  - Styling section (from TAILWIND_PATTERNS.md)
  - Build and deployment notes
- Simplify root `README.md` to:
  - Project title and badges
  - Brief description (2-3 sentences)
  - Demo GIFs (existing)
  - Structure diagram
  - Prerequisites
  - Quick start (clone, install, run)
  - Link to docs/README.md for full documentation
  - License
- Delete redundant documentation files
- Ensure docs/plans/ directory is preserved

**Verification Checklist:**
- [ ] `docs/README.md` exists with comprehensive content
- [ ] Root `README.md` simplified to overview format
- [ ] `docs/TESTING.md` deleted
- [ ] `docs/TAILWIND_PATTERNS.md` deleted
- [ ] `docs/plans/` preserved (not deleted)
- [ ] All internal links work correctly

**Testing Instructions:**
- Review documentation for accuracy
- Verify markdown renders correctly (use GitHub preview)

**Commit Message Template:**
```
Author & Committer: HatmanStack
Email: 82614182+HatmanStack@users.noreply.github.com

docs: consolidate documentation into docs/README.md

Create comprehensive docs/README.md with full documentation
Simplify root README.md to overview and quick start
Remove redundant TESTING.md and TAILWIND_PATTERNS.md
Update testing docs for Vitest migration
```

---

### Task 8: Update Root Package Scripts

**Goal:** Finalize root package.json with all required scripts.

**Files to Modify:**
- `package.json` (root)

**Implementation Steps:**
- Verify all orchestration scripts work correctly:
  - `npm start` / `npm run dev` - starts development server
  - `npm run build` - production build
  - `npm test` - runs Vitest
  - `npm run lint` - runs ESLint
  - `npm run type-check` - TypeScript verification
  - `npm run check` - lint + tests combined
- Ensure scripts delegate to frontend workspace correctly
- Remove any CRA-legacy scripts that may remain
- Add preview script for testing production builds

**Final Scripts:**
```json
{
  "scripts": {
    "start": "npm run dev --workspace=frontend",
    "dev": "npm run dev --workspace=frontend",
    "build": "npm run build --workspace=frontend",
    "preview": "npm run preview --workspace=frontend",
    "test": "npm run test --workspace=frontend",
    "lint": "npm run lint --workspace=frontend",
    "type-check": "npm run type-check --workspace=frontend",
    "check": "npm run lint && npm run test -- --run"
  }
}
```

**Verification Checklist:**
- [ ] `npm run dev` starts Vite dev server
- [ ] `npm run build` creates production build
- [ ] `npm run test -- --run` runs all tests
- [ ] `npm run lint` runs ESLint
- [ ] `npm run type-check` runs tsc
- [ ] `npm run check` runs lint + tests

**Testing Instructions:**
- Execute each script and verify it works
- `npm run check` should exit 0

**Commit Message Template:**
```
Author & Committer: HatmanStack
Email: 82614182+HatmanStack@users.noreply.github.com

chore: finalize root package.json scripts

Verify all orchestration scripts work correctly
Add preview script for production testing
Ensure check script runs lint and tests
```

---

### Task 9: Final Cleanup and Verification

**Goal:** Remove any remaining temporary files and verify the complete refactor.

**Files to Delete:**
- Any `.gitkeep` files added temporarily
- Any backup or temporary files created during migration

**Implementation Steps:**
- Remove temporary .gitkeep files if directories now have content
- Verify .gitignore covers new patterns (dist/, coverage/, etc.)
- Run full verification suite
- Confirm tree structure matches target

**Final Verification Commands:**
```bash
# Directory structure
tree -L 3 -I 'node_modules|dist|coverage'

# Type check
npm run type-check

# Lint
npm run lint

# Tests
npm run test -- --run

# Build
npm run build

# Combined check
npm run check
```

**Verification Checklist:**
- [ ] No temporary files remain
- [ ] .gitignore updated for Vite/Vitest patterns
- [ ] `npm run type-check` exits 0
- [ ] `npm run lint` exits 0 (or only acceptable warnings)
- [ ] `npm run test -- --run` all tests pass
- [ ] `npm run build` exits 0
- [ ] `npm run check` exits 0
- [ ] Application runs correctly with `npm run dev`

**Testing Instructions:**
- Run full verification suite above
- Manual testing of application in browser

**Commit Message Template:**
```
Author & Committer: HatmanStack
Email: 82614182+HatmanStack@users.noreply.github.com

chore: complete monorepo refactor and cleanup

Remove temporary files
Update .gitignore for Vite/Vitest
Verify all checks pass
Confirm target directory structure achieved
```

---

## Phase Verification

Before marking Phase-2 complete, verify:

1. **Full Check Suite:**
   ```bash
   npm run check
   ```
   Must exit 0

2. **Test Coverage:**
   ```bash
   npm run test -- --run --coverage
   ```
   Coverage must meet 70% thresholds

3. **Production Build:**
   ```bash
   npm run build
   npm run preview
   ```
   Application must work in production mode

4. **Directory Structure:**
   ```bash
   tree -L 2 -I 'node_modules|dist|coverage'
   ```
   Must match target layout

5. **Code Sanitization:**
   ```bash
   grep -r "^[[:space:]]*//" frontend/src --include="*.ts" --include="*.tsx" | grep -v "eslint\|@ts-" | wc -l
   ```
   Should return 0 (no comments except directives)

6. **CI Workflow:**
   - YAML syntax valid
   - Ready for first push to trigger

7. **Documentation:**
   - Root README.md is concise overview
   - docs/README.md has full documentation
   - No orphaned .md files

---

## Final Directory Structure

```
credentials-canvas/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── controls/
│   │   │   ├── three/
│   │   │   └── ui/
│   │   ├── constants/
│   │   ├── css/
│   │   ├── hooks/
│   │   ├── shaders/
│   │   ├── stores/
│   │   ├── styles/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   │   └── draco/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── eslint.config.js
├── tests/
│   ├── frontend/
│   │   ├── hooks/
│   │   ├── stores/
│   │   └── utils/
│   ├── helpers/
│   └── setup.ts
├── docs/
│   ├── plans/
│   └── README.md
├── .github/
│   └── workflows/
│       └── ci.yml
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

---

## Known Limitations

- Component tests not implemented (by design per Phase-0 ADR)
- E2E tests not implemented (out of scope)
- No deployment automation (frontend-only, static hosting)

---

## Post-Refactor Recommendations

1. **Branch Protection:** Enable required status checks using `status-check` job
2. **Dependabot:** Consider enabling for automated dependency updates
3. **Performance Monitoring:** Consider adding Lighthouse CI in future
4. **Visual Regression:** Consider Chromatic or Percy for Three.js scene testing
