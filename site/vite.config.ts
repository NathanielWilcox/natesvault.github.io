import { defineConfig } from 'vitest/config'

export default defineConfig({
  base: '/natesvault.github.io/',
  server: {
    fs: {
      allow: ['..'],
    },
  },
  test: {
    environment: 'jsdom',
    include: ['site/src/**/*.test.{ts,tsx}'],
    setupFiles: ['./site/src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['site/src/**/*.{ts,tsx}', 'apps/**/*.{js,ts,tsx}'],
      exclude: ['site/src/main.tsx', 'site/src/test-setup.ts', 'site/src/**/*.test.{ts,tsx}'],
      reportsDirectory: './site/coverage',
      reporter: ['text', 'html'],
      thresholds: {
        branches: 75,
        functions: 80,
        lines: 80,
        statements: 80,
        'site/src/App.tsx': {
          branches: 75,
          functions: 80,
          lines: 80,
          statements: 80,
        },
        'site/src/DocsPage.tsx': {
          branches: 75,
          functions: 80,
          lines: 80,
          statements: 80,
        },
        'apps/starboard/counter.js': {
          branches: 80,
          functions: 100,
          lines: 100,
          statements: 100,
        },
      },
    },
  },
})
