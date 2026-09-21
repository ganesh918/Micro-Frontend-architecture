import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['packages/**/src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: ['packages/**/src/**/*.ts'],
      exclude: ['**/*.test.ts', '**/index.ts'],
    },
  },
  resolve: {
    alias: {
      '@mfd/shared-types': path.resolve(__dirname, 'packages/shared-types/src'),
      '@mfd/shared-utils': path.resolve(__dirname, 'packages/shared-utils/src'),
      '@mfd/shared-auth': path.resolve(__dirname, 'packages/shared-auth/src'),
      '@mfd/shared-ui': path.resolve(__dirname, 'packages/shared-ui/src'),
    },
  },
});
