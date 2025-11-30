# Phase-1: CRA to Vite Migration & Directory Restructure

## Phase Goal

Migrate the project from Create React App to Vite and restructure the file system into the target monorepo layout. This phase establishes the new directory structure, configures Vite, updates all import paths, and ensures the application builds and runs correctly.

**Success Criteria:**
- Application builds successfully with Vite
- Application runs in development mode without errors
- All imports resolve correctly
- Directory structure matches target layout
- TypeScript compilation passes

**Estimated Tokens:** ~45,000

---

## Prerequisites

- Phase-0 documentation read and understood
- Node.js v24 LTS installed
- Clean git working directory
- Current application runs successfully with CRA (baseline verification)

---

## Tasks

### Task 1: Create Target Directory Structure

**Goal:** Create the new monorepo directory layout with all required folders.

**Files to Create:**
- `frontend/` directory
- `frontend/src/` directory
- `frontend/public/` directory
- `tests/` directory
- `tests/frontend/` directory
- `tests/frontend/hooks/` directory
- `tests/frontend/stores/` directory
- `tests/frontend/utils/` directory
- `tests/helpers/` directory
- `.github/workflows/` directory

**Implementation Steps:**
- Create the directory tree structure matching the target layout defined in Phase-0
- Create empty `.gitkeep` files in directories that would otherwise be empty during the transition
- Verify all directories are created with correct permissions

**Verification Checklist:**
- [ ] `frontend/src/` directory exists
- [ ] `frontend/public/` directory exists
- [ ] `tests/frontend/hooks/` directory exists
- [ ] `tests/frontend/stores/` directory exists
- [ ] `tests/frontend/utils/` directory exists
- [ ] `tests/helpers/` directory exists
- [ ] `.github/workflows/` directory exists

**Testing Instructions:**
- No tests required; verify with `find` or `tree` command

**Commit Message Template:**
```
Author & Committer: HatmanStack
Email: 82614182+HatmanStack@users.noreply.github.com

chore(structure): create target monorepo directory layout

Create frontend/, tests/, and .github/ directory structure
Add placeholder .gitkeep files for empty directories
```

---

### Task 2: Move Source Files to Frontend Directory

**Goal:** Relocate all source code from `src/` to `frontend/src/` while preserving the internal structure.

**Files to Move:**
- `src/` → `frontend/src/`
- `public/` → `frontend/public/`

**Files to NOT Move (handle separately):**
- `src/__tests__/` - Moves to `tests/frontend/` (Task 6)
- `src/test-helpers/` - Moves to `tests/helpers/` (Task 6)
- `src/setupTests.ts` - Moves to `tests/setup.ts` (Task 6)

**Implementation Steps:**
- Use `git mv` to preserve history when moving files
- Move `src/` contents to `frontend/src/` excluding test-related directories
- Move `public/` contents to `frontend/public/`
- Preserve the internal directory structure (components/, hooks/, stores/, etc.)
- Handle the draco/ subdirectory in public/ correctly

**Verification Checklist:**
- [ ] `frontend/src/App.tsx` exists
- [ ] `frontend/src/index.tsx` exists (will be renamed in Task 4)
- [ ] `frontend/src/components/` directory populated
- [ ] `frontend/src/hooks/` directory populated
- [ ] `frontend/src/stores/` directory populated
- [ ] `frontend/src/constants/` directory populated
- [ ] `frontend/src/types/` directory populated
- [ ] `frontend/src/utils/` directory populated
- [ ] `frontend/src/shaders/` directory populated
- [ ] `frontend/src/assets/` directory populated
- [ ] `frontend/src/css/` directory populated
- [ ] `frontend/src/styles/` directory populated
- [ ] `frontend/public/index.html` exists
- [ ] `frontend/public/draco/` directory populated
- [ ] Original `src/` directory removed
- [ ] Original `public/` directory removed

**Testing Instructions:**
- No tests required; verify file counts match before/after move
- Count files in source before: `find src -type f | wc -l`
- Count files in destination after: `find frontend/src -type f | wc -l`

**Commit Message Template:**
```
Author & Committer: HatmanStack
Email: 82614182+HatmanStack@users.noreply.github.com

refactor(structure): move source files to frontend directory

Move src/ to frontend/src/
Move public/ to frontend/public/
Preserve internal directory structure and git history
```

