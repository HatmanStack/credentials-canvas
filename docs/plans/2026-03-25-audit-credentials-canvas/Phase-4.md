# Phase 4: [FORTIFIER] Guardrails and Tooling

## Phase Goal

Add pre-commit hooks, commitlint, and fix the `@types/three` version mismatch. These are additive guardrails that prevent regressions on the improvements made in Phases 1-3.

**Success criteria:**
- Pre-commit hooks run full lint and type-check via `npm run lint`
- Commitlint enforces conventional commit format via commit-msg hook
- `@types/three` version aligns with `three` runtime version
- Root vitest config setupFiles path is corrected
- `npm run check` passes

**Estimated tokens:** ~10,000

## Prerequisites

- Phases 1-3 complete
- `npm run check` passes

## Tasks

### Task 1: Add Husky pre-commit hook

**Goal:** Install Husky and configure a pre-commit hook that runs lint and type-check.

**Findings addressed:** eval Reproducibility, eval Git Hygiene

**Files to modify/create:**
- `package.json` (root) -- Add husky to devDependencies and add `prepare` script
- `.husky/pre-commit` -- CREATE: hook script

**Important:** Husky must be installed at the repo root (where `.git/` lives), not in `frontend/`. The root `package.json` currently has no `devDependencies`; this task will add the section.

**Implementation steps:**
1. Install Husky as a dev dependency in the root package.json: `npm install --save-dev husky` (run from repo root, NOT from `frontend/`).
2. Initialize Husky: from the repo root, run `npx husky init` (or manually create `.husky/` directory).
3. Create `.husky/pre-commit` with content that runs `npm run lint` from the repo root. The script should be:
   ```bash
   npm run lint
   ```
4. Verify the root `package.json` has a `prepare` script set to `"husky"` (Husky v9+ pattern; `npx husky init` should have added this). If not, add it manually.
5. Make the hook executable: `chmod +x .husky/pre-commit`.
6. Test by making a small change, staging it, and committing. The lint should run.
7. Run `npm run check`.

**Verification checklist:**
- [x] `.husky/pre-commit` exists and is executable
- [x] `git commit` triggers the lint check
- [x] Root `package.json` has a `prepare` script
- [x] `npm run check` passes

**Commit message template:**
```text
ci: add pre-commit hook for lint and type-check

- Install Husky and configure pre-commit to run npm run lint
- Catches lint and type errors before push
```

---

### Task 2: Add commitlint with conventional commits

**Goal:** Enforce conventional commit message format via a commit-msg hook.

**Findings addressed:** eval Git Hygiene

**Files to modify/create:**
- `package.json` (root) -- Add commitlint dependencies to devDependencies
- `.commitlintrc.json` -- CREATE: commitlint configuration
- `.husky/commit-msg` -- CREATE: hook script

**Important:** Commitlint must be installed at the repo root alongside Husky, since the commit-msg hook runs from the repo root. Do NOT install in `frontend/package.json`.

**Implementation steps:**
1. Install commitlint in the root package.json: `npm install --save-dev @commitlint/cli @commitlint/config-conventional` (run from repo root, NOT from `frontend/`).
2. Create `.commitlintrc.json` at repo root:
   ```json
   {
     "extends": ["@commitlint/config-conventional"]
   }
   ```
3. Create `.husky/commit-msg`:
   ```bash
   npx commitlint --edit "$1"
   ```
4. Make executable: `chmod +x .husky/commit-msg`.
5. Test by attempting a commit with a non-conventional message (should fail) and then with a proper one (should pass).
6. Run `npm run check`.

**Verification checklist:**
- [x] `.commitlintrc.json` exists at repo root
- [x] `.husky/commit-msg` exists and is executable
- [x] Non-conventional commit messages are rejected
- [x] Conventional commit messages are accepted
- [x] `npm run check` passes

**Commit message template:**
```text
ci: add commitlint for conventional commit enforcement

- Enforces commit message format via commit-msg hook
- Uses @commitlint/config-conventional
```

---

### Task 3: Update @types/three to match three

**Goal:** Close the 24-minor-version gap between `three` (^0.183.2) and `@types/three` (^0.159.0).

**Findings addressed:** health-audit #21 (LOW)

**Files to modify/create:**
- `frontend/package.json` -- Update `@types/three` version

