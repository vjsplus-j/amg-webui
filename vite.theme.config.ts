import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import { packageAlias, publicizePaths, isPublishExternal } from './build/shared.mjs'

const root = __dirname

/**
 * Independent theme package build.
 * - `index` / `core` JS (ESM + CJS + d.ts)
 * - `style.css` from style-entry (precompiled tokens + brands)
 */
export default defineConfig({
  plugins: [
    dts({
      include: [
        'packages/theme/core.ts',
        'packages/theme/core/**/*.ts',
        'packages/theme/build-entry.ts',
        'packages/theme/services/**/*.ts',
        'packages/theme/specs.ts',
        'packages/theme/design/**/*.ts'
      ],
      exclude: ['packages/theme/**/*.spec.ts'],
      outDir: resolve(root, 'dist/theme'),
      entryRoot: resolve(root, 'packages/theme'),
      insertTypesEntry: false,
      rollupTypes: false,
      copyDtsFiles: true,
      logLevel: 'error',
      skipDiagnostics: true,
      beforeWriteFile: (filePath, content) => {
        if (filePath.endsWith('build-entry.d.ts')) {
          return {
            filePath: filePath.replace(/build-entry\.d\.ts$/, 'index.d.ts'),
            content
          }
        }
        return { filePath, content }
      }
    })
  ],
  resolve: { alias: packageAlias },
  build: {
    lib: {
      entry: {
        index: resolve(root, 'packages/theme/build-entry.ts'),
        core: resolve(root, 'packages/theme/core.ts')
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        format === 'es' ? `${entryName}.js` : `${entryName}.cjs`
    },
    outDir: resolve(root, 'dist/theme'),
    emptyOutDir: true,
    sourcemap: true,
    cssCodeSplit: false,
    rollupOptions: {
      external: (id) => id === '@vue/runtime-core' || isPublishExternal(id),
      output: {
        assetFileNames: (assetInfo) =>
          assetInfo.name?.endsWith('.css') ? 'style.css' : 'assets/[name][extname]',
        chunkFileNames: 'chunks/[name]-[hash].js',
        paths: publicizePaths,
        globals: { vue: 'Vue' }
      }
    }
  }
})
