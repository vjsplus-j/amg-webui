import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    include: ['tests/unit/**/*.{test,spec}.ts']
  },
  resolve: {
    alias: {
      '@amg-webui': resolve(__dirname, 'packages')
    }
  }
})
