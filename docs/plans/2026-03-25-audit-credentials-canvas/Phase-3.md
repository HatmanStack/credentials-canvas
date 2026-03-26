# Phase 3: [IMPLEMENTER] Test Coverage and Quality

## Phase Goal

Bring test coverage above the 70% threshold, remove placeholder assertions, and add meaningful tests for the components extracted in Phase 2. Also improve test quality where existing tests mock away the behavior they claim to test.

**Success criteria:**
- Overall statement coverage >= 70% (currently 69.25%)
- No `expect(true).toBe(true)` placeholder assertions
- New tests exist for YouTubeMusicPlayer, ArcadeIframe, and SliderController
- Lamp.tsx coverage improves from 4% to at least 50%
- `npm run check` passes (which enforces coverage thresholds)

**Estimated tokens:** ~15,000

## Prerequisites

- Phase 2 complete (components extracted, architecture fixed)
- `npm run check` passes

## Tasks

### Task 1: Remove placeholder test assertion

**Goal:** Replace the `expect(true).toBe(true)` placeholder in `useCameraPositionAnimation.test.ts` with a meaningful test.

**Findings addressed:** eval Test Value (red flag), health-audit #15 (MEDIUM)

**Files to modify/create:**
- `frontend/tests/frontend/hooks/useCameraPositionAnimation.test.ts` -- Replace placeholder

**Implementation steps:**
1. Read the full test file to understand what is already tested and find the placeholder at approximately line 380.
2. Determine what behavior the placeholder was meant to test (based on the `describe`/`it` block name).
3. Write a real assertion that tests the described behavior. If the test name is vague, test an untested branch of `useCameraPositionAnimation` (the audit notes 62.5% branch coverage).
4. Run `cd frontend && npx vitest --run tests/frontend/hooks/useCameraPositionAnimation.test.ts` to verify.

**Verification checklist:**
- [x] No `expect(true).toBe(true)` exists in the test file
- [x] The replacement assertion tests real behavior
- [x] The test passes

**Commit message template:**
```
test(hooks): replace placeholder assertion in useCameraPositionAnimation tests

- Remove expect(true).toBe(true) and add meaningful behavior test
```

---

### Task 2: Add tests for extracted SceneAnimations components

**Goal:** Write tests for the three components extracted in Phase 2: YouTubeMusicPlayer, ArcadeIframe, and SliderController.

**Findings addressed:** health-audit #15 (MEDIUM, SceneAnimations 60% coverage), eval Test Value

**Files to modify/create:**
- `frontend/tests/frontend/components/YouTubeMusicPlayer.test.tsx` -- CREATE
- `frontend/tests/frontend/components/ArcadeIframe.test.tsx` -- CREATE
- `frontend/tests/frontend/components/SliderController.test.tsx` -- CREATE

**Prerequisites:**
- Read the three new component files created in Phase 2
- Read existing component test patterns in `frontend/tests/frontend/components/` (e.g., SceneEnvironment.test.tsx, AudioController.test.tsx) to follow established mocking patterns
- Read `frontend/tests/helpers/threeMocks.ts` and `frontend/tests/helpers/setup.ts` for available test utilities

**Implementation steps:**
1. For each component, follow this pattern:
   - Mock R3F hooks (`@react-three/fiber`, `@react-three/drei`) using `vi.mock`
   - Mock Zustand stores using the patterns in `frontend/tests/helpers/storeMocks.ts`
   - Test key behaviors: state transitions, side effects, conditional rendering
2. **YouTubeMusicPlayer tests:**
   - Test that YouTube script tag is only injected once (idempotency)
   - Test that player is destroyed on unmount
   - Test that the component reads from the correct store state
3. **ArcadeIframe tests:**
   - Test that iframe is rendered when `shouldShowArcadeIframe` is true
   - Test that iframe is hidden when `shouldShowArcadeIframe` is false
4. **SliderController tests:**
   - Test that drag events update spring animation targets
   - Test that the component renders slider meshes
5. Run `cd frontend && npx vitest --run tests/frontend/components/YouTubeMusicPlayer.test.tsx tests/frontend/components/ArcadeIframe.test.tsx tests/frontend/components/SliderController.test.tsx`.

**Verification checklist:**
- [x] Each new component has a test file with at least 3 test cases
- [x] Tests use existing mock patterns (no new mock infrastructure)
- [x] All new tests pass
- [x] `npm run check` passes

