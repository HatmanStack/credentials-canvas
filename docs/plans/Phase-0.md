# Phase-0: Foundation

This document establishes the architectural decisions, conventions, and standards that apply to **all phases** of the refactor. Engineers must read and internalize this document before starting any implementation work.

---

## Architecture Decision Records (ADRs)

### ADR-001: Vite as Build Tool

**Status:** Accepted

**Context:** The project currently uses Create React App (CRA) which is deprecated and has slow build times. The target monorepo structure requires flexible path configurations that CRA makes difficult.

**Decision:** Migrate to Vite with the `@vitejs/plugin-react` plugin.

**Consequences:**
- Entry point changes from `src/index.tsx` to `frontend/src/main.tsx`
- HTML file moves from `public/index.html` to `frontend/index.html` and must include `<script type="module" src="/src/main.tsx"></script>`
- Environment variables change from `REACT_APP_*` to `VITE_*` (accessed via `import.meta.env.VITE_*`)
- Hot Module Replacement (HMR) works out of the box
- Path aliases configured in `vite.config.ts` instead of `tsconfig.json` paths alone

---

### ADR-002: Vitest as Test Runner

**Status:** Accepted

**Context:** The project uses Jest with CRA's preset. Vite projects work better with Vitest due to shared configuration and native ES module support.

**Decision:** Migrate from Jest to Vitest.

**Consequences:**
- Test files remain `*.test.ts` / `*.test.tsx`
- Import `describe`, `it`, `expect`, `vi` from `vitest` instead of global Jest
- Mocking uses `vi.fn()`, `vi.mock()`, `vi.spyOn()` instead of `jest.*`
- Configuration in `vite.config.ts` under `test` key
- Same Testing Library APIs work unchanged
- Coverage via `@vitest/coverage-v8`

---

### ADR-003: Centralized Test Directory

**Status:** Accepted

**Context:** Tests are currently colocated in `src/__tests__/`. The target architecture requires a root-level `tests/` directory.

**Decision:** Move all tests to `tests/frontend/` with subdirectories mirroring source structure.

**Consequences:**
- Tests import source via path aliases (e.g., `@/stores/sceneInteractionStore`)
- Test helpers move to `tests/helpers/`
- Vitest configured with `include: ['tests/**/*.test.{ts,tsx}']`
- Source files remain clean of test-related code

---

### ADR-004: Full Code Sanitization

**Status:** Accepted

**Context:** The codebase should be production-hardened with no development artifacts.

**Decision:** Remove all comments, console statements, and debugger statements from source code.

**Consequences:**
- All `//` and `/* */` comments removed from `.ts` and `.tsx` files
- All `console.log`, `console.debug`, `console.info`, `console.warn` removed
- All `debugger` statements removed
- JSDoc comments removed
- License headers removed from source files (license remains in LICENSE file)
- Type definitions (`.d.ts`) may retain minimal comments for clarity

**Exceptions:**
- `// eslint-disable` directives that are necessary
- `// @ts-ignore` or `// @ts-expect-error` with genuine need
- CSS custom property comments in `.css` files (preserve for maintainability)

---

### ADR-005: No Backend Structure

**Status:** Accepted

**Context:** This is a frontend-only React/Three.js portfolio application with no server-side logic.

**Decision:** Do not create a `backend/` directory. The monorepo structure includes only `frontend/`, `docs/`, and `tests/`.

**Consequences:**
- Root `package.json` contains only orchestration scripts
- No Python, no pytest, no backend-related CI jobs
- All `npm run test:backend` and `npm run lint:backend` scripts omitted

---

### ADR-006: ESLint Flat Config

**Status:** Accepted

**Context:** ESLint is moving to flat config format (`eslint.config.js`). The current `.eslintrc.json` uses legacy format.

**Decision:** Migrate to ESLint flat config during the Vite migration.

**Consequences:**
- Replace `.eslintrc.json` with `frontend/eslint.config.js`
- Use `@eslint/js` and `typescript-eslint` packages
- Google style guide rules replicated manually (no flat-config-compatible version)
- Plugins imported as ES modules

---

### ADR-007: Public Assets as Static URLs

**Status:** Accepted

**Context:** The project contains YouTube video URLs, CDN paths, and external links in `urlConfiguration.ts`.

**Decision:** Treat all URLs as public static configuration. No environment variable extraction needed.

