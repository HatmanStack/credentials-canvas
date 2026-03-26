# Phase 0: Foundation

This phase defines shared conventions, architecture decisions, and testing strategy that apply to all subsequent phases. No code changes are made in this phase.

## Architecture Decision Records

### ADR-1: Delete dead code rather than refactor it

Dead code identified across audits (useLightingController, InteractiveMeshElement, brandedTypes, unused DRACO files) will be deleted outright. We will not attempt to "wire in" unused modules. If the functionality is needed later, it can be reimplemented with proper integration from the start.

**Rationale:** The dead code has diverged from the live code paths. Attempting to integrate it risks introducing bugs from stale logic.

### ADR-2: Extract SceneAnimations into focused components, not a hook library

The 315-line SceneAnimations component will be split into separate component files (YouTubeMusicPlayer, ArcadeIframe, SliderController). We will NOT extract logic into hooks that are only used by one component, as that adds indirection without reuse benefit.

**Rationale:** The component mixes five distinct concerns. Splitting into components preserves colocation of rendering + logic while achieving single responsibility. Hooks would be appropriate if logic were shared across components, but it is not.

### ADR-3: Fix types incrementally, do not wire branded types

The branded types module (`brandedTypes.ts`) will be deleted as dead code in Phase 1. Type improvements (replacing `Vector3 | boolean`, replacing unsafe casts) will use standard TypeScript patterns (discriminated unions, type guards, `instanceof` checks). We will not build a branded type system across the codebase.

**Rationale:** Branded types add complexity. The codebase is small enough that standard TypeScript patterns provide sufficient safety without the overhead.

### ADR-4: Pre-commit hooks over CI-only enforcement

Lint and type-check enforcement will be added as pre-commit hooks (via Husky) in addition to CI. Commit message format will be enforced via commitlint.

**Rationale:** Catching issues before push is faster feedback than waiting for CI.

## Tech Stack (no changes)

**Note:** The repository's `CLAUDE.md` says "React 18" but `frontend/package.json` specifies React 19. The actual installed version is React 19. The CLAUDE.md discrepancy is corrected in Phase 5, Task 1. Until then, treat React 19 as the ground truth.

- React 19 + TypeScript + Three.js (React Three Fiber / Drei) + Zustand + Vite + Tailwind CSS
- Testing: Vitest + React Testing Library + jsdom
- CI: GitHub Actions

## Commit Message Format

All commits use conventional commits:

```
type(scope): brief description

- Detail 1
- Detail 2
```

Types: `fix`, `feat`, `refactor`, `test`, `chore`, `docs`, `ci`
Scopes: `three`, `camera`, `stores`, `hooks`, `config`, `types`, `ci`, `docs`

## Testing Strategy

- **Environment:** jsdom with polyfills for `matchMedia` and HTML media elements (already configured in `frontend/tests/helpers/setup.ts`)
- **Three.js mocking:** Use existing mocks in `frontend/tests/helpers/threeMocks.ts`. All Three.js/R3F rendering is mocked; tests verify behavior through store interactions and callback invocations.
- **New component tests** (for extracted SceneAnimations pieces): Follow the pattern in existing component tests. Mock R3F hooks (`useFrame`, `useThree`) via `vi.mock`. Test state transitions and side effects, not visual output.
- **Coverage target:** 70% across branches, functions, lines, statements (already configured in `vitest.config.ts`).
- **Test file location:** `frontend/tests/frontend/` mirroring `src/` structure. Helpers in `frontend/tests/helpers/`.
- **Running tests:** `npm run check` from repo root (runs lint + tests in single-run mode).

## File Organization Conventions

- Components: `frontend/src/components/` organized by domain (`three/`, `controls/`, `ui/`)
- Hooks: `frontend/src/hooks/` (only for shared/reusable hooks)
- Constants: `frontend/src/constants/`
- Types: `frontend/src/types/`
- Utils: `frontend/src/utils/`
- Path aliases: `@`, `@components`, `@hooks`, `@stores`, `@constants`, `@types`, `@utils` all resolve to `frontend/src/...`
