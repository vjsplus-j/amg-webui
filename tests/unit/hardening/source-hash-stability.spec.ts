/**
 * H01 — sourceHash must be identical across different absolute repo roots.
 */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  hashComponentSource,
  hashPaths
} from '../../../scripts/hardening/hash-component-source.mjs'

describe('H01 sourceHash environment independence', () => {
  it('same sources under different absolute roots produce identical sourceHash', () => {
    const rootA = mkdtempSync(join(tmpdir(), 'amg-hash-a-'))
    const rootB = mkdtempSync(join(tmpdir(), 'amg-hash-b-'))
    try {
      const rel = 'packages/components/form/Select'
      const contentVue = '<template><div class="vp-select" /></template>\n'
      const contentTypes = 'export interface SelectProps {}\n'
      const contentScss = '.vp-select { display: block; }\n'
      for (const root of [rootA, rootB]) {
        const dir = join(root, rel)
        mkdirSync(dir, { recursive: true })
        writeFileSync(join(dir, 'index.vue'), contentVue, 'utf8')
        writeFileSync(join(dir, 'types.ts'), contentTypes, 'utf8')
        writeFileSync(join(dir, 'style.scss'), contentScss, 'utf8')
      }
      const hashA = hashPaths(
        [join(rootA, rel, 'index.vue'), join(rootA, rel, 'types.ts'), join(rootA, rel, 'style.scss')],
        { root: rootA }
      )
      const hashB = hashPaths(
        [join(rootB, rel, 'index.vue'), join(rootB, rel, 'types.ts'), join(rootB, rel, 'style.scss')],
        { root: rootB }
      )
      expect(hashA).toBe(hashB)
      expect(hashA).toMatch(/^[a-f0-9]{64}$/)
    } finally {
      rmSync(rootA, { recursive: true, force: true })
      rmSync(rootB, { recursive: true, force: true })
    }
  })

  it('real Select sourceHash is stable when computed twice', () => {
    const root = process.cwd()
    const hardening = join(root, 'component-hardening')
    if (!existsSync(join(hardening, 'contracts/Select.json'))) return
    const a = hashComponentSource(root, 'Select', hardening)
    const b = hashComponentSource(root, 'Select', hardening)
    expect(a.sourceHash).toBeTruthy()
    expect(a.contractHash).toBeTruthy()
    expect(a.sourceHash).toBe(b.sourceHash)
    expect(a.contractHash).toBe(b.contractHash)
    expect(a.rel.replace(/\\/g, '/')).toMatch(/^packages\//)
  })
})