**URLs Confirmed Public:**
- `https://www.gemenielabs.com/*` - Portfolio main site
- `https://medium.com/@HatmanStack` - Blog articles
- `https://github.com/HatmanStack` - GitHub profile
- `https://huggingface.co/Hatman` - HuggingFace profile
- `https://d6d8ny9p8jhyg.cloudfront.net/` - CloudFront CDN (public)
- `https://*.streamlit.app` - Streamlit apps (public)
- `https://*.hf.space/` - HuggingFace Spaces (public)
- `https://*.amplifyapp.com/` - AWS Amplify apps (public)
- `https://*.lambda-url.*.on.aws/` - Lambda function URLs (public)
- Google Forms link - Public form

**Consequences:**
- No `.env` file needed for secrets
- No `import.meta.env.VITE_*` usage for URLs
- urlConfiguration.ts remains as static TypeScript

---

## Tech Stack

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.2.x | UI framework |
| react-dom | 18.2.x | React DOM renderer |
| three | ^0.165.0 | 3D graphics engine |
| @react-three/fiber | ^8.16.x | React Three.js renderer |
| @react-three/drei | ^9.105.x | Three.js helpers |
| @react-spring/three | ^9.7.x | Animation library |
| @use-gesture/react | ^10.3.x | Gesture handling |
| zustand | ^4.4.x | State management |
| clsx | ^2.0.x | Class name utility |
| tailwind-merge | ^2.2.x | Tailwind class merging |
| use-sound | ^4.0.x | Audio playback |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| vite | ^6.x | Build tool |
| @vitejs/plugin-react | ^4.x | React plugin for Vite |
| vitest | ^2.x | Test runner |
| @testing-library/react | ^14.x | React testing utilities |
| @testing-library/jest-dom | ^6.x | DOM matchers |
| @vitest/coverage-v8 | ^2.x | Coverage reporting |
| typescript | ^5.x | Type checking |
| tailwindcss | ^3.4.x | CSS framework |
| autoprefixer | ^10.x | CSS prefixing |
| postcss | ^8.x | CSS processing |
| eslint | ^9.x | Linting |
| @eslint/js | ^9.x | ESLint core rules |
| typescript-eslint | ^8.x | TypeScript ESLint |

---

## Shared Patterns & Conventions

### File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Components | PascalCase | `LaunchScreen.tsx` |
| Hooks | camelCase with `use` prefix | `useCameraScrollBehavior.ts` |
| Stores | camelCase with `Store` suffix | `sceneInteractionStore.ts` |
| Utils | camelCase | `classNameUtils.ts` |
| Constants | camelCase with `Configuration` suffix | `cameraConfiguration.ts` |
| Types | camelCase with `Types` suffix | `cameraTypes.ts` |
| Tests | Same as source + `.test` | `sceneInteractionStore.test.ts` |

### Import Order

Imports should be ordered:
1. React and React-related (`react`, `react-dom`)
2. External packages (three, zustand, etc.)
3. Internal absolute imports (using path aliases)
4. Relative imports
5. Type imports (using `import type`)
6. CSS imports

### Path Aliases

Configure in both `vite.config.ts` and `tsconfig.json`:

```typescript
// Path alias mapping
{
  '@': 'frontend/src',
  '@components': 'frontend/src/components',
  '@hooks': 'frontend/src/hooks',
  '@stores': 'frontend/src/stores',
  '@constants': 'frontend/src/constants',
  '@types': 'frontend/src/types',
  '@utils': 'frontend/src/utils',
}
```

### Component Structure

Components follow this internal structure:
1. Type imports
2. Dependency imports
3. Store/hook imports
4. Type definitions (if component-specific)
5. Component function
6. Export

### Store Pattern

Zustand stores follow this pattern:
1. Import zustand
2. Define state interface
3. Define actions interface
4. Create store with `create<State & Actions>()`
5. Export hook

---

## Testing Strategy

### What to Test

| Category | Coverage Target | Test Type |
|----------|-----------------|-----------|
| Zustand Stores | 100% | Unit |
| Custom Hooks | >80% | Unit |
| Utility Functions | 100% | Unit |
| React Components | Not tested | N/A |

### What NOT to Test

- React components (too coupled to Three.js/WebGL)
- Three.js rendering logic
- CSS/styling
- Third-party library internals

### Test File Structure