**Implementation steps:**
1. Check the latest `@types/three` version available: `cd frontend && npm view @types/three versions --json | tail -5`.
2. The `@types/three` package follows a different versioning scheme than `three`. Find the `@types/three` version that corresponds to `three@0.183.x`. The pattern is typically `@types/three@0.1XX.0` where XX matches the three.js minor version, but this varies. Check npm for the correct mapping.
3. Update `@types/three` in `frontend/package.json` to the matching version.
4. Run `cd frontend && npm install`.
5. Run `npm run lint` from root. Fix any new type errors that surface from the updated definitions. These may include:
   - Properties that were renamed in newer Three.js versions
   - Changed constructor signatures
   - Removed deprecated APIs
6. If there are `@ts-expect-error` suppressions that are no longer needed, remove them.
7. Run `npm run check`.

**Verification checklist:**
- [x] `@types/three` version corresponds to the installed `three` version
- [x] No unnecessary `@ts-expect-error` suppressions remain
- [x] `npm run check` passes

**Commit message template:**
```text
chore(deps): align @types/three with three runtime version

- Update @types/three from ^0.159.0 to matching version
- Fix any type errors from updated definitions
```

---

### Task 4: Fix root vitest config setupFiles path

**Goal:** The root `vitest.config.ts` has three broken paths: `setupFiles` references `./tests/setup.ts` (does not exist), `include` references `tests/**/*.test.{ts,tsx}` (no `tests/` at repo root; actual tests are in `frontend/tests/`), and the `test-helpers` alias points to `tests/helpers` instead of `frontend/tests/helpers`. Fix all three.

**Findings addressed:** doc-audit Config Drift #1

**Files to modify/create:**
- `vitest.config.ts` (root) -- Fix setupFiles path, include glob, and test-helpers alias

**Implementation steps:**
1. The actual setup file is at `frontend/tests/helpers/setup.ts`.
2. Update the `setupFiles` path from `['./tests/setup.ts']` to `['./frontend/tests/helpers/setup.ts']`.
3. Update the `include` glob from `['tests/**/*.test.{ts,tsx}']` to `['frontend/tests/**/*.test.{ts,tsx}']`. Without this fix, vitest will find zero test files when run from the repo root.
4. Update the `test-helpers` alias from `resolve(__dirname, 'tests/helpers')` to `resolve(__dirname, 'frontend/tests/helpers')`.
5. Run `npm run check` from the repo root to verify tests are discovered and run correctly.

**Verification checklist:**
- [x] `vitest.config.ts` setupFiles points to `./frontend/tests/helpers/setup.ts`
- [x] `vitest.config.ts` include glob is `frontend/tests/**/*.test.{ts,tsx}`
- [x] `vitest.config.ts` test-helpers alias resolves to `frontend/tests/helpers`
- [x] `npm run check` passes and finds all test files when run from repo root

**Commit message template:**
```text
fix(config): correct vitest root config paths

- Fix setupFiles to point to frontend/tests/helpers/setup.ts
- Fix include glob to find tests in frontend/tests/
- Fix test-helpers alias to resolve to frontend/tests/helpers
```

---

### Task 5: Add explicit return type to cn() utility

**Goal:** Add an explicit return type annotation to the `cn()` function in `classNameUtils.ts`.

**Findings addressed:** eval Type Rigor

**Files to modify/create:**
- `frontend/src/utils/classNameUtils.ts` -- Add return type

**Implementation steps:**
1. Read `classNameUtils.ts` to see the current `cn()` function signature.
2. Add an explicit return type (likely `string` since it combines class names).
3. Run `npm run check`.

**Verification checklist:**
- [x] `cn()` has an explicit return type annotation
- [x] `npm run check` passes

**Commit message template:**
```text
refactor(utils): add explicit return type to cn utility

- Improves type documentation for the class name merge function
```

## Phase Verification

After all tasks are complete:

1. Run `npm run check` from repo root. It must pass.
2. Test the pre-commit hook: make a trivial change, stage it, and commit. Lint should run.
3. Test commitlint: attempt a commit with message "bad message" (should be rejected).
4. Verify `@types/three` version in `frontend/package.json` is aligned with `three`.
5. Verify `vitest.config.ts` setupFiles path resolves to an existing file.

**Known limitations:**
- The Tailwind v4 configuration format migration (v3 `tailwind.config.js` with v4 runtime) is noted in the doc audit but is out of scope for this plan. It is a separate feature migration, not a remediation task.