---

### Task 3: Initialize Vite Configuration

**Goal:** Create a working Vite configuration that can build the React application.

**Files to Create:**
- `frontend/vite.config.ts`
- `frontend/index.html` (transformed from public/index.html)

**Files to Modify:**
- `frontend/public/index.html` → `frontend/index.html` (move and modify)

**Implementation Steps:**
- Create `vite.config.ts` with React plugin configuration
- Configure path aliases to match the existing tsconfig.json paths
- Configure the build output directory
- Configure the public directory for static assets
- Transform `index.html` from CRA format to Vite format:
  - Move from `public/` to `frontend/` root
  - Remove `%PUBLIC_URL%` references
  - Add `<script type="module" src="/src/main.tsx"></script>` before closing `</body>`
- Configure asset handling for GLSL shaders, audio, and video files
- Set up GLSL shader imports using vite-plugin-glsl or raw imports

**Vite Config Requirements:**
- React plugin with Fast Refresh
- Path aliases matching tsconfig.json
- GLSL shader handling (raw string imports)
- Static asset handling (mp3, mp4, svg, gif)
- Build target: ES2020
- Output directory: `dist/`

**Verification Checklist:**
- [ ] `frontend/vite.config.ts` exists and is valid TypeScript
- [ ] `frontend/index.html` exists at frontend root (not in public/)
- [ ] Vite config includes React plugin
- [ ] Path aliases configured for all existing paths
- [ ] GLSL import handling configured

**Testing Instructions:**
- Run `npx vite --version` to verify Vite is accessible
- Configuration validation happens in Task 5

**Commit Message Template:**
```
Author & Committer: HatmanStack
Email: 82614182+HatmanStack@users.noreply.github.com

feat(vite): add Vite configuration for React build

Create vite.config.ts with React plugin
Configure path aliases matching tsconfig
Set up GLSL shader and asset handling
Transform index.html for Vite entry point
```

---

### Task 4: Update Package Configuration

**Goal:** Create frontend package.json with Vite scripts and update root package.json for workspace orchestration.

**Files to Create:**
- `frontend/package.json`

**Files to Modify:**
- `package.json` (root)

**Implementation Steps:**
- Create `frontend/package.json` with:
  - Dependencies moved from root package.json
  - Vite-specific scripts (dev, build, preview)
  - Vitest scripts (added in Phase-2, placeholder here)
  - Lint script using ESLint
  - Type-check script using tsc
- Update root `package.json` with:
  - Workspace configuration pointing to `frontend/`
  - Orchestration scripts that delegate to frontend
  - Remove CRA-specific dependencies and scripts
  - Keep only root-level dev tooling if needed
- Rename entry point reference: `src/index.tsx` → `src/main.tsx` (Vite convention)

**Root package.json Scripts:**
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
  },
  "workspaces": ["frontend"]
}
```

**Frontend package.json Scripts:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint src",
    "type-check": "tsc --noEmit"
  }
}
```

**Verification Checklist:**
- [ ] `frontend/package.json` exists with correct structure
- [ ] Root `package.json` has workspace configuration
- [ ] Root `package.json` has orchestration scripts
- [ ] react-scripts dependency removed
- [ ] Vite and related dependencies added
- [ ] Entry point renamed from index.tsx to main.tsx in references

**Testing Instructions:**
- Validate JSON syntax: `node -e "require('./frontend/package.json')"`
- Validate root JSON: `node -e "require('./package.json')"`

**Commit Message Template:**
```
Author & Committer: HatmanStack
Email: 82614182+HatmanStack@users.noreply.github.com

chore(vite): configure package.json for Vite and workspaces

Create frontend/package.json with Vite scripts
Update root package.json with workspace configuration
Remove CRA dependencies, add Vite toolchain
```

---

### Task 5: Rename Entry Point and Update Imports

**Goal:** Rename the React entry point file and update the application bootstrap code for Vite compatibility.

**Files to Modify:**
- `frontend/src/index.tsx` → `frontend/src/main.tsx` (rename)
- `frontend/src/main.tsx` (update content)

