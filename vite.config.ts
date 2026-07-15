import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

const root = __dirname

const alias = {
  '@amg-webui/components/base': resolve(root, 'packages/components/base'),
  '@amg-webui/components/business': resolve(root, 'packages/components/business'),
  '@amg-webui/components': resolve(root, 'packages/components'),
  '@amg-webui/hooks': resolve(root, 'packages/hooks'),
  '@amg-webui/telemetry': resolve(root, 'packages/telemetry/index.ts'),
  '@amg-webui/theme': resolve(root, 'packages/theme'),
  '@amg-webui/icons': resolve(root, 'packages/icons'),
  '@amg-webui/utils': resolve(root, 'packages/utils'),
  '@amg-webui/types': resolve(root, 'packages/types'),
  '@amg-webui/locale': resolve(root, 'packages/locale'),
  '@amg-webui/constants': resolve(root, 'packages/constants'),
  '@amg-webui/animations': resolve(root, 'packages/animations'),
  '@amg-webui': resolve(root, 'packages'),
  '@': resolve(root, 'packages')
}

/** Library build — packages/index.ts → dist/ */
export default defineConfig({
  plugins: [vue()],
  resolve: { alias },
  build: {
    lib: {
      entry: resolve(root, 'packages/index.ts'),
      name: 'AmgWebUI',
      fileName: 'amg-webui',
      formats: ['es', 'umd']
    },
    outDir: resolve(root, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      external: ['vue', '@lucide/vue'],
      output: {
        globals: {
          vue: 'Vue',
          '@lucide/vue': 'LucideVue'
        },
        assetFileNames: (assetInfo) =>
          assetInfo.name?.endsWith('.css') ? 'style.css' : 'assets/[name][extname]'
      }
    },
    sourcemap: true
  }
})
