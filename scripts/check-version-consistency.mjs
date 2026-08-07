/**
 * check:version-consistency — Version SSOT is package.json "version".
 * Other docs/manifests must match or declare pre-release honesty.
 *
 * Usage: node scripts/check-version-consistency.mjs
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const version = pkg.version

const checks = []

function checkFile(rel, re, label) {
  const p = join(root, rel)
  if (!existsSync(p)) {
    checks.push({ ok: false, rel, detail: 'missing file' })
    return
  }
  const text = readFileSync(p, 'utf8')
  const m = text.match(re)
  if (!m) {
    checks.push({ ok: false, rel, detail: `${label}: pattern not found` })
    return
  }
  const found = m[1]
  const ok = found === version
  checks.push({
    ok,
    rel,
    detail: ok ? `matches ${version}` : `${label}=${found} != package.json ${version}`
  })
}

// CHANGELOG should mention current version as heading or badge
{
  const p = join(root, 'CHANGELOG.md')
  if (!existsSync(p)) {
    checks.push({ ok: false, rel: 'CHANGELOG.md', detail: 'missing' })
  } else {
    const text = readFileSync(p, 'utf8')
    const ok = text.includes(version) || text.includes(`[${version}]`)
    checks.push({
      ok,
      rel: 'CHANGELOG.md',
      detail: ok ? `mentions ${version}` : `does not mention package.json version ${version}`
    })
  }
}

checkFile(
  'README.md',
  /(?:当前版本|version|Version|v)[：:\s]*[`*]*v?(\d+\.\d+\.\d+(?:-[\w.]+)?)/,
  'readme version'
)

// Optional release docs — warn if they claim a different release number as current
for (const rel of ['docs/RELEASE.md', 'docs/RELEASE_0.1.md', 'docs/V0_1_SUBSET.md']) {
  const p = join(root, rel)
  if (!existsSync(p)) continue
  const text = readFileSync(p, 'utf8')
  // Look for "current" / "package version" style claims
  const claimed = [...text.matchAll(/\b(\d+\.\d+\.\d+)\b/g)].map((m) => m[1])
  const foreign = claimed.filter((v) => v !== version && !v.startsWith('0.0.'))
  // Allow historical mentions; fail only if file claims a single different "current" pin
  const pin = text.match(
    /(?:current|package\.json|npm install amg-webui@)\s*[`:]?\s*v?(\d+\.\d+\.\d+)/i
  )
  if (pin && pin[1] !== version) {
    checks.push({
      ok: false,
      rel,
      detail: `pins ${pin[1]} but package.json is ${version}`
    })
  } else {
    checks.push({
      ok: true,
      rel,
      detail: foreign.length
        ? `historical versions present (ok); SSOT=${version}`
        : `aligned with ${version}`
    })
  }
}

// installation.md npm install pin
{
  const rel = 'docs/guide/installation.md'
  const p = join(root, rel)
  if (existsSync(p)) {
    const text = readFileSync(p, 'utf8')
    const m = text.match(/npm install amg-webui@([^\s]+)/)
    if (m && m[1] !== version && m[1] !== 'latest') {
      checks.push({
        ok: false,
        rel,
        detail: `npm install pin ${m[1]} != ${version}`
      })
    } else {
      checks.push({ ok: true, rel, detail: `install pin ok (${m?.[1] || 'unpinned'})` })
    }
  }
}

const failed = checks.filter((c) => !c.ok)
for (const c of checks) {
  console.log(`${c.ok ? 'PASS' : 'FAIL'}  ${c.rel}: ${c.detail}`)
}
console.log(
  `[check:version-consistency] ssot=${version} pass=${checks.length - failed.length} fail=${failed.length}`
)
process.exit(failed.length ? 1 : 0)