**Implementation Steps:**
- Rename `frontend/src/index.tsx` to `frontend/src/main.tsx`
- Update the entry point code for Vite:
  - Remove CRA-specific imports (reportWebVitals, etc.)
  - Ensure React 18 createRoot API is used
  - Update CSS import paths if needed
- Verify the import in `frontend/index.html` points to `/src/main.tsx`

**Entry Point Pattern:**
```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/tailwind.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

**Verification Checklist:**
- [ ] `frontend/src/main.tsx` exists
- [ ] `frontend/src/index.tsx` no longer exists
- [ ] main.tsx uses createRoot from react-dom/client
- [ ] CSS imports are correct paths
- [ ] index.html references `/src/main.tsx`

**Testing Instructions:**
- TypeScript compilation check in Task 8

**Commit Message Template:**
```
Author & Committer: HatmanStack
Email: 82614182+HatmanStack@users.noreply.github.com

refactor(vite): rename entry point to main.tsx

Rename index.tsx to main.tsx (Vite convention)
Update entry point code for Vite compatibility
Remove CRA-specific imports
```

---

### Task 6: Update TypeScript Configuration

**Goal:** Update tsconfig.json for Vite compatibility and new directory structure.

**Files to Create:**
- `frontend/tsconfig.json`
- `frontend/tsconfig.node.json` (for Vite config)

**Files to Delete:**
- Root `tsconfig.json` (after content migrated)

**Implementation Steps:**
- Create `frontend/tsconfig.json` with:
  - Module: ESNext
  - ModuleResolution: bundler (Vite-compatible)
  - Target: ES2020
  - JSX: react-jsx
  - Strict mode enabled
  - Path aliases matching vite.config.ts
  - Include paths for `src/`
  - Exclude node_modules and dist
- Create `frontend/tsconfig.node.json` for Vite config file:
  - Module: ESNext
  - ModuleResolution: bundler
  - Include only vite.config.ts
- Remove root tsconfig.json (all TypeScript is in frontend)

**Path Alias Configuration:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"],
      "@stores/*": ["src/stores/*"],
      "@constants/*": ["src/constants/*"],
      "@types/*": ["src/types/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

**Verification Checklist:**
- [ ] `frontend/tsconfig.json` exists
- [ ] `frontend/tsconfig.node.json` exists
- [ ] Root `tsconfig.json` removed
- [ ] ModuleResolution set to "bundler"
- [ ] Path aliases configured correctly
- [ ] Strict mode enabled

**Testing Instructions:**
- Run `cd frontend && npx tsc --noEmit` to verify configuration

**Commit Message Template:**
```
Author & Committer: HatmanStack
Email: 82614182+HatmanStack@users.noreply.github.com

refactor(vite): update TypeScript configuration for Vite

