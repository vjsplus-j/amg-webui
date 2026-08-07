/**
 * Emit stable `…/style.css` next to each on-demand entry and rewrite
 * hashed `assets/*.css` imports to `./style.css`.
 */
export function stableComponentCssPlugin() {
  return {
    name: 'amg-stable-component-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      /** @type {Map<string, string>} */
      const assetSources = new Map()
      for (const [fileName, item] of Object.entries(bundle)) {
        if (item.type !== 'asset' || !fileName.endsWith('.css')) continue
        const src = item.source
        assetSources.set(
          fileName,
          typeof src === 'string' ? src : Buffer.from(src).toString('utf8')
        )
      }

      /** @type {Set<string>} */
      const consumedAssets = new Set()

      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type !== 'chunk' || !chunk.isEntry) continue
        if (!/(^|\/)index\.js$/.test(fileName)) continue

        const importedCss = chunk.viteMetadata?.importedCss
        if (!importedCss || importedCss.size === 0) continue

        const parts = []
        for (const cssFile of importedCss) {
          const source = assetSources.get(cssFile)
          if (source == null) continue
          parts.push(source)
          consumedAssets.add(cssFile)
        }
        if (!parts.length) continue

        const styleFileName = fileName.replace(/index\.js$/, 'style.css')
        this.emitFile({
          type: 'asset',
          fileName: styleFileName,
          source: `${parts.join('\n')}\n`
        })

        // Ensure the entry always pulls stable local CSS (even if Rollup
        // had moved CSS imports into a shared helper chunk).
        if (!/\bimport\s*["']\.\/style\.css["']/.test(chunk.code)) {
          chunk.code = `import "./style.css";\n${chunk.code}`
        } else {
          chunk.code = chunk.code.replace(
            /import\s*["'][^"']+\.css["'];?\s*/g,
            'import "./style.css";\n'
          )
        }
      }

      for (const cssFile of consumedAssets) {
        delete bundle[cssFile]
      }
    }
  }
}
