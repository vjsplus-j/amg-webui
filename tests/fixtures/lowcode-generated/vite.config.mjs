import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { packageAlias } from '../../../build/shared.mjs'

const fixtureRoot = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(fixtureRoot, '../../..')

export default defineConfig({
  root: fixtureRoot,
  plugins: [vue()],
  resolve: {
    alias: packageAlias
  },
  css: {
    preprocessorOptions: {
      scss: { api: 'modern-compiler' }
    }
  },
  build: {
    outDir: resolve(fixtureRoot, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(fixtureRoot, 'index.html')
    }
  },
  server: {
    fs: { allow: [repoRoot, fixtureRoot] }
  }
})