Create frontend/tsconfig.json with Vite-compatible settings
Create frontend/tsconfig.node.json for config files
Update module resolution to bundler mode
Configure path aliases for new structure
```

---

### Task 7: Update All Import Paths

**Goal:** Update all import statements in source files to use the new path alias format.

**Files to Modify:**
- All `.ts` and `.tsx` files in `frontend/src/`

**Implementation Steps:**
- Identify all files using the old path alias format:
  - `components/*` → `@components/*` or `@/components/*`
  - `hooks/*` → `@hooks/*` or `@/hooks/*`
  - `stores/*` → `@stores/*` or `@/stores/*`
  - `constants/*` → `@constants/*` or `@/constants/*`
  - `types/*` → `@types/*` or `@/types/*` (note: avoid `@types` if it conflicts with DefinitelyTyped convention)
  - `utils/*` → `@utils/*` or `@/utils/*`
- Use consistent alias format: prefer `@/` prefix pattern for clarity
- Update barrel exports (index.ts files) if they use old paths
- Ensure relative imports within the same directory remain relative
- Do not change imports from node_modules packages

**Import Pattern Decision:**
Use `@/` as the root alias:
- `import { cn } from '@/utils/classNameUtils'`
- `import { useSceneInteractionStore } from '@/stores/sceneInteractionStore'`
- `import type { CameraTypes } from '@/types'`

**Verification Checklist:**
- [ ] No imports use old bare module paths (e.g., `from 'components/...'`)
- [ ] All internal imports use `@/` prefix or are relative
- [ ] Type imports use `import type` syntax
- [ ] No TypeScript resolution errors

**Testing Instructions:**
- Run `cd frontend && npx tsc --noEmit` - should exit 0

**Commit Message Template:**
```
Author & Committer: HatmanStack
Email: 82614182+HatmanStack@users.noreply.github.com

refactor(structure): update import paths to use @ alias

Update all imports to use @/ path alias format
Ensure consistent import style across codebase
Maintain relative imports for same-directory files
```

---

### Task 8: Configure Tailwind for Vite

**Goal:** Update Tailwind CSS configuration for Vite build system.

**Files to Move/Modify:**
- `tailwind.config.js` → `frontend/tailwind.config.js`
- `postcss.config.js` → `frontend/postcss.config.js`

**Implementation Steps:**
- Move Tailwind config to frontend directory
- Update content paths for new directory structure:
  ```javascript
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ]
  ```
- Move PostCSS config to frontend directory
- Verify Tailwind directives in main CSS file work correctly
- Ensure custom theme colors are preserved

**Verification Checklist:**
- [ ] `frontend/tailwind.config.js` exists
- [ ] `frontend/postcss.config.js` exists
- [ ] Content paths point to correct locations
- [ ] Custom colors (background-primary, urban-theme, etc.) preserved
- [ ] Root tailwind.config.js removed
- [ ] Root postcss.config.js removed

**Testing Instructions:**
- Build verification in Task 11

**Commit Message Template:**
```
Author & Committer: HatmanStack
Email: 82614182+HatmanStack@users.noreply.github.com

chore(vite): move Tailwind configuration to frontend

Move tailwind.config.js to frontend/
Move postcss.config.js to frontend/
Update content paths for new directory structure
```

---

### Task 9: Configure ESLint for Vite (Flat Config)

**Goal:** Migrate ESLint to flat config format compatible with Vite.

**Files to Create:**
- `frontend/eslint.config.js`

**Files to Delete:**
- Root `.eslintrc.json`

**Implementation Steps:**
- Create `frontend/eslint.config.js` using flat config format
- Configure TypeScript ESLint with type-aware linting
- Replicate essential rules from the current .eslintrc.json:
  - Single quotes
  - 2-space indentation
  - 120 character max line length
  - React Three Fiber JSX property ignore list
  - Unused vars warning with underscore ignore
- Remove Google style guide (no flat config support), implement key rules manually
- Set up parser options for TypeScript

**Essential Rules to Preserve:**
```javascript
{
  'quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
  'indent': ['error', 2, { SwitchCase: 1 }],
  'max-len': ['error', { code: 120, ignoreUrls: true, ignoreStrings: true }],
  'object-curly-spacing': ['error', 'always'],
  '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
}
```

**Verification Checklist:**
- [ ] `frontend/eslint.config.js` exists
- [ ] Root `.eslintrc.json` removed
- [ ] ESLint runs without config errors
- [ ] Key style rules preserved

**Testing Instructions:**
- Run `cd frontend && npx eslint src --max-warnings 0` (may have warnings initially, but should not error on config)

**Commit Message Template:**
```
Author & Committer: HatmanStack
Email: 82614182+HatmanStack@users.noreply.github.com

chore(eslint): migrate to flat config format

Create frontend/eslint.config.js with flat config
Remove legacy .eslintrc.json
Preserve essential style rules (quotes, indent, max-len)
Configure TypeScript-aware linting
```

---

### Task 10: Install Dependencies

**Goal:** Install all required dependencies for the new Vite-based setup.

**Files to Modify:**
- `frontend/package.json` (add any missing dependencies)

**Implementation Steps:**
- Navigate to frontend directory
- Run npm install to install all dependencies
- Verify no peer dependency warnings for core packages
- Verify Vite, React, and TypeScript versions are compatible

**Core Dependencies to Verify:**
- vite
- @vitejs/plugin-react
- typescript (^5.x)
- react (18.2.x)
- react-dom (18.2.x)
- three
- @react-three/fiber
- @react-three/drei
- zustand
- tailwindcss
- autoprefixer
- postcss

**Verification Checklist:**
- [ ] `npm install` completes without errors
- [ ] `frontend/node_modules/` exists
- [ ] `frontend/package-lock.json` created or updated
- [ ] No critical peer dependency warnings

**Testing Instructions:**
- Run `cd frontend && npm ls vite` - should show installed version
- Run `cd frontend && npm ls react` - should show 18.2.x

**Commit Message Template:**
```
Author & Committer: HatmanStack
Email: 82614182+HatmanStack@users.noreply.github.com

chore(deps): install Vite and related dependencies

Run npm install in frontend workspace
Verify all dependencies resolve correctly
Update package-lock.json
```

---

### Task 11: Verify Build and Development Server

**Goal:** Ensure the application builds and runs correctly with Vite.

**Files to Modify:**
- Any files with remaining import/config issues discovered during verification

**Implementation Steps:**
- Run `npm run build` from root to verify production build works
- Run `npm run dev` from root to verify development server starts
- Open the application in browser and verify:
  - 3D scene loads correctly
  - No console errors
  - Interactions work (clicks, scrolling)
  - Themes change correctly
  - Audio plays
- Fix any issues discovered during verification

**Common Issues to Check:**
- GLSL shader imports failing
- Asset imports (images, audio, video) not resolving
- Three.js/React Three Fiber initialization errors
- Tailwind styles not applying
- Path alias resolution failures

**Verification Checklist:**
- [ ] `npm run build` exits 0
- [ ] `npm run dev` starts server without errors
- [ ] Application loads in browser
- [ ] 3D scene renders correctly
- [ ] No JavaScript console errors
- [ ] Tailwind styles applied correctly
- [ ] Interactive elements functional

**Testing Instructions:**
- Manual browser testing required
- Verify all interactive elements work as before migration

**Commit Message Template:**
```
Author & Committer: HatmanStack
Email: 82614182+HatmanStack@users.noreply.github.com

fix(vite): resolve build and runtime issues

Fix any issues discovered during build verification
Ensure application runs correctly with Vite
Verify 3D scene and interactions work properly
```

---

### Task 12: Clean Up Legacy Files

**Goal:** Remove all CRA-specific files and configurations that are no longer needed.

**Files to Delete:**
- Root `jest.config.js`
- `Implement` file
- Any remaining CRA-specific files (react-scripts references, etc.)

**Files to Verify Removed:**
- `src/` directory (should be empty/removed after Task 2)
- `public/` directory (should be empty/removed after Task 2)

**Implementation Steps:**
- Remove jest.config.js (will be replaced by Vitest config in Phase-2)
- Remove the `Implement` file at project root
- Verify no orphaned files remain at root that belong in frontend/
- Update .gitignore if needed for new structure

**Verification Checklist:**
- [ ] Root `jest.config.js` removed
- [ ] `Implement` file removed
- [ ] No `src/` directory at root
- [ ] No `public/` directory at root
- [ ] `.gitignore` updated if needed

**Testing Instructions:**
- Run `ls -la` at root to verify only expected files remain
- Expected root files: package.json, package-lock.json, README.md, .gitignore, frontend/, docs/, tests/, .github/

**Commit Message Template:**
```
Author & Committer: HatmanStack
Email: 82614182+HatmanStack@users.noreply.github.com

chore(structure): remove legacy CRA files

Delete jest.config.js (replaced by Vitest in Phase-2)
Delete Implement file
Clean up any remaining orphaned files
```

---

## Phase Verification

Before marking Phase-1 complete, verify:

1. **Directory Structure:**
   ```
   tree -L 2 -I 'node_modules|dist'
   ```
   Should show frontend/, docs/, tests/, .github/ structure

2. **Build:**
   ```bash
   npm run build
   ```
   Must exit 0

3. **Type Check:**
   ```bash
   npm run type-check
   ```
   Must exit 0

4. **Lint (may have warnings):**
   ```bash
   npm run lint
   ```
   Should run without config errors

5. **Dev Server:**
   ```bash
   npm run dev
   ```
   Application must load and function correctly

6. **Manual Testing:**
   - 3D scene loads
   - Click interactions work
   - Theme switching works
   - Audio plays
   - Navigation to external links works

---

## Known Limitations

- Tests not yet migrated (Phase-2)
- ESLint may report warnings for comments/sanitization (Phase-2)
- CI/CD not yet configured (Phase-2)

---

## Rollback Plan

If Phase-1 fails:
1. `git stash` any uncommitted work
2. `git log --oneline -10` to find last good commit
3. `git reset --hard <commit>` to restore
4. Review error logs before reattempting
5. Consider breaking tasks into smaller commits

---

## Review Feedback (Iteration 1)

### Task 2: Move Source Files - Incomplete

> **Consider:** Running `ls -la src/` at the project root shows `setupTests.ts`, `test-helpers/`, and `__tests__/` still present. While the plan notes these should be moved in Phase-2 to `tests/`, the plan also says under Task 2 "Original `src/` directory removed" in the verification checklist.
>
> **Think about:** Should the root `src/` directory be completely removed after moving the main source files, even if test files remain temporarily? Or should the test files be moved to `tests/` first so the directory can be deleted cleanly?
>
> **Reflect:** The current state has both `src/` (with tests) and `frontend/src/` (with app code), which could cause confusion. What's the clearest path forward?

### Task 7: Update All Import Paths - CRA Artifacts Remain

> **Consider:** Looking at `frontend/src/constants/meshConfiguration.ts:41-46`, you see `require('../assets/Vocabulary.mp4')` and similar CRA-style `require()` imports. ESLint reports 6 errors: "A `require()` style import is forbidden".
>
> **Think about:** In Vite, how should video assets be imported? Would ES module `import` syntax work for mp4 files, or should they use a different pattern like URL imports or direct paths?
>
> **Reflect:** Also notice line 67: `process.env.PUBLIC_URL + '/compressed_model.glb'` - this is a CRA environment variable. What's the Vite equivalent for referencing files in the `public/` directory?

### Task 7: Update All Import Paths - Shader Imports

> **Consider:** The plan specifies GLSL shader handling. Have you verified how `frontend/src/shaders/fragment.glsl` and `vertex.glsl` are imported? Does the current setup work with `assetsInclude: ['**/*.glsl']` in vite.config.ts?
>
> **Reflect:** How are shaders imported in the Three.js components? Do they use `import shader from './shader.glsl'` or a different pattern?

