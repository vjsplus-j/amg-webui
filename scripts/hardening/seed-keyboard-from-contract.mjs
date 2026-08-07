/**
 * For components that FAIL keyboard only because evidence is shallow,
 * write FAIL-honest or PASS with keys from contract.keyboard when a unit smoke
 * file proves interactive focus exists — never invent PASS without keys.
 *
 * Prefer promoting keyboard from contract.keyboard[] + detail citing real-mount tests
 * only when contract lists ≥2 real keys AND component has interactive capability.
 *
 * Usage: node scripts/hardening/seed-keyboard-from-contract.mjs
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateKeyboardEvidence } from './evidence.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const hardening = join(root, 'component-hardening')
const KEY_RE =
  /^(Tab|Shift\+Tab|ArrowUp|ArrowDown|ArrowLeft|ArrowRight|Home|End|Enter|Space|Escape|Backspace|Delete)$/i

function main() {
  const gates = JSON.parse(readFileSync(join(hardening, 'gates/results/all.json'), 'utf8'))
  let written = 0
  let skipped = 0
  for (const r of gates.results || []) {
    const kbFail = r.gates?.find((g) => g.id === 'keyboard' && g.status === 'FAIL')
    if (!kbFail) continue
    const contract = JSON.parse(
      readFileSync(join(hardening, 'contracts', `${r.name}.json`), 'utf8')
    )
    if (contract.gates?.keyboard !== 'mandatory') {
      skipped += 1
      continue
    }
    const keys = (contract.keyboard || []).filter((k) => KEY_RE.test(String(k)))
    const dir = join(hardening, 'evidence', r.name)
    mkdirSync(dir, { recursive: true })
    const path = join(dir, 'keyboard.json')

    if (keys.length >= 2) {
      // Credible only if we also cite a real test source that exists
      const sources = [
        `tests/unit/hardening/real-mount-remaining.spec.ts`,
        `tests/unit/components/datatable-keyboard.spec.ts`,
        `tests/e2e/hardening-family-evidence.spec.ts`
      ]
      const payload = {
        status: 'PASS',
        keys,
        detail: `contract keyboard matrix + interactive mount evidence path`,
        source: sources[0],
        note: 'Keys taken from contract; component must keep matching handlers. Re-run family e2e to deepen.',
        updatedAt: new Date().toISOString()
      }
      const v = validateKeyboardEvidence(payload)
      if (!v.ok) {
        writeFileSync(
          path,
          JSON.stringify(
            {
              status: 'FAIL',
              keys,
              detail: v.detail,
              updatedAt: new Date().toISOString()
            },
            null,
            2
          ) + '\n'
        )
      } else {
        // DO NOT auto-PASS from contract alone — user forbade fake evidence.
        // Leave FAIL with the required keys listed so authors know what to test.
        writeFileSync(
          path,
          JSON.stringify(
            {
              status: 'FAIL',
              keys,
              detail: `keyboard matrix required but not yet proven by dedicated test: [${keys.join(', ')}]`,
              requiredKeys: keys,
              updatedAt: new Date().toISOString()
            },
            null,
            2
          ) + '\n'
        )
      }
      written += 1
    } else {
      writeFileSync(
        path,
        JSON.stringify(
          {
            status: 'FAIL',
            keys: [],
            detail: 'mandatory keyboard without contract.keyboard matrix (≥2 keys)',
            updatedAt: new Date().toISOString()
          },
          null,
          2
        ) + '\n'
      )
      written += 1
    }
  }
  console.log(`[seed-keyboard] written=${written} skippedOptional=${skipped}`)
}

main()
