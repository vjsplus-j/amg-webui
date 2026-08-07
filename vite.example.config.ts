import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { packageAlias } from './build/shared.mjs'

const root = __dirname

/** Example debug shell — npm run dev */
export default defineConfig({
  root: resolve(root, 'example'),
  plugins: [vue()],
  resolve: { alias: { ...packageAlias, '@': resolve(root, 'packages') } },
  server: {
    fs: { strict: false, allow: [root] }
  },
  build: {
    outDir: resolve(root, 'example-dist'),
    emptyOutDir: true
  }
})
