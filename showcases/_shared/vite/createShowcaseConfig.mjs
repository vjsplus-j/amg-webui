import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { packageAlias } from '../../../build/shared.mjs'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const sharedRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/** Vite config factory for showcases — aliases `@amg-webui/*` to workspace packages. */
export function createShowcaseConfig(showcaseDir, port) {
  const publicAlias = Object.fromEntries(
    Object.entries(packageAlias)
      .filter(([key]) => key.startsWith('@amg-webui'))
      .map(([key, value]) => [key.replace(/^@amg-webui/, 'amg-webui'), value])
  )

  return defineConfig({
    root: showcaseDir,
    plugins: [vue()],
    resolve: {
      alias: {
        ...packageAlias,
        ...publicAlias,
        'amg-webui': resolve(repoRoot, 'packages/index.ts'),
        '@showcase/shared': sharedRoot
      }
    },
    server: {
      port,
      fs: { strict: false, allow: [repoRoot] }
    },
    build: {
      outDir: resolve(showcaseDir, 'dist'),
      emptyOutDir: true
    }
  })
}
