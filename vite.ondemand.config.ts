/**
 * On-demand ESM — one entry per base component / biz domain → dist/es/**
 * Shared `@amg-webui/*` deps stay external and are rewritten to `amg-webui/*`.
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { existsSync } from 'fs'
import {
  root,
  packageAlias,
  listBaseComponentNames,
  BIZ_DOMAINS,
  isPublishExternal,
  publicizePaths
} from './build/shared.mjs'

function collectEntries() {
  const entries = {}
  for (const name of listBaseComponentNames()) {
    const indexTs = resolve(root, 'packages/components/base', name, 'index.ts')
    if (existsSync(indexTs)) {
      entries[`components/base/${name}/index`] = indexTs
    }
  }
  for (const domain of BIZ_DOMAINS) {
    const indexTs = resolve(root, 'packages/components/business', domain, 'index.ts')
    if (existsSync(indexTs)) {
      entries[`components/business/${domain}/index`] = indexTs
    }
  }
  return entries
}

const entries = collectEntries()

export default defineConfig({
  plugins: [vue()],
  resolve: { alias: packageAlias },
  build: {
    lib: {
      entry: entries,
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`
    },
    outDir: resolve(root, 'dist/es'),
    emptyOutDir: true,
    sourcemap: true,
    cssCodeSplit: true,
    rollupOptions: {
      external: isPublishExternal,
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        paths: publicizePaths,
        exports: 'named'
      }
    }
  }
})