**Commit message template:**
```
test(three): add tests for extracted SceneAnimations components

- YouTubeMusicPlayer: script injection, cleanup, store integration
- ArcadeIframe: visibility toggle, conditional rendering
- SliderController: drag events, spring animation
```

---

### Task 3: Improve Lamp.tsx test coverage

**Goal:** Increase Lamp.tsx coverage from 4% to at least 50%. The component renders custom geometry particles with a GLSL shader.

**Findings addressed:** health-audit #15 (MEDIUM)

**Files to modify/create:**
- `frontend/tests/frontend/components/Lamp.test.tsx` -- CREATE or modify existing

**Prerequisites:**
- Read `frontend/src/components/three/Lamp.tsx` to understand the component
- Read existing Three.js component test patterns

**Implementation steps:**
1. Read Lamp.tsx. It likely exports `CustomGeometryParticles` and/or a `Lamp` component.
2. Check if a test file already exists: search `frontend/tests/` for `Lamp`.
3. Write tests that:
   - Test component rendering with mocked R3F context
   - Test that the particle count and geometry attributes are set up correctly
   - Test any conditional logic (light on/off, theme-based colors)
   - Test the interaction handler if the lamp is clickable
4. Mock `useFrame` and `useThree` from R3F. Mock the shader material if needed.
5. Run the test to verify.

**Verification checklist:**
- [x] Lamp.test.tsx exists with at least 4 test cases
- [x] Lamp.tsx statement coverage is above 50%
- [x] `npm run check` passes

**Commit message template:**
```
test(three): add tests for Lamp component

- Test particle geometry setup, conditional rendering, interactions
- Improves coverage from 4% to >50%
```

---

### Task 4: Improve useCameraPositionAnimation branch coverage

**Goal:** Increase branch coverage from 62.5% to at least 70%.

**Findings addressed:** health-audit #15 (MEDIUM)

**Files to modify/create:**
- `frontend/tests/frontend/hooks/useCameraPositionAnimation.test.ts` -- Add tests for uncovered branches

**Implementation steps:**
1. Run `cd frontend && npx vitest --run --coverage tests/frontend/hooks/useCameraPositionAnimation.test.ts` and check the coverage report to identify which branches are uncovered.
2. Write tests targeting the uncovered branches. Common candidates:
   - Edge cases in animation completion
   - Different camera position index values
   - Close-up vs normal view transitions
3. Run tests with coverage to verify improvement.

**Verification checklist:**
- [x] Branch coverage for `useCameraPositionAnimation.ts` is at or above 70%
- [x] All new tests pass
- [x] `npm run check` passes

**Commit message template:**
```
test(hooks): improve useCameraPositionAnimation branch coverage

- Add tests for uncovered animation edge cases
- Brings branch coverage above 70% threshold
```

---

### Task 5: Verify overall coverage meets threshold

**Goal:** Run the full test suite with coverage and confirm all thresholds are met (70% branches, functions, lines, statements).

**Files to modify/create:** None (verification only, unless gaps remain)

**Implementation steps:**
1. Run `npm run check` from repo root (this runs lint + tests with coverage).
2. If any threshold is still below 70%, identify the files dragging it down from the coverage report.
3. Add targeted tests for the lowest-coverage files until all thresholds pass.
4. If the threshold is met, no further action needed.

**Verification checklist:**
- [x] `npm run check` passes (all coverage thresholds met)
- [x] No placeholder assertions exist anywhere in the test suite

**Commit message template (if additional tests needed):**
```
test: bring coverage above 70% threshold

- Add targeted tests for [specific files]
```

## Phase Verification

After all tasks are complete:

1. Run `npm run check` from repo root. It must pass, confirming coverage thresholds are met.
2. Search the entire test directory for `expect(true).toBe(true)` and confirm zero results.
3. Verify test files exist for: YouTubeMusicPlayer, ArcadeIframe, SliderController, Lamp.
4. Check coverage report: overall statements >= 70%, branches >= 70%.

**Known limitations:**
- `SceneModel.test.tsx` tests store interactions rather than component rendering. A full rewrite is out of scope for this audit; the existing tests are preserved as-is since they do exercise code paths. A future effort could replace them with integration-style tests.
