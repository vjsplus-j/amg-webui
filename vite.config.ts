import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

const root = __dirname

const alias = {
  '@amg-webui/components/base': resolve(root, 'packages/components/base'),
  '@amg-webui/components/business': resolve(root, 'packages/components/business'),
  '@amg-webui/components/industry': resolve(root, 'packages/components/industry'),
  '@amg-webui/components': resolve(root, 'packages/components'),
  '@amg-webui/hooks': resolve(root, 'packages/hooks'),
  '@amg-webui/telemetry': resolve(root, 'packages/telemetry/index.ts'),
  '@amg-webui/security': resolve(root, 'packages/security/index.ts'),
  '@amg-webui/lowcode': resolve(root, 'packages/lowcode/index.ts'),
  '@amg-webui/skill/core': resolve(root, 'packages/skill/core.ts'),
  '@amg-webui/skill': resolve(root, 'packages/skill/index.ts'),
  '@amg-webui/theme/core': resolve(root, 'packages/theme/core.ts'),
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
  plugins: [
    vue(),
    dts({
      include: ['packages/**/*.ts', 'packages/**/*.vue'],
      exclude: ['packages/**/*.spec.ts', 'packages/skill/**', 'example/**'],
      outDir: resolve(root, 'dist'),
      entryRoot: resolve(root, 'packages'),
      insertTypesEntry: true,
      rollupTypes: false,
      copyDtsFiles: true,
      logLevel: 'error'
    })
  ],
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
      external: ['vue', '@lucide/vue', 'vue-router'],
      output: {
        globals: {
          vue: 'Vue',
          '@lucide/vue': 'LucideVue',
          'vue-router': 'VueRouter'
        },
        assetFileNames: (assetInfo) =>
          assetInfo.name?.endsWith('.css') ? 'style.css' : 'assets/[name][extname]'
      }
    },
    sourcemap: true,
    cssCodeSplit: false
  }
})
