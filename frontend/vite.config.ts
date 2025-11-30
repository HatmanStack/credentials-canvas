/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@constants': resolve(__dirname, 'src/constants'),
      '@types': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/utils'),
      'stores': resolve(__dirname, 'src/stores'),
      'types': resolve(__dirname, 'src/types'),
      'hooks': resolve(__dirname, 'src/hooks'),
      'constants': resolve(__dirname, 'src/constants'),
      'test-helpers': resolve(__dirname, '../tests/helpers'),
    },
  },
  assetsInclude: ['**/*.glsl'],
  build: {
    target: 'ES2020',
    outDir: 'dist',
  },
  publicDir: 'public',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [resolve(__dirname, '../tests/setup.ts')],
    include: [resolve(__dirname, '../tests/**/*.test.{ts,tsx}')],
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
