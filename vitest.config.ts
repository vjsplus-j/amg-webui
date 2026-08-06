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
      '@amg-webui/components/base': resolve(__dirname, 'packages/components/base'),
      '@amg-webui/components/business': resolve(__dirname, 'packages/components/business'),
      '@amg-webui/components': resolve(__dirname, 'packages/components'),
      '@amg-webui/hooks': resolve(__dirname, 'packages/hooks'),
      '@amg-webui/telemetry': resolve(__dirname, 'packages/telemetry/index.ts'),
      '@amg-webui/skill/core': resolve(__dirname, 'packages/skill/core.ts'),
      '@amg-webui/skill': resolve(__dirname, 'packages/skill/index.ts'),
      '@amg-webui/theme/core': resolve(__dirname, 'packages/theme/core.ts'),
      '@amg-webui/theme': resolve(__dirname, 'packages/theme'),
      '@amg-webui/icons': resolve(__dirname, 'packages/icons'),
      '@amg-webui/utils': resolve(__dirname, 'packages/utils'),
      '@amg-webui/types': resolve(__dirname, 'packages/types'),
      '@amg-webui/locale': resolve(__dirname, 'packages/locale'),
      '@amg-webui/constants': resolve(__dirname, 'packages/constants'),
      '@amg-webui/animations': resolve(__dirname, 'packages/animations'),
      '@amg-webui': resolve(__dirname, 'packages')
    }
  }
})
