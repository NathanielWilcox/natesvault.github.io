import { defineConfig } from 'vitest/config'

export default defineConfig({
  base: '/',
  server: {
    fs: {
      allow: ['..'],
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/test-setup.ts', 'src/**/*.test.{ts,tsx}'],
      reporter: ['text', 'html'],
      thresholds: {
        branches: 75,
        functions: 80,
        lines: 80,
        statements: 80,
        'src/App.tsx': {
          branches: 75,
          functions: 80,
          lines: 80,
          statements: 80,
        },
        'src/DocsPage.tsx': {
          branches: 75,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
})
