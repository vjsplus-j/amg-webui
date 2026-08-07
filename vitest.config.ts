import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { packageAlias } from './build/shared.mjs'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    include: ['tests/unit/**/*.{test,spec}.ts']
  },
  resolve: {
    alias: packageAlias
  }
})
