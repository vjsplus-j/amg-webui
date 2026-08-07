/**
 * Generate package.json `exports` for published dist-only contract.
 * Deep paths are **explicit** (no `*` wildcards for hooks/utils/locale) so Vite/Webpack
 * resolve cleanly in consumer apps.
 *
 * Public shape:
 *   amg-webui
 *   amg-webui/button · amg-webui/data-table · …
 *   amg-webui/theme · security · lowcode · telemetry · icons · hooks · utils · …
 *   amg-webui/utils/env · amg-webui/hooks/useFocusTrap · …
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  root,
  toKebab,
  listBaseComponentNames,
  BIZ_DOMAINS,
  componentEsImportPath,
  componentStyleImportPath,
  componentTypesPath,
  bizEsImportPath,
  bizTypesPath,
  collectTsEntries
} from '../build/shared.mjs'
import { isPublicExportEntryKey } from './public-export-allowlist.mjs'

function subpath(types, imp, req) {
  const out = {
    import: imp,
    types,
    default: imp
  }
  if (req) out.require = req
  return out
}

/** Emit allowlisted `./pkg` + `./pkg/deep/...` for preserveModules runtime trees */
function addRuntimeTree(exportsMap, pkgDir) {
  const entries = collectTsEntries(pkgDir)
  let added = 0
  let skipped = 0
  for (const key of Object.keys(entries)) {
    if (!isPublicExportEntryKey(key)) {
      skipped += 1
      continue
    }
    // key: `utils/env` | `hooks/useFocusTrap` | `utils/index` | `locale/zh-CN/index`
    const exportKey = key.endsWith('/index')
      ? `./${key.slice(0, -'/index'.length)}`
      : `./${key}`
    exportsMap[exportKey] = subpath(`./dist/${key}.d.ts`, `./dist/${key}.js`)
    added += 1
  }
  return { added, skipped }
}

const exportsMap = {
  '.': {
    import: './dist/amg-webui.js',
    types: './dist/index.d.ts',
    require: './dist/amg-webui.umd.cjs',
    default: './dist/amg-webui.js'
  },
  './style.css': './dist/style.css',
  './dist/style.css': './dist/style.css',
  './package.json': './package.json',

  './theme': subpath(
    './dist/theme/index.d.ts',
    './dist/theme/index.js',
    './dist/theme/index.cjs'
  ),
  './theme/core': subpath(
    './dist/theme/core.d.ts',
    './dist/theme/core.js',
    './dist/theme/core.cjs'
  ),
  './theme/style.css': './dist/theme/style.css',

  './skill': subpath(
    './dist/skill/index.d.ts',
    './dist/skill/index.js',
    './dist/skill/index.cjs'
  ),
  './skill/core': subpath(
    './dist/skill/core.d.ts',
    './dist/skill/core.js',
    './dist/skill/core.cjs'
  ),

  './components/base': subpath(
    './dist/components/core/index.d.ts',
    './dist/es/components/base-barrel.js'
  ),
  './components/business': subpath(
    './dist/components/business/index.d.ts',
    './dist/es/components/business-barrel.js'
  ),
  './business': subpath(
    './dist/components/business/index.d.ts',
    './dist/es/components/business-barrel.js'
  ),
  './core': subpath(
    './dist/components/core/index.d.ts',
    './dist/es/components/core-barrel.js'
  ),
  './components/form': subpath(
    './dist/components/form/index.d.ts',
    './dist/es/components/form-barrel.js'
  ),
  './data': subpath(
    './dist/components/data/index.d.ts',
    './dist/es/components/data-barrel.js'
  ),
  './overlay': subpath(
    './dist/components/overlay/index.d.ts',
    './dist/es/components/overlay-barrel.js'
  ),
  './charts': subpath(
    './dist/components/charts/index.d.ts',
    './dist/es/components/charts-barrel.js'
  ),
  './editor': subpath(
    './dist/components/editor/index.d.ts',
    './dist/es/components/editor-barrel.js'
  ),
  './media': subpath(
    './dist/components/media/index.d.ts',
    './dist/es/components/media-barrel.js'
  ),
  './gb28181': subpath(
    './dist/components/gb28181/index.d.ts',
    './dist/es/components/gb28181-barrel.js'
  ),
  './onvif': subpath(
    './dist/components/onvif/index.d.ts',
    './dist/es/components/onvif-barrel.js'
  ),

  './themes/*': './dist/themes/*',
  './es/*': './dist/es/*'
}

let runtimeAdded = 0
let runtimeSkipped = 0
for (const pkgDir of [
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
]) {
  const { added, skipped } = addRuntimeTree(exportsMap, pkgDir)
  runtimeAdded += added
  runtimeSkipped += skipped
}

for (const name of listBaseComponentNames()) {
  const kebab = toKebab(name)
  exportsMap[`./${kebab}`] = subpath(componentTypesPath(name), componentEsImportPath(name))
  const styleRel = componentStyleImportPath(name)
  if (existsSync(resolve(root, styleRel))) {
    exportsMap[`./${kebab}/style.css`] = styleRel
  }
}

for (const domain of BIZ_DOMAINS) {
  exportsMap[`./biz-${domain}`] = subpath(bizTypesPath(domain), bizEsImportPath(domain))
}

const pkgPath = resolve(root, 'package.json')
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
pkg.exports = exportsMap

/** Publish only compiled artifacts + docs contract — no packages/ source tree */
pkg.files = [
  'dist',
  'README.md',
  'LICENSE',
  'CHANGELOG.md',
  'docs/V0_1_SUBSET.md',
  'docs/RELEASE_0.1.md'
]

writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8')
console.log(
  `[generate:exports] wrote ${Object.keys(exportsMap).length} export entries (dist-only files[])`
)
console.log(
  `[generate:exports] runtime tree allowlist: +${runtimeAdded} public, skipped ${runtimeSkipped} internal`
)
console.log(
  `[generate:exports] sample ./utils/env → ${JSON.stringify(exportsMap['./utils/env'])}`
)
console.log(
  `[generate:exports] sample ./hooks/useFocusTrap → ${JSON.stringify(exportsMap['./hooks/useFocusTrap'])}`
)
console.log(
  `[generate:exports] sample ./runtime (barrel only) → ${JSON.stringify(exportsMap['./runtime'])}`
)
if (exportsMap['./runtime/escape-stack']) {
  console.error('[generate:exports] FAIL: internal ./runtime/escape-stack must not be exported')
  process.exit(1)
}
