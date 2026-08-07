/**
 * Runtime packages → dist/{telemetry,security,lowcode,icons,hooks,utils,locale,types,constants,animations}/
 * preserveModules so deep imports (`amg-webui/utils/env`) resolve after publish.
 * Emitted imports use `amg-webui/*` (not `@amg-webui/*`).
 * Vue plugin required: `packages/lowcode/ui/**` ships SFC entrypoints.
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {
  root,
  packageAlias,
  collectTsEntries,
  isPublishExternal,
  publicizePaths
} from './build/shared.mjs'

const RUNTIME_DIRS = [
  'telemetry',
  'security',
  'lowcode',
  'runtime',
  'icons',
  'hooks',
  'utils',
  'locale',
  'types',
  'constants',
  'animations'
]

const entries = Object.assign(
  {},
  ...RUNTIME_DIRS.map((dir) => collectTsEntries(dir))
)

export default defineConfig({
  plugins: [vue()],
  resolve: { alias: packageAlias },
  build: {
    lib: {
      entry: entries,
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`
    },
    outDir: root + '/dist',
    emptyOutDir: false,
    sourcemap: true,
    cssCodeSplit: false,
    rollupOptions: {
      external: isPublishExternal,
      output: {
        preserveModules: true,
        preserveModulesRoot: root + '/packages',
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        paths: publicizePaths,
        exports: 'named'
      }
    }
  }
})
