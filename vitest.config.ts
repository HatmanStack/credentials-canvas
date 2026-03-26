import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'frontend/src'),
      '@components': resolve(__dirname, 'frontend/src/components'),
      '@hooks': resolve(__dirname, 'frontend/src/hooks'),
      '@stores': resolve(__dirname, 'frontend/src/stores'),
      '@constants': resolve(__dirname, 'frontend/src/constants'),
      '@types': resolve(__dirname, 'frontend/src/types'),
      '@utils': resolve(__dirname, 'frontend/src/utils'),
      'stores': resolve(__dirname, 'frontend/src/stores'),
      'types': resolve(__dirname, 'frontend/src/types'),
      'hooks': resolve(__dirname, 'frontend/src/hooks'),
      'constants': resolve(__dirname, 'frontend/src/constants'),
      'test-helpers': resolve(__dirname, 'frontend/tests/helpers'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./frontend/tests/helpers/setup.ts'],
    include: ['frontend/tests/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['frontend/src/**/*.{ts,tsx}'],
      exclude: ['frontend/src/**/*.d.ts', 'frontend/src/main.tsx'],
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
  },
});
