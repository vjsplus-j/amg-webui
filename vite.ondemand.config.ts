import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'path'
import { readdirSync, existsSync, statSync } from 'fs'
import { fileURLToPath } from 'url'

const root = dirname(fileURLToPath(import.meta.url))

const alias = {
  '@amg-webui/components/base': resolve(root, 'packages/components/base'),
  '@amg-webui/components/business': resolve(root, 'packages/components/business'),
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

function collectEntries(): Record<string, string> {
  const entries: Record<string, string> = {}
  const baseRoot = resolve(root, 'packages/components/base')
  for (const name of readdirSync(baseRoot)) {
    const dir = resolve(baseRoot, name)
    if (!statSync(dir).isDirectory()) continue
    const indexTs = resolve(dir, 'index.ts')
    if (existsSync(indexTs)) {
      entries[`components/base/${name}/index`] = indexTs
    }
  }
  const bizRoot = resolve(root, 'packages/components/business')
  for (const domain of ['login', 'users', 'orders', 'content', 'settings'] as const) {
    const indexTs = resolve(bizRoot, domain, 'index.ts')
    if (existsSync(indexTs)) {
      entries[`components/business/${domain}/index`] = indexTs
    }
  }
  return entries
}

const entries = collectEntries()

/**
 * On-demand ESM — one file per component / biz domain under dist/es/.
 * Shared deps are externalized so consumers tree-shake via package exports / aliases.
 * (preserveModules + Vue virtual ids is unreliable on Windows.)
 */
export default defineConfig({
  plugins: [vue()],
  resolve: { alias },
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
      external: [
        'vue',
        '@lucide/vue',
        'vue-router',
        /^@amg-webui\//,
        /^@amg-webui$/
      ],
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  }
})
