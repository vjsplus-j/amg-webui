/**
 * Compute source / contract hashes for evidence freshness (P0-02).
 */
import { createHash } from 'node:crypto'
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { componentDirRel } from '../component-package-map.mjs'

const SOURCE_FILES = ['index.vue', 'types.ts', 'style.scss', 'service.ts']

function walkFiles(dir, prefix = '') {
  const out = []
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name
    const abs = join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...walkFiles(abs, rel))
    } else if (entry.isFile()) {
      out.push({ rel, abs })
    }
  }
  return out
}

/** Collect canonical component source paths (sorted) for hashing. */
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
  return paths.sort((a, b) => a.localeCompare(b))
}

export function sha256Text(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex')
}

export function sha256File(abs) {
  return sha256Text(readFileSync(abs, 'utf8'))
}

export function hashPaths(paths) {
  const hash = createHash('sha256')
  for (const p of paths) {
    hash.update(p.replace(/\\/g, '/'))
    hash.update('\0')
    hash.update(readFileSync(p, 'utf8'))
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
  const sourceHash = sourcePaths.length ? hashPaths(sourcePaths) : null

  const contractPath = join(hardeningRoot, 'contracts', `${name}.json`)
  const contractHash = existsSync(contractPath) ? sha256File(contractPath) : null
  const gitSha = readGitSha(root)

  return {
    name,
    rel,
    abs,
    sourcePaths,
    sourceHash,
    contractHash,
    gitSha
  }
}
