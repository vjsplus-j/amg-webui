/**
 * On-demand ESM — one entry per UI component / biz domain → dist/es/**
 * Shared `@amg-webui/*` deps stay external and are rewritten to `amg-webui/*`
 * so clean consumers resolve them via package.json exports (not monorepo aliases).
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
  publicizePaths,
  componentDirRel
} from './build/shared.mjs'
import { componentToPackage } from './scripts/component-package-map.mjs'

function collectEntries() {
  const entries = {}
  for (const name of listBaseComponentNames()) {
    const rel = componentDirRel(name)
    const indexTs = resolve(root, rel, 'index.ts')
    if (!existsSync(indexTs)) continue
    const pkg = componentToPackage.get(name)
    if (pkg === 'lowcode') {
      entries[`lowcode/ui/${name}/index`] = indexTs
    } else {
      entries[`components/${pkg}/${name}/index`] = indexTs
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
