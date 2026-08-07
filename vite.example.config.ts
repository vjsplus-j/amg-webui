import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { packageAlias } from './build/shared.mjs'

const root = __dirname

/** Mirror `@amg-webui/*` → `amg-webui/*` so intro demos can use published import paths. */
const publicAlias = Object.fromEntries(
  Object.entries(packageAlias)
    .filter(([key]) => key.startsWith('@amg-webui'))
    .map(([key, value]) => [key.replace(/^@amg-webui/, 'amg-webui'), value])
)

/** Example debug shell — npm run dev */
export default defineConfig({
  root: resolve(root, 'example'),
  plugins: [vue()],
  resolve: {
    alias: {
      ...packageAlias,
      ...publicAlias,
      '@': resolve(root, 'packages')
    }
  },
  server: {
    fs: { strict: false, allow: [root] }
  },
  build: {
    outDir: resolve(root, 'example-dist'),
    emptyOutDir: true
  }
})
