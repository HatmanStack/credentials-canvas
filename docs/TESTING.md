# Testing Guide

This document describes the testing infrastructure, patterns, and conventions for the credentials-canvas project.

## Overview

The project uses **Jest** and **React Testing Library** for unit testing business logic, custom hooks, and Zustand stores. Testing focuses on high-value logic rather than UI integration tests, following the decisions outlined in Phase-0 of the modernization plan.

## Running Tests

### Basic Commands

```bash
# Run all tests in watch mode (development)
npm test

# Run all tests once
npm test -- --watchAll=false

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode (non-interactive)
npm run test:ci

# Run tests in watch mode (explicit)
npm run test:watch

# Debug tests
npm run test:debug
```

### Running Specific Tests

```bash
# Run tests matching a pattern
npm test -- stores

# Run tests in a specific file
npm test -- sceneInteractionStore.test.ts

# Run tests matching a name pattern
npm test -- --testNamePattern="should increment"

# Run tests with verbose output
npm test -- --verbose
```

## Test Structure

Tests are organized by type in the `src/__tests__/` directory:

```
src/__tests__/
├── stores/                 # Zustand store tests
│   ├── sceneInteractionStore.test.ts
│   ├── userInterfaceStore.test.ts
│   └── threeJSSceneStore.test.ts
├── utils/                  # Utility function tests
│   ├── classNameUtils.test.ts
│   └── testUtils.tsx      # Test helper utilities
└── mocks/                  # Mock factories
    ├── storeMocks.ts      # Zustand store mocks
    └── threeMocks.ts      # Three.js object mocks
```

## What We Test

### ✅ Currently Tested

- **Zustand Stores** (>90% coverage)
  - All state updates
  - All actions
  - Reset functionality
  - State persistence

- **Utility Functions** (100% coverage)
  - Class name merging
  - Edge cases
  - Input validation

### ❌ Not Tested (By Design)

- **React Components** - Too coupled to Three.js/WebGL, requires complex mocking
- **Custom Hooks** - Deferred for future implementation
- **Integration Tests** - Out of scope for Phase 4
- **E2E Tests** - Requires separate tool (Playwright/Cypress)

> **Note:** The decision to focus on unit tests for business logic is documented in Phase-0. Component and integration tests can be added in future phases.

## Writing Tests

### Naming Convention

- **Test files:** `{fileName}.test.ts` or `{fileName}.test.tsx`
- **Test suites:** Use `describe()` to group related tests
- **Test cases:** Start with "should" - `it('should increment count when called')`

### Structure (Arrange-Act-Assert)

```typescript
it('should update state when action is called', () => {
  // Arrange - Set up test data and initial state
  const {result} = renderHook(() => useSceneInteractionStore());

  // Act - Execute the code being tested
  act(() => {
    result.current.incrementClickCount();
  });

  // Assert - Verify the results
  expect(result.current.totalClickCount).toBe(1);
});
```

### Example: Testing a Zustand Store

```typescript
import {renderHook, act} from '@testing-library/react';
import {useSceneInteractionStore} from 'stores/sceneInteractionStore';

describe('sceneInteractionStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const {result} = renderHook(() => useSceneInteractionStore());
    act(() => {
      result.current.resetSceneInteractionState();
    });
  });

  it('should increment click count', () => {
    const {result} = renderHook(() => useSceneInteractionStore());

    act(() => {
      result.current.incrementClickCount();
    });

    expect(result.current.totalClickCount).toBe(1);
  });
});
```

### Example: Testing Utility Functions

```typescript
import {cn} from 'utils/classNameUtils';

describe('cn utility', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle Tailwind conflicts', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('should handle conditional classes', () => {
    expect(cn('base', true && 'active')).toBe('base active');
  });
});
```

## Mocking

### Zustand Store Mocks

We provide mock factories for all stores in `__tests__/mocks/storeMocks.ts`:

```typescript
import {createMockSceneInteractionStore} from '__tests__/mocks/storeMocks';

// Create a mock store with default values
const mockStore = createMockSceneInteractionStore();

// Create a mock store with custom initial state
const customStore = createMockSceneInteractionStore({
  totalClickCount: 5,
  isCloseUpViewActive: true,
});
```

### Three.js Object Mocks