```
tests/
├── frontend/
│   ├── hooks/
│   │   ├── useCameraPositionAnimation.test.ts
│   │   ├── useCameraScrollBehavior.test.ts
│   │   └── useLightingController.test.ts
│   ├── stores/
│   │   ├── sceneInteractionStore.test.ts
│   │   ├── threeJSSceneStore.test.ts
│   │   └── userInterfaceStore.test.ts
│   └── utils/
│       └── classNameUtils.test.ts
├── helpers/
│   ├── storeMocks.ts
│   ├── testUtils.tsx
│   └── threeMocks.ts
└── setup.ts
```

### Test Conventions

**Naming:**
- Test files: `{source-file-name}.test.ts`
- Describe blocks: Source module/function name
- It blocks: Start with "should" + expected behavior

**Structure:**
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

describe('moduleName', () => {
  beforeEach(() => {
    // Reset state
  });

  it('should do expected behavior', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### Mocking Strategy

**Zustand Stores:** Use mock factories that return typed mock objects.

**Three.js Objects:** Use minimal mock objects with required properties only.

**Browser APIs:** Mock in `tests/setup.ts` (HTMLMediaElement, matchMedia, etc.)

---

## CI/CD Configuration

### GitHub Actions Workflow

**File:** `.github/workflows/ci.yml`

**Triggers:**
- `push` to `main` and `develop`
- `pull_request` to `main` and `develop`

**Jobs:**

1. **frontend-lint**
   - Runs: `npm run lint`
   - Node.js: 24
   - Fails if lint errors exist

2. **frontend-tests**
   - Runs: `npm test -- --run`
   - Node.js: 24
   - Generates coverage report
   - Fails if tests fail or coverage below threshold

3. **status-check**
   - Depends on: frontend-lint, frontend-tests
   - Purpose: Single required check for branch protection
   - Always runs if dependencies complete
   - Reports overall success/failure

### CI Environment

- No secrets required
- No deployment (local deployment only)
- No backend jobs
- Coverage thresholds enforced

---

## Root Package Scripts

The root `package.json` contains orchestration scripts only:

```json
{
  "scripts": {
    "start": "npm run start --workspace=frontend",
    "build": "npm run build --workspace=frontend",
    "test": "npm run test --workspace=frontend",
    "lint": "npm run lint --workspace=frontend",
    "check": "npm run lint && npm run test -- --run",
    "type-check": "npm run type-check --workspace=frontend"
  },
  "workspaces": ["frontend"]
}
```

**Note:** npm workspaces used for monorepo orchestration. All actual dependencies live in `frontend/package.json`.

---

## Commit Message Format

All commits must follow Conventional Commits:

```
type(scope): brief description

Detail 1
Detail 2
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code change that neither fixes nor adds
- `chore`: Build, CI, tooling changes
- `docs`: Documentation only
- `test`: Test only changes
- `style`: Formatting, no code change

**Scopes:**
- `vite`: Vite configuration
- `vitest`: Test infrastructure
- `eslint`: Linting configuration
- `ci`: GitHub Actions
- `structure`: Directory/file organization
- `sanitize`: Code cleanup

**Author Configuration:**
```
Author & Committer: HatmanStack
Email: 82614182+HatmanStack@users.noreply.github.com
```

---

## Verification Criteria

Before marking any phase complete:

1. **Build passes:** `npm run build` exits 0
2. **Lint passes:** `npm run lint` exits 0
3. **Tests pass:** `npm test -- --run` exits 0
4. **Type check passes:** `npm run type-check` exits 0
5. **No regressions:** Application runs correctly with `npm start`

---

## Risk Mitigation

### Migration Risks

| Risk | Mitigation |
|------|------------|
| Import path breakage | Batch update with regex, verify with TypeScript |
| Test migration failures | Migrate one test file at a time, verify each |
| Missing dependencies | Run `npm install` verification after package.json changes |
| Vite config errors | Start minimal, add features incrementally |

### Rollback Strategy

If a phase fails:
1. `git stash` any uncommitted changes
2. `git reset --hard` to last known good commit
3. Review error logs
4. Fix issues before reattempting

---

## Definition of Done

A phase is complete when:
- [ ] All tasks in the phase are marked complete
- [ ] All verification criteria pass
- [ ] Commit history follows conventional commits
- [ ] No console errors in browser
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] All tests pass with coverage thresholds met
