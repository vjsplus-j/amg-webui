/**
 * Template-five conformance unit tests (Button / Select / DatePicker / Dialog / DataTable).
 */
import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

const TEMPLATE_FIVE: Record<string, string> = {
  Button: 'packages/components/core/Button',
  Select: 'packages/components/form/Select',
  DatePicker: 'packages/components/form/DatePicker',
  Dialog: 'packages/components/overlay/Dialog',
  DataTable: 'packages/components/data/DataTable'
}

function readTypes(name: string) {
  const p = join(ROOT, TEMPLATE_FIVE[name], 'types.ts')
  return existsSync(p) ? readFileSync(p, 'utf8') : ''
}

function readVue(name: string) {
  const dir = join(ROOT, TEMPLATE_FIVE[name])
  const vue = join(dir, 'index.vue')
  const alt = join(dir, `${name}.vue`)
  if (existsSync(vue)) return readFileSync(vue, 'utf8')
  if (existsSync(alt)) return readFileSync(alt, 'utf8')
  return ''
}

describe('template-five API contract skeleton', () => {
  for (const name of Object.keys(TEMPLATE_FIVE)) {
    it(`${name} has types.ts and entry`, () => {
      const dir = join(ROOT, TEMPLATE_FIVE[name])
      expect(existsSync(dir)).toBe(true)
      expect(existsSync(join(dir, 'types.ts'))).toBe(true)
      const hasEntry =
        existsSync(join(dir, 'index.vue')) ||
        existsSync(join(dir, 'index.ts')) ||
        existsSync(join(dir, `${name}.vue`))
      expect(hasEntry).toBe(true)
    })

    it(`${name} exports ${name}Props`, () => {
      const types = readTypes(name)
      expect(types).toMatch(new RegExp(`export\\s+interface\\s+${name}Props`))
    })

    it(`${name} declares Emits`, () => {
      const types = readTypes(name)
      const vue = readVue(name)
      const hasEmits =
        new RegExp(`export\\s+interface\\s+${name}Emits`).test(types) ||
        /defineEmits/.test(vue)
      expect(hasEmits).toBe(true)
    })
  }
})

describe('template-five generated API extract', () => {
  it('Button extract includes props', () => {
    const generated = join(ROOT, 'generated/component-api/Button.json')
    expect(existsSync(generated)).toBe(true)
    const api = JSON.parse(readFileSync(generated, 'utf8'))
    expect(Array.isArray(api.props)).toBe(true)
    expect(api.props.length).toBeGreaterThan(0)
  })
})
