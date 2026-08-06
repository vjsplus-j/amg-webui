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
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  root,
  toKebab,
  listBaseComponentNames,
  BIZ_DOMAINS,
  componentEsImportPath,
  componentTypesPath,
  bizEsImportPath,
  bizTypesPath,
  collectTsEntries
} from '../build/shared.mjs'

function subpath(types, imp, req) {
  const out = {
    import: imp,
    types,
    default: imp
  }
  if (req) out.require = req
  return out
}

/** Emit explicit `./pkg` + `./pkg/deep/...` for preserveModules runtime trees */
function addRuntimeTree(exportsMap, pkgDir) {
  const entries = collectTsEntries(pkgDir)
  for (const key of Object.keys(entries)) {
    // key: `utils/env` | `hooks/useFocusTrap` | `utils/index` | `locale/zh-CN/index`
    const exportKey = key.endsWith('/index')
      ? `./${key.slice(0, -'/index'.length)}`
      : `./${key}`
    exportsMap[exportKey] = subpath(`./dist/${key}.d.ts`, `./dist/${key}.js`)
  }
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
    './dist/components/base/index.d.ts',
    './dist/es/components/base-barrel.js'
  ),
  './components/business': subpath(
    './dist/components/business/index.d.ts',
    './dist/es/components/business-barrel.js'
  ),

  './themes/*': './dist/themes/*',
  './es/*': './dist/es/*'
}

for (const pkgDir of [
  'telemetry',
  'security',
  'lowcode',
  'icons',
  'hooks',
  'utils',
  'locale',
  'types',
  'constants',
  'animations'
]) {
  addRuntimeTree(exportsMap, pkgDir)
}

for (const name of listBaseComponentNames()) {
  const kebab = toKebab(name)
  exportsMap[`./${kebab}`] = subpath(componentTypesPath(name), componentEsImportPath(name))
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
  `[generate:exports] sample ./utils/env → ${JSON.stringify(exportsMap['./utils/env'])}`
)
console.log(
  `[generate:exports] sample ./hooks/useFocusTrap → ${JSON.stringify(exportsMap['./hooks/useFocusTrap'])}`
)
