import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { loginAsAdmin } from './helpers'
import {
  DESIGN_BRANDS,
  SCHEME_SUPPORTED,
  MATRIX_SCHEMES
} from '../../scripts/visual/matrix.mjs'

const HARDENING_PATH = '/lab/hardening'
const EVIDENCE_DIR = join(process.cwd(), 'component-hardening/reports/a11y-browser')

type A11yDim = {
  status: 'PASS' | 'FAIL'
  critical: number
  serious: number
}

type ComponentA11yEvidence = {
  component: string
  selector: string
  axe: {
    status: 'PASS' | 'FAIL'
    blocking: number
    A11Y_STRUCTURE: A11yDim
    A11Y_CONTRAST: A11yDim
  }
  verifiedAt: string
}

type ThemeContrastRow = {
  design: string
  scheme: string
  selector: string
  A11Y_CONTRAST: A11yDim
}

const CORE_FIXTURES = [
  { component: 'Button', selector: '[data-testid="hf-button"]' },
  { component: 'InputText', selector: '[data-testid="hf-input"]' },
  { component: 'Select', selector: '[data-testid="hf-select"]' },
  { component: 'Checkbox', selector: '[data-testid="hf-checkbox"]' },
  { component: 'DataTable', selector: '[data-testid="hf-datatable"]' },
  {
    component: 'Dialog',
    selector: '.vp-dialog-overlay',
    visibleSelector: '[data-testid="hf-dialog-open"]',
    prepare: async (page: Page) => {
      await page.locator('[data-testid="hf-dialog-open"] .vp-button').click()
      await expect(page.locator('.vp-dialog[role="dialog"]')).toBeVisible()
    }
  }
] as const

/** 8 official themes × light/dark where scheme is supported; others default appearance once. */
const THEME_MATRIX = DESIGN_BRANDS.map((design) => ({
  design,
  schemes: SCHEME_SUPPORTED.has(design) ? ([...MATRIX_SCHEMES] as ('light' | 'dark')[]) : (['dark'] as const)
}))

const THEME_MATRIX_CELL_COUNT = THEME_MATRIX.reduce((n, row) => n + row.schemes.length, 0)

function summarize(violations: { impact?: string | null }[]) {
  const critical = violations.filter((v) => v.impact === 'critical').length
  const serious = violations.filter((v) => v.impact === 'serious').length
  return { critical, serious, blocking: critical + serious }
}

async function axeStructure(page: Page, selector: string) {
  const results = await new AxeBuilder({ page })
    .include(selector)
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .disableRules(['color-contrast'])
    .analyze()
  const counts = summarize(results.violations)
  return {
    ...counts,
    status: (counts.blocking === 0 ? 'PASS' : 'FAIL') as 'PASS' | 'FAIL',
    violations: results.violations
  }
}

async function axeContrast(page: Page, selector: string) {
  const results = await new AxeBuilder({ page })
    .include(selector)
    .withRules(['color-contrast'])
    .analyze()
  const counts = summarize(results.violations)
  return {
    ...counts,
    status: (counts.blocking === 0 ? 'PASS' : 'FAIL') as 'PASS' | 'FAIL',
    violations: results.violations
  }
}

async function runA11y(page: Page, selector: string) {
  const structure = await axeStructure(page, selector)
  const contrast = await axeContrast(page, selector)
  expect(structure.blocking, JSON.stringify(structure.violations, null, 2)).toBe(0)
  expect(
    contrast.blocking,
    `A11Y_CONTRAST FAIL: ${JSON.stringify(contrast.violations, null, 2)}`
  ).toBe(0)
  return {
    status: 'PASS' as const,
    blocking: 0,
    A11Y_STRUCTURE: {
      status: structure.status,
      critical: structure.critical,
      serious: structure.serious
    },
    A11Y_CONTRAST: {
      status: contrast.status,
      critical: contrast.critical,
      serious: contrast.serious
    }
  }
}

function writeEvidence(components: ComponentA11yEvidence[], themes: ThemeContrastRow[]) {
  mkdirSync(EVIDENCE_DIR, { recursive: true })
  const allContrastPass = themes.every((t) => t.A11Y_CONTRAST.status === 'PASS')
  const payload = {
    generatedAt: new Date().toISOString(),
    source: 'tests/e2e/a11y-core-contrast.spec.ts',
    path: HARDENING_PATH,
    themeMatrixComplete:
      themes.length >= THEME_MATRIX_CELL_COUNT && allContrastPass && THEME_MATRIX_CELL_COUNT >= 8,
    themeMatrixExpectedCells: THEME_MATRIX_CELL_COUNT,
    themeMatrixActualCells: themes.length,
    designs: DESIGN_BRANDS,
    components,
    themeContrastMatrix: themes
  }
  writeFileSync(join(EVIDENCE_DIR, 'summary.json'), JSON.stringify(payload, null, 2) + '\n')
}

/**
 * P1-03 browser a11y — Chromium axe structure + color-contrast on core interactive demos.
 * Contrast rules are never disabled; serious/critical violations fail the suite.
 */
test.describe('Core component browser a11y (structure + contrast)', () => {
  const componentEvidence: ComponentA11yEvidence[] = []
  const themeEvidence: ThemeContrastRow[] = []

  for (const fixture of CORE_FIXTURES) {
    test(`${fixture.component}: no serious/critical axe violations`, async ({ page }) => {
      await loginAsAdmin(page)
      await page.goto(HARDENING_PATH)
      await expect(page.locator('#family-foundation')).toBeVisible()

      const visibleSelector =
        'visibleSelector' in fixture && fixture.visibleSelector
          ? fixture.visibleSelector
          : fixture.selector
      await expect(page.locator(visibleSelector).first()).toBeVisible()
      if ('prepare' in fixture && fixture.prepare) await fixture.prepare(page)

      const axe = await runA11y(page, fixture.selector)
      componentEvidence.push({
        component: fixture.component,
        selector: fixture.selector,
        axe,
        verifiedAt: new Date().toISOString()
      })
    })
  }

  test('theme contrast matrix (8 designs × supported schemes)', async ({ page }) => {
    for (const row of THEME_MATRIX) {
      for (const scheme of row.schemes) {
        const qs = new URLSearchParams({ design: row.design, scheme, dir: 'ltr' })
        await loginAsAdmin(page, qs.toString())
        await page.goto(`${HARDENING_PATH}?${qs}`)
        await expect(page.locator('[data-testid="hf-button"]')).toBeVisible()

        if (SCHEME_SUPPORTED.has(row.design)) {
          await expect(page.locator('html')).toHaveAttribute('data-scheme', scheme)
        }
        await expect(page.locator('html')).toHaveAttribute('data-design', row.design)

        const contrast = await axeContrast(page, '[data-testid="hf-button"]')
        expect(
          contrast.blocking,
          `${row.design}/${scheme}: ${JSON.stringify(contrast.violations, null, 2)}`
        ).toBe(0)

        themeEvidence.push({
          design: row.design,
          scheme,
          selector: '[data-testid="hf-button"]',
          A11Y_CONTRAST: {
            status: contrast.status,
            critical: contrast.critical,
            serious: contrast.serious
          }
        })
      }
    }
  })

  test.afterAll(() => {
    if (componentEvidence.length || themeEvidence.length) {
      writeEvidence(componentEvidence, themeEvidence)
    }
  })
})
