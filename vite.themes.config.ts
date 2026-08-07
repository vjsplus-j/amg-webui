import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = dirname(fileURLToPath(import.meta.url))
const brands = [
  'mercedes',
  'linear',
  'porsche',
  'lamborghini',
  'ferrari',
  'apple',
  'wechat',
  'alipay'
] as const

const entry: Record<string, string> = {}
for (const brand of brands) {
  entry[brand] = resolve(root, `packages/theme/styles/brand-entries/${brand}.ts`)
}

/**
 * Per-brand precompiled CSS → dist/themes/<brand>.css
 * Separate from dist/theme/ (JS ThemeService runtime).
 */
export default defineConfig({
  build: {
    lib: {
      entry,
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`
    },
    outDir: resolve(root, 'dist/themes'),
    emptyOutDir: true,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const names = assetInfo.names ?? []
          const cssName = names.find((n) => n.endsWith('.css')) ?? assetInfo.name
          if (cssName?.endsWith('.css')) {
            const base = cssName.replace(/\.css$/i, '')
            if ((brands as readonly string[]).includes(base)) return `${base}.css`
          }
          // Fallback: originalFileNames often include the entry stem
          const orig = assetInfo.originalFileNames?.[0] ?? ''
          for (const brand of brands) {
            if (orig.includes(`brand-entries/${brand}`) || orig.includes(`${brand}.ts`)) {
              return `${brand}.css`
            }
          }
          return '[name][extname]'
        }
      }
    }
  }
})
