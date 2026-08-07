import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import { packageAlias } from './build/shared.mjs'

const root = __dirname

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
  resolve: { alias: packageAlias },
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
