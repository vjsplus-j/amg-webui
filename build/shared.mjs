/**
 * Shared helpers for library publish builds.
 * Internal monorepo aliases stay `@amg-webui/*`; emitted consumer imports use `amg-webui/*`.
 */
import { resolve, dirname, relative, extname } from 'node:path'
import { readdirSync, statSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/** PascalCase / camelCase → kebab-case (`DataTable` → `data-table`, `InputOTP` → `input-otp`) */
export function toKebab(name) {
  return String(name)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase()
}

/** `@amg-webui/foo` → `amg-webui/foo` (leave non-AMG ids unchanged) */
export function publicizeId(id) {
  if (id === '@amg-webui') return 'amg-webui'
  if (typeof id === 'string' && id.startsWith('@amg-webui/')) {
    return `amg-webui/${id.slice('@amg-webui/'.length)}`
  }
  return id
}

export function isAmgPackageId(id) {
  return (
    id === '@amg-webui' ||
    id === 'amg-webui' ||
    (typeof id === 'string' &&
      (id.startsWith('@amg-webui/') || id.startsWith('amg-webui/')))
  )
}

export const peerExternals = ['vue', '@lucide/vue', 'vue-router']

/** Runtime npm deps that must stay external in published ESM (listed in package.json dependencies) */
export const dependencyExternals = ['@bwip-js/generic']

/** Rollup `external` predicate for publish builds */
export function isPublishExternal(id) {
  if (peerExternals.includes(id)) return true
  if (dependencyExternals.includes(id)) return true
  if (id.startsWith('@bwip-js/')) return true
  if (isAmgPackageId(id)) return true
  return false
}

/** Vite/Rollup `paths` map so emitted imports resolve for consumers */
export function publicizePaths(id) {
  return publicizeId(id)
}

export const packageAlias = {
  '@amg-webui/components/base': resolve(root, 'packages/components/base'),
  '@amg-webui/components/business': resolve(root, 'packages/components/business'),
  '@amg-webui/components': resolve(root, 'packages/components'),
  '@amg-webui/business': resolve(root, 'packages/components/business'),
  '@amg-webui/core': resolve(root, 'packages/components/core'),
  '@amg-webui/form': resolve(root, 'packages/components/form'),
  '@amg-webui/data': resolve(root, 'packages/components/data'),
  '@amg-webui/overlay': resolve(root, 'packages/components/overlay'),
  '@amg-webui/charts': resolve(root, 'packages/components/charts'),
  '@amg-webui/editor': resolve(root, 'packages/components/editor'),
  '@amg-webui/media': resolve(root, 'packages/components/media'),
  '@amg-webui/gb28181': resolve(root, 'packages/components/gb28181'),
  '@amg-webui/onvif': resolve(root, 'packages/components/onvif'),
  '@amg-webui/hooks': resolve(root, 'packages/hooks'),
  '@amg-webui/telemetry': resolve(root, 'packages/telemetry/index.ts'),
  '@amg-webui/security': resolve(root, 'packages/security/index.ts'),
  '@amg-webui/lowcode': resolve(root, 'packages/lowcode'),
  '@amg-webui/runtime': resolve(root, 'packages/runtime/index.ts'),
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

/**
 * Collect `.ts` files under a package dir as Rollup multi-entry map.
 * Keys are posix-like paths relative to `packages/` (no extension).
 */
export function collectTsEntries(pkgRelDir, { skip = [] } = {}) {
  const abs = resolve(root, 'packages', pkgRelDir)
  const entries = {}
  if (!existsSync(abs)) return entries

  const skipSet = new Set(skip)

  function walk(dir) {
    for (const name of readdirSync(dir)) {
      const full = resolve(dir, name)
      const st = statSync(full)
      if (st.isDirectory()) {
        walk(full)
        continue
      }
      if (!name.endsWith('.ts')) continue
      if (name.endsWith('.spec.ts') || name.endsWith('.d.ts')) continue
      const rel = relative(resolve(root, 'packages'), full).replace(/\\/g, '/')
      const key = rel.replace(/\.ts$/, '')
      if (skipSet.has(key) || skipSet.has(name)) continue
      entries[key] = full
    }
  }

  walk(abs)
  return entries
}

import {
  allMappedComponentNames,
  componentToPackage,
  componentDirRel
} from '../scripts/component-package-map.mjs'

/** All UI component names across packages (excludes business domains) */
export function listBaseComponentNames() {
  return allMappedComponentNames()
}

export function componentPackageOf(pascalName) {
  return componentToPackage.get(pascalName)
}

export const BIZ_DOMAINS = ['login', 'users', 'orders', 'content', 'settings']

/** Dist path for a component on-demand entry */
export function componentEsImportPath(pascalName) {
  const pkg = componentToPackage.get(pascalName)
  if (pkg === 'lowcode') {
    return `./dist/es/lowcode/ui/${pascalName}/index.js`
  }
  return `./dist/es/components/${pkg}/${pascalName}/index.js`
}

export function componentTypesPath(pascalName) {
  const pkg = componentToPackage.get(pascalName)
  if (pkg === 'lowcode') {
    return `./dist/lowcode/ui/${pascalName}/index.d.ts`
  }
  return `./dist/components/${pkg}/${pascalName}/index.d.ts`
}

export { componentDirRel }

export function bizEsImportPath(domain) {
  return `./dist/es/components/business/${domain}/index.js`
}

export function bizTypesPath(domain) {
  return `./dist/components/business/${domain}/index.d.ts`
}

export { resolve, relative, extname, existsSync }
