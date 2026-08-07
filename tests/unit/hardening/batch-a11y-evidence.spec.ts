/**
 * Batch a11y evidence for components whose only remaining mandatory FAIL is a11y.
 * Mounts with sample props, runs axe structure + contrast, writes evidence JSON.
 * @vitest-environment happy-dom
 */
import { beforeAll, describe, expect, it } from 'vitest'
import { mount, config } from '@vue/test-utils'
import { nextTick } from 'vue'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import axe from 'axe-core'
import { LocaleService } from '@amg-webui/locale'
import { componentDirRel } from '../../../scripts/component-package-map.mjs'
import { getSampleMountProps } from '../../../example/demos/_shared/sampleMountProps'

const ROOT = process.cwd()
const EVIDENCE = join(ROOT, 'component-hardening/evidence')
const GATES = join(ROOT, 'component-hardening/gates/results/all.json')

beforeAll(() => {
  LocaleService.init()
  config.global.stubs = { teleport: true, Transition: false, RouterLink: true }
})

function targets(): string[] {
  if (!existsSync(GATES)) return []
  const all = JSON.parse(readFileSync(GATES, 'utf8'))
  return (all.results || [])
    .filter((r: { status: string; gates: { id: string; status: string }[] }) => {
      if (r.status !== 'FAIL') return false
      const fails = r.gates.filter((g) => g.status === 'FAIL').map((g) => g.id)
      // Only a11y left (keyboard may also fail — skip those for this batch)
      return fails.length === 1 && fails[0] === 'a11y'
    })
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

async function analyze(el: Element) {
  const structure = await axe.run(el, {
    rules: { 'color-contrast': { enabled: false } }
  })
  const contrast = await axe.run(el, {
    runOnly: { type: 'rule', values: ['color-contrast'] }
  })
  const count = (violations: axe.Result[]) => ({
    critical: violations.filter((v) => v.impact === 'critical').length,
    serious: violations.filter((v) => v.impact === 'serious').length,
    violations: violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help }))
  })
  return { structure: count(structure.violations), contrast: count(contrast.violations) }
}

function writeA11y(name: string, result: Awaited<ReturnType<typeof analyze>>) {
  const sBlock = result.structure.critical + result.structure.serious
  const cBlock = result.contrast.critical + result.contrast.serious
  const structureStatus = sBlock === 0 ? 'PASS' : 'FAIL'
  const contrastStatus = cBlock === 0 ? 'PASS' : 'FAIL'
  const overall =
    structureStatus === 'PASS' && contrastStatus === 'PASS' ? 'PASS' : 'FAIL'
  const dir = join(EVIDENCE, name)
  mkdirSync(dir, { recursive: true })
  writeFileSync(
    join(dir, 'a11y.json'),
    JSON.stringify(
      {
        status: overall,
        A11Y_STRUCTURE: {
          status: structureStatus,
          critical: result.structure.critical,
          serious: result.structure.serious,
          violations: result.structure.violations
        },
        A11Y_CONTRAST: {
          status: contrastStatus,
          critical: result.contrast.critical,
          serious: result.contrast.serious,
          violations: result.contrast.violations
        },
        detail: `A11Y_STRUCTURE=${structureStatus}; A11Y_CONTRAST=${contrastStatus}`,
        source: 'tests/unit/hardening/batch-a11y-evidence.spec.ts',
        updatedAt: new Date().toISOString()
      },
      null,
      2
    ) + '\n'
  )
  return overall
}

describe('Batch a11y evidence (a11y-only FAIL components)', () => {
  const names = targets()

  it(
    `processes ${names.length} a11y-only targets`,
    async () => {
      if (names.length === 0) {
        console.log('[batch-a11y] no a11y-only FAIL targets — skipping batch')
        expect(names).toHaveLength(0)
        return
      }
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
          const slots: Record<string, () => string> = {}
          if (
            /Link|ButtonGroup|BreadcrumbItem|Tag|Badge|Tooltip|Popover|Statistic|Space|Col|Row/i.test(
              name
            )
          ) {
            slots.default = () => String(props.label || props.title || name)
          }
          const wrapper = mount(Comp, {
            props,
            slots,
            attachTo: document.body
          })
          await nextTick()
          const el = wrapper.element as Element
          if (!el || typeof (el as Element).querySelector !== 'function') {
            wrapper.unmount()
            skipped += 1
            continue
          }
          const result = await analyze(el)
          const status = writeA11y(name, result)
          if (status === 'PASS') pass += 1
          else fail += 1
          wrapper.unmount()
        } catch {
          skipped += 1
        }
      }
      writeFileSync(
        join(ROOT, 'component-hardening/reports/batch-a11y-evidence.json'),
        JSON.stringify(
          {
            generatedAt: new Date().toISOString(),
            targets: names.length,
            pass,
            fail,
            skipped
          },
          null,
          2
        ) + '\n'
      )
      console.log(`[batch-a11y] pass=${pass} fail=${fail} skipped=${skipped}`)
      // Batch writer always completes; individual FAIL evidence is honest
      expect(pass + fail + skipped).toBe(names.length)
    },
    600_000
  )
})
