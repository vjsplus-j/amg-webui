/**
 * CI gate: modifications to already-CLOSED components require an explicit reopen reason.
 *
 * Compares against the CLOSED registry on the merge base (not the working tree),
 * so the PR that first closes a component is allowed.
 *
 * Allowed reasons: bug | regression | security | dependency-breaking
 * Provide via env CLOSED_REOPEN_REASON or commit trailer: Closed-Reopen: bug
 *
 * Usage:
 *   node scripts/check-closed-components.mjs
 *   node scripts/check-closed-components.mjs --base origin/main
 */
import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ALLOWED = new Set(['bug', 'regression', 'security', 'dependency-breaking'])
const REGISTRY = 'component-hardening/closed-components.json'

function loadClosedFromText(text) {
  try {
    const data = JSON.parse(text)
    return data.components || {}
  } catch {
    return {}
  }
}

function loadClosedAtRef(ref) {
  try {
    const text = execSync(`git show ${ref}:${REGISTRY}`, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    })
    return loadClosedFromText(text)
  } catch {
    return {}
  }
}

function loadClosedWorking() {
  const p = join(root, REGISTRY)
  if (!existsSync(p)) return {}
  return loadClosedFromText(readFileSync(p, 'utf8'))
}

function changedFiles(base) {
  try {
    const range = base.includes('...') ? base : `${base}...HEAD`
    const out = execSync(`git diff --name-only ${range}`, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    })
    return out.split(/\r?\n/).filter(Boolean)
  } catch {
    return []
  }
}

function dirtyFiles() {
  try {
    const out = execSync('git status --porcelain -u', {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    })
    return out
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => line.slice(3).trim().replace(/^"+|"+$/g, ''))
      .filter(Boolean)
  } catch {
    return []
  }
}

function reopenReason() {
  const env = String(process.env.CLOSED_REOPEN_REASON || '').trim().toLowerCase()
  if (env) return env
  try {
    const msg = execSync('git log -1 --pretty=%B', {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    })
    const m = msg.match(/Closed-Reopen:\s*([a-z-]+)/i)
    return m ? m[1].toLowerCase() : ''
  } catch {
    return ''
  }
}

function componentTouched(name, files) {
  const needles = [
    `/${name}/`,
    `component-hardening/contracts/${name}.json`,
    `component-hardening/evidence/${name}/`
  ]
  return files.some((f) => needles.some((n) => f.includes(n)))
}

function main() {
  const args = process.argv.slice(2)
  const baseIdx = args.indexOf('--base')
  const base = baseIdx >= 0 ? args[baseIdx + 1] : null

  // Baseline = already committed CLOSED set (merge-base or HEAD~0 registry on remote/main)
  const baselineClosed = base
    ? loadClosedAtRef(base)
    : loadClosedAtRef('HEAD')
  // If registry itself is new/uncommitted relative to HEAD empty, allow first close
  const baselineNames = Object.keys(baselineClosed).filter(
    (n) => baselineClosed[n]?.status === 'CLOSED'
  )

  if (!baselineNames.length) {
    console.log(
      '[check:closed-components] PASS — no previously CLOSED components on baseline (initial closure OK)'
    )
    process.exit(0)
  }

  const files = [...new Set([...changedFiles(base || 'HEAD'), ...dirtyFiles()])]
  // Editing the registry to close more components is allowed
  const touched = baselineNames.filter((n) => componentTouched(n, files))
  if (!touched.length) {
    console.log('[check:closed-components] PASS — no previously CLOSED components modified')
    process.exit(0)
  }

  const reason = reopenReason()
  if (!ALLOWED.has(reason)) {
    console.error(
      `[check:closed-components] FAIL — modified previously CLOSED components without reopen reason: ${touched.join(', ')}`
    )
    console.error(
      'Allowed: bug | regression | security | dependency-breaking (env CLOSED_REOPEN_REASON or trailer Closed-Reopen:)'
    )
    process.exit(1)
  }
  console.log(
    `[check:closed-components] PASS — reopen allowed (${reason}) for: ${touched.join(', ')}`
  )
}

main()
