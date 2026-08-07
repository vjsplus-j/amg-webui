/**
 * Compile each leaf component style.scss →
 * dist/es/components/{base|industry}/<Name>/style.css
 *
 * Prefer Sass over Vite multi-entry CSS: Rollup cssCodeSplit can merge /
 * mis-name sibling chunks and leave empty style.js without style.css.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import * as sass from 'sass'
import {
  listLeafComponentNames,
  resolveComponentLayer,
  root
} from './shared.mjs'

const loadPaths = [
  resolve(root, 'packages'),
  resolve(root, 'packages/theme'),
  resolve(root, 'node_modules')
]

function resolveAmgUrl(url) {
  if (typeof url !== 'string' || !url.startsWith('@amg-webui/')) return null
  const rest = url.slice('@amg-webui/'.length).replace(/\\/g, '/')
  const bare = rest.replace(/\.(scss|sass|css)$/i, '')
  const candidates = [
    resolve(root, 'packages', rest),
    resolve(root, 'packages', `${rest}.scss`),
    resolve(root, 'packages', `${rest}.css`),
    resolve(root, 'packages', `${bare}.scss`),
    resolve(root, 'packages', `${bare}.css`),
    resolve(root, 'packages', dirname(bare), `_${bare.split('/').pop()}.scss`)
  ]
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate
  }
  return null
}

/** Resolve `@amg-webui/*` the same way Vite aliases do. */
const amgImporter = {
  canonicalize(url) {
    const file = resolveAmgUrl(url)
    return file ? pathToFileURL(file) : null
  },
  load(canonicalUrl) {
    const filePath = canonicalUrl.pathname
    const contents = readFileSync(filePath, 'utf8')
    const syntax = filePath.endsWith('.css') ? 'css' : 'scss'
    return { contents, syntax }
  }
}

let ok = 0
let skipped = 0
const errors = []

for (const name of listLeafComponentNames()) {
  const layer = resolveComponentLayer(name)
  const scssPath = resolve(
    root,
    'packages/components',
    layer,
    name,
    'style.scss'
  )
  if (!existsSync(scssPath)) {
    skipped += 1
    continue
  }
  const outPath = resolve(
    root,
    'dist/es/components',
    layer,
    name,
    'style.css'
  )
  try {
    const result = sass.compile(scssPath, {
      loadPaths,
      importers: [amgImporter],
      style: 'compressed',
      // silence @import deprecation noise from component SCSS
      silenceDeprecations: ['import', 'legacy-js-api']
    })
    mkdirSync(dirname(outPath), { recursive: true })
    writeFileSync(outPath, `${result.css}\n`, 'utf8')
    ok += 1
  } catch (err) {
    errors.push(`${layer}/${name}: ${err instanceof Error ? err.message : err}`)
  }
}

console.log(
  `[component-styles] compiled=${ok} skipped(no scss)=${skipped} errors=${errors.length}`
)
if (errors.length) {
  console.error(errors.slice(0, 15).join('\n'))
  if (errors.length > 15) console.error(`… +${errors.length - 15} more`)
  process.exit(1)
}
