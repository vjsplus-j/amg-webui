/**
 * Compute source / contract hashes for evidence freshness (P0-02 / H01).
 *
 * sourceHash MUST be environment-independent:
 *   repo-relative path (forward slashes) + file content
 * Windows / Linux / different absolute roots → identical hash.
 */
import { createHash } from 'node:crypto'
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { componentDirRel } from '../component-package-map.mjs'

const SOURCE_FILES = ['index.vue', 'types.ts', 'style.scss', 'service.ts']

function toRepoRel(root, abs) {
  return relative(resolve(root), resolve(abs)).replace(/\\/g, '/')
}

function walkFiles(dir, prefix = '') {
  const out = []
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name
    const abs = join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...walkFiles(abs, rel))
    } else if (entry.isFile()) {
      out.push({ rel: rel.replace(/\\/g, '/'), abs })
    }
  }
  return out
}

/**
 * Collect component source absolute paths.
 * Sorting for hashing is done in hashPaths by repo-relative path.
 */
export function collectComponentSourcePaths(abs) {
  const paths = []
  for (const name of SOURCE_FILES) {
    const p = join(abs, name)
    if (existsSync(p)) paths.push(p)
  }
  const composablesDir = join(abs, 'composables')
  if (existsSync(composablesDir)) {
    for (const f of walkFiles(composablesDir)) {
      paths.push(f.abs)
    }
  }
  return paths
}

export function sha256Text(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex')
}

export function sha256File(abs) {
  return sha256Text(readFileSync(abs, 'utf8'))
}

/**
 * Hash a list of absolute file paths using repo-relative keys + content.
 * @param {string[]} absPaths
 * @param {{ root: string }} opts — repository root (required for stable keys)
 */
export function hashPaths(absPaths, opts = {}) {
  const root = opts.root
  if (!root) {
    throw new Error('hashPaths requires opts.root for repo-relative hashing')
  }
  const entries = absPaths
    .map((abs) => ({
      rel: toRepoRel(root, abs),
      abs: resolve(abs)
    }))
    .sort((a, b) => a.rel.localeCompare(b.rel))

  const hash = createHash('sha256')
  for (const { rel, abs } of entries) {
    hash.update(rel)
    hash.update('\0')
    hash.update(readFileSync(abs, 'utf8'))
    hash.update('\0')
  }
  return hash.digest('hex')
}

export function readGitSha(root) {
  try {
    return execSync('git rev-parse HEAD', {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
  } catch {
    return null
  }
}

/**
 * @param {string} root repo root
 * @param {string} name component name
 * @param {string} hardeningRoot component-hardening dir
 */
export function hashComponentSource(root, name, hardeningRoot) {
  const rel = componentDirRel(name)
  const abs = join(root, rel)
  const sourcePaths = collectComponentSourcePaths(abs)
  const sourceHash = sourcePaths.length ? hashPaths(sourcePaths, { root }) : null

  const contractPath = join(hardeningRoot, 'contracts', `${name}.json`)
  const contractHash = existsSync(contractPath) ? sha256File(contractPath) : null
  const gitSha = readGitSha(root)

  return {
    name,
    rel: rel.replace(/\\/g, '/'),
    abs,
    sourcePaths,
    sourceHash,
    contractHash,
    gitSha
  }
}
