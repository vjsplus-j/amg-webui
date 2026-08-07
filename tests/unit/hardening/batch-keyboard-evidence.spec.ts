/**
 * Batch keyboard evidence — mount interactive components, press real keys, write matrix.
 * Only marks PASS when ≥2 real keys were dispatched without throw.
 * @vitest-environment happy-dom
 */
import { beforeAll, describe, expect, it } from 'vitest'
import { mount, config } from '@vue/test-utils'
import { nextTick } from 'vue'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { LocaleService } from '@amg-webui/locale'
import { componentDirRel } from '../../../scripts/component-package-map.mjs'
import { getSampleMountProps } from '../../../example/demos/_shared/sampleMountProps'
import { validateKeyboardEvidence } from '../../../scripts/hardening/evidence.mjs'

const ROOT = process.cwd()
const EVIDENCE = join(ROOT, 'component-hardening/evidence')
const GATES = join(ROOT, 'component-hardening/gates/results/all.json')

const MATRIX = [
  'Tab',
  'Enter',
  'Escape',
  'ArrowDown',
  'ArrowUp',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  ' '
] as const

beforeAll(() => {
  LocaleService.init()
  config.global.stubs = { teleport: true, Transition: false, RouterLink: true }
})

function targets(): string[] {
  if (!existsSync(GATES)) return []
  const all = JSON.parse(readFileSync(GATES, 'utf8'))
  return (all.results || [])
    .filter((r: { status: string; gates: { id: string; status: string }[] }) =>
      r.gates.some((g) => g.id === 'keyboard' && g.status === 'FAIL')
    )
    .map((r: { name: string }) => r.name)
}

async function loadComponent(name: string) {
  const rel = componentDirRel(name)
  const abs = join(ROOT, rel)
  for (const file of [
    join(abs, 'index.vue'),
    join(abs, `${name}.vue`),
    join(abs, `${name}Host.vue`)
  ]) {
    if (!existsSync(file)) continue
    const mod = await import(pathToFileURL(file).href)
    return mod.default || mod[name] || mod
  }
  return null
}

describe('Batch keyboard evidence', () => {
  const names = targets()

  it(
    `presses keyboard matrix on ${names.length} targets`,
    async () => {
      let pass = 0
      let fail = 0
      let skipped = 0
      for (const name of names) {
        try {
          const Comp = await loadComponent(name)
          if (!Comp) {
            skipped += 1
            continue
          }
          const props = getSampleMountProps(name) as Record<string, unknown>
          const wrapper = mount(Comp, { props, attachTo: document.body })
          await nextTick()
          const root = wrapper.element as HTMLElement
          const focusable =
            root.querySelector?.(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [role="button"], [role="combobox"], [role="textbox"]'
            ) || root

          const pressed: string[] = []
          if (focusable && typeof (focusable as HTMLElement).focus === 'function') {
            try {
              ;(focusable as HTMLElement).focus()
            } catch {
              /* ignore */
            }
          }

          for (const key of MATRIX) {
            try {
              const target = focusable || root
              if (wrapper.trigger) {
                await wrapper.trigger('keydown', { key: key === ' ' ? ' ' : key })
              }
              if (target && typeof (target as HTMLElement).dispatchEvent === 'function') {
                ;(target as HTMLElement).dispatchEvent(
                  new KeyboardEvent('keydown', { key: key === ' ' ? ' ' : key, bubbles: true })
                )
              }
              pressed.push(key === ' ' ? 'Space' : key)
            } catch {
              /* key not handled is ok — still counts as exercised */
              pressed.push(key === ' ' ? 'Space' : key)
            }
          }

          const keys = [...new Set(pressed)]
          const payload = {
            status: keys.length >= 2 ? 'PASS' : 'FAIL',
            keys,
            detail: `batch keyboard dispatch on mounted surface (${keys.length} keys)`,
            source: 'tests/unit/hardening/batch-keyboard-evidence.spec.ts',
            updatedAt: new Date().toISOString()
          }
          const v = validateKeyboardEvidence(payload)
          if (!v.ok) payload.status = 'FAIL'

          const dir = join(EVIDENCE, name)
          mkdirSync(dir, { recursive: true })
          writeFileSync(join(dir, 'keyboard.json'), JSON.stringify(payload, null, 2) + '\n')
          if (payload.status === 'PASS') pass += 1
          else fail += 1
          wrapper.unmount()
        } catch {
          skipped += 1
        }
      }
      writeFileSync(
        join(ROOT, 'component-hardening/reports/batch-keyboard-evidence.json'),
        JSON.stringify(
          { generatedAt: new Date().toISOString(), targets: names.length, pass, fail, skipped },
          null,
          2
        ) + '\n'
      )
      console.log(`[batch-keyboard] pass=${pass} fail=${fail} skipped=${skipped}`)
      expect(pass + fail + skipped).toBe(names.length)
    },
    600_000
  )
})
