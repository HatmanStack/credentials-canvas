module.exports = {
  // Use Create React App's Jest preset
  preset: 'react-scripts',

  // Map TypeScript path aliases to match tsconfig.json
  moduleNameMapper: {
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^stores/(.*)$': '<rootDir>/src/stores/$1',
    '^types/(.*)$': '<rootDir>/src/types/$1',
    '^constants/(.*)$': '<rootDir>/src/constants/$1',
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
    '^test-helpers/(.*)$': '<rootDir>/src/test-helpers/$1',
    // Handle CSS imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  // Setup files to run after Jest is initialized
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  // Test environment
  testEnvironment: 'jsdom',

  // Test file patterns - match .test.ts(x) files
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
  ],

  // Ignore test utilities and mocks
  testPathIgnorePatterns: [
    '/node_modules/',
  ],

  // Coverage collection configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
    '!src/types/**/*',
    '!src/__tests__/**/*',
  ],

  // Coverage thresholds
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Coverage reporters
  coverageReporters: ['text', 'text-summary', 'html', 'lcov'],
};
