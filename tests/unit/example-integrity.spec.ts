import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { getSampleMountProps } from '../../example/demos/_shared/sampleMountProps'

const root = process.cwd()

describe('locale exampleDoc integrity', () => {
  const locales = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP', 'ko-KR', 'ko-KP', 'ru-RU']

  it('has zero U+FFFD replacement characters', () => {
    for (const loc of locales) {
      const file = join(root, `packages/locale/${loc}/exampleDoc.ts`)
      const text = readFileSync(file, 'utf8')
      expect(text.includes('\uFFFD'), loc).toBe(false)
    }
  })

  it('has no duplicate object keys', () => {
    for (const loc of locales) {
      const file = join(root, `packages/locale/${loc}/exampleDoc.ts`)
      const text = readFileSync(file, 'utf8')
      const keys = [...text.matchAll(/^\s*(['"])([^'"]+)\1:/gm)].map((m) => m[2])
      const seen = new Set<string>()
      const dups: string[] = []
      for (const k of keys) {
        if (seen.has(k)) dups.push(k)
        seen.add(k)
      }
      expect(dups, loc).toEqual([])
    }
  })
})

describe('sampleMountProps', () => {
  it('returns props for common components', () => {
    expect(getSampleMountProps('Dialog').visible).toBe(true)
    expect(Array.isArray(getSampleMountProps('Tree').options)).toBe(true)
    expect(getSampleMountProps('CanvasNode').node).toBeTruthy()
    expect(Array.isArray(getSampleMountProps('TopNav').items)).toBe(true)
    expect(typeof getSampleMountProps('Barcode').modelValue).toBe('string')
    expect(typeof getSampleMountProps('Barcode').value).toBe('string')
    expect(typeof getSampleMountProps('Qrcode').modelValue).toBe('string')
    expect(typeof getSampleMountProps('MatrixCode').modelValue).toBe('string')
  })
})

describe('curated demos coverage', () => {
  it('registry covers nearly all demo folders', () => {
    const demosDir = join(root, 'example/demos')
    const folders = readdirSync(demosDir).filter((d) =>
      existsSync(join(demosDir, d, 'index.vue'))
    )
    const reg = readFileSync(join(demosDir, 'registry.ts'), 'utf8')
    const keys = [...reg.matchAll(/^\s{2}(\w+):\s*\{/gm)].map((m) => m[1])
    expect(keys.length).toBeGreaterThanOrEqual(folders.length - 2)
  })
})

describe('v0.1 subset curated demos', () => {
  it('every gold-required component has a non-scaffold curated demo', async () => {
    const { V01_GOLD_REQUIRED } = await import('../../example/v0.1-subset')
    const demosDir = join(root, 'example/demos')
    const thin: string[] = []
    for (const name of V01_GOLD_REQUIRED) {
      const file = join(demosDir, name, 'index.vue')
      expect(existsSync(file), name).toBe(true)
      const vue = readFileSync(file, 'utf8')
      const blocks = (vue.match(/DemoBlock/g) || []).length
      if (vue.includes('getSampleMountProps') || blocks < 2 || vue.split(/\n/).length < 80) {
        thin.push(name)
      }
    }
    expect(thin).toEqual([])
  })
})
