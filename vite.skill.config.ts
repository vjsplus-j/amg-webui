import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

const root = __dirname

/** Independent optional Skill Runtime build. It is never imported by the main entry. */
export default defineConfig({
  plugins: [
    dts({
      include: ['packages/skill/**/*.ts'],
      outDir: resolve(root, 'dist/skill'),
      entryRoot: resolve(root, 'packages/skill'),
      insertTypesEntry: false,
      rollupTypes: false,
      copyDtsFiles: true,
      logLevel: 'error'
    })
  ],
  build: {
    lib: {
      entry: {
        index: resolve(root, 'packages/skill/index.ts'),
        core: resolve(root, 'packages/skill/core.ts')
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        format === 'es' ? `${entryName}.js` : `${entryName}.cjs`
    },
    outDir: resolve(root, 'dist/skill'),
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      external: ['vue'],
      output: {
        chunkFileNames: 'chunks/[name]-[hash].js',
        globals: { vue: 'Vue' }
      }
    }
  }
})