Mock Three.js objects are available in `__tests__/mocks/threeMocks.ts`:

```typescript
import {
  createMockVector3,
  createMockScene,
  createMockCamera,
} from '__tests__/mocks/threeMocks';

const mockCamera = createMockCamera();
const mockScene = createMockScene();
```

## Coverage Goals

| Category | Target Coverage | Current Status |
|----------|----------------|----------------|
| Stores | >90% | ✅ Achieved |
| Utils | 100% | ✅ Achieved |
| Hooks | >80% | ⏭️ Future work |
| Components | N/A | ❌ Not tested by design |

## Coverage Reports

### Generating Coverage

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/lcov-report/index.html
```

### Understanding Coverage Metrics

- **Statements:** Percentage of executable statements run
- **Branches:** Percentage of conditional branches (if/else) tested
- **Functions:** Percentage of functions called
- **Lines:** Percentage of lines executed

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - uses: codecov/codecov-action@v3
```

### CI Test Script

The `test:ci` script is optimized for CI environments:

```json
"test:ci": "react-scripts test --env=jsdom --ci --coverage --maxWorkers=2"
```

- `--ci`: Non-interactive mode
- `--coverage`: Generate coverage reports
- `--maxWorkers=2`: Limit parallelization for CI stability

## Common Patterns

### Reset Store State Between Tests

```typescript
beforeEach(() => {
  const {result} = renderHook(() => useSceneInteractionStore());
  act(() => {
    result.current.resetSceneInteractionState();
  });
});
```

### Test Async State Updates

```typescript
it('should update state asynchronously', async () => {
  const {result} = renderHook(() => useStore());

  await act(async () => {
    await result.current.fetchData();
  });

  expect(result.current.data).toBeDefined();
});
```

### Test Conditional Logic

```typescript
describe('conditional behavior', () => {
  it('should show active state when condition is true', () => {
    const {result} = renderHook(() => useStore());

    act(() => {
      result.current.setIsActive(true);
    });

    expect(result.current.isActive).toBe(true);
  });

  it('should show inactive state when condition is false', () => {
    const {result} = renderHook(() => useStore());

    act(() => {
      result.current.setIsActive(false);
    });

    expect(result.current.isActive).toBe(false);
  });
});
```

## Troubleshooting

### Tests Fail with "Not Implemented: HTMLMediaElement"

This is handled in `setupTests.ts`:

```typescript
window.HTMLMediaElement.prototype.play = () => Promise.resolve();
window.HTMLMediaElement.prototype.pause = () => {};
```

### Tests Fail with Module Resolution Errors

Ensure `jest.config.js` has correct path mappings matching `tsconfig.json`:

```javascript
moduleNameMapper: {
  '^components/(.*)$': '<rootDir>/src/components/$1',
  '^hooks/(.*)$': '<rootDir>/src/hooks/$1',
  '^stores/(.*)$': '<rootDir>/src/stores/$1',
  // ...
}
```

### Store State Persists Between Tests

Always reset stores in `beforeEach`:

```typescript
beforeEach(() => {
  const {result} = renderHook(() => useStore());
  act(() => {
    result.current.resetState();
  });
});
```

## Best Practices

### ✅ Do

- Test behavior, not implementation
- Use descriptive test names
- Follow Arrange-Act-Assert pattern
- Reset state between tests
- Test edge cases and error conditions
- Keep tests focused and independent

### ❌ Don't

- Test implementation details
- Write brittle tests coupled to specific values
- Share mutable state between tests
- Test third-party libraries
- Write tests just for coverage numbers

## Future Enhancements

Potential testing improvements for future phases:

1. **Custom Hook Tests** - Add comprehensive tests for all custom hooks
2. **Integration Tests** - Test component interactions with stores
3. **E2E Tests** - Playwright for full user journeys
4. **Visual Regression** - Chromatic or Percy for UI changes
5. **Performance Tests** - Lighthouse CI for performance monitoring

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Zustand Testing Guide](https://docs.pmnd.rs/zustand/guides/testing)

## Getting Help

If you encounter issues with tests:

1. Check this documentation
2. Review existing test files for patterns
3. Check `setupTests.ts` for global mocks
4. Review Phase-0 documentation for architectural decisions
5. Ask the team in Slack #engineering channel
