import { defineConfig } from 'vitest/config'

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  test: {
    globals: true,

    include: ['src/**/*.(spec|test).ts'],
  },

  optimizeDeps: {
    needsInterop: ['lodash'],
  },
})
