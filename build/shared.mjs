/**
 * Shared helpers for library publish builds.
 * Internal monorepo aliases stay `@amg-webui/*`; emitted consumer imports use `amg-webui/*`.
 */
import { resolve, dirname, relative } from 'node:path'
import { readdirSync, statSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/** PascalCase / camelCase → kebab-case (`DataTable` → `data-table`) */
export function toKebab(name) {
  return String(name)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase()
}

/** `@amg-webui/foo` → `amg-webui/foo` */
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
export const dependencyExternals = ['@bwip-js/generic']

export function isPublishExternal(id) {
  if (peerExternals.includes(id)) return true
  if (dependencyExternals.includes(id)) return true
  if (typeof id === 'string' && id.startsWith('@bwip-js/')) return true
  if (isAmgPackageId(id)) return true
  return false
}

export function publicizePaths(id) {
  return publicizeId(id)
}

export const packageAlias = {
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

export function collectTsEntries(pkgRelDir) {
  const abs = resolve(root, 'packages', pkgRelDir)
  const entries = {}
  if (!existsSync(abs)) return entries

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
      entries[key] = full
    }
  }

  walk(abs)
  return entries
}

export function listBaseComponentNames() {
  const baseRoot = resolve(root, 'packages/components/base')
  const names = []
  for (const name of readdirSync(baseRoot)) {
    const dir = resolve(baseRoot, name)
    if (!statSync(dir).isDirectory()) continue
    if (existsSync(resolve(dir, 'index.ts'))) names.push(name)
  }
  return names.sort()
}

export const BIZ_DOMAINS = ['login', 'users', 'orders', 'content', 'settings']

export function componentEsImportPath(pascalName) {
  return `./dist/es/components/base/${pascalName}/index.js`
}

export function componentTypesPath(pascalName) {
  return `./dist/components/base/${pascalName}/index.d.ts`
}

export function bizEsImportPath(domain) {
  return `./dist/es/components/business/${domain}/index.js`
}

export function bizTypesPath(domain) {
  return `./dist/components/business/${domain}/index.d.ts`
}

export { resolve, relative, existsSync }