### Task 12: Clean Up Legacy Files - Root Configs

> **Consider:** The plan says to remove root `jest.config.js` and `.eslintrc.json`. Running Glob searches shows these only exist in `node_modules/` now.
>
> **Reflect:** Were these files removed, or did they never exist at root level originally? Verify the cleanup task was completed.

### Build Status

> **Note:** `npm run build` succeeds but shows a warning about chunk size (1,209 KB). This is informational, not blocking, but consider code-splitting in future optimization.

### Lint Status - Blocking Issues

> **Consider:** `npm run lint` fails with 6 errors and 2 warnings. The errors are all from `require()` imports in `meshConfiguration.ts`.
>
> **Think about:** The plan's Phase Verification section states lint "should run without config errors" - but these are actual code errors, not config errors. Should lint pass completely before marking Phase-1 done, or should this be deferred?
>
> **Reflect:** The 2 warnings (`@typescript-eslint/no-explicit-any` and `react-hooks/exhaustive-deps`) are style/quality warnings. Are these acceptable to defer to Phase-2 sanitization?

### Verification Summary

| Check | Status | Notes |
|-------|--------|-------|
| Directory structure | ⚠️ Partial | `src/` with test files still at root |
| `npm run build` | ✅ Pass | Builds successfully |
| `npm run type-check` | ✅ Pass | TypeScript compiles |
| `npm run lint` | ❌ Fail | 6 errors from `require()` imports |
| Vite config | ✅ Good | Correct structure |
| Package.json | ✅ Good | Workspace setup correct |
| Commits | ✅ Good | Follow conventional format |

### Action Required

Before approval, address:
1. Fix the 6 `require()` imports in `meshConfiguration.ts` to use Vite-compatible syntax
2. Fix `process.env.PUBLIC_URL` reference to Vite equivalent
3. Decide: Remove `src/` directory now (move test files first) or explicitly document it stays until Phase-2
