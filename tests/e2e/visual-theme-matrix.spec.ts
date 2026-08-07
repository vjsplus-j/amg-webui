import { test, expect, type Page } from '@playwright/test'
import {
  buildVisualMatrixCases,
  snapshotName,
  SNAPSHOT_COMPARE,
  SCHEME_SUPPORTED,
  DESIGN_BRANDS,
  MATRIX_SCHEMES,
  MATRIX_DIRECTIONS
} from '../../scripts/visual/matrix.mjs'
import { loginAsAdmin } from './helpers'

const MATRIX_PATH = '/lab/visual-theme-matrix'

test.use({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 1
})

function schemesForDesign(design: string): string[] {
  return SCHEME_SUPPORTED.has(design) ? [...MATRIX_SCHEMES] : ['dark']
}

async function prepareMatrixPage(
  page: Page,
  design: string,
  scheme: string,
  dir: string
) {
  const qs = new URLSearchParams({ design, scheme, dir })
  await loginAsAdmin(page, qs.toString())
  await page.goto(`${MATRIX_PATH}?${qs}`)
  await expect(page.locator('.lab-visual-matrix')).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('data-design', design)
  await expect(page.locator('html')).toHaveAttribute('dir', dir)

  if (SCHEME_SUPPORTED.has(design)) {
    await expect(page.locator('html')).toHaveAttribute('data-scheme', scheme)
  }

  await page.evaluate(() => document.fonts.ready)
  await page.waitForFunction(() => document.fonts.status === 'loaded')
  await page.evaluate(() => {
    const el = document.activeElement
    if (el instanceof HTMLElement) el.blur()
  })
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(250)
}

async function screenshotFixture(
  page: Page,
  design: string,
  scheme: string,
  dir: string,
  component: string
) {
  const name = snapshotName({ design, scheme, dir, component })

  if (component === 'dialog') {
    await page.locator('[data-testid="v-matrix-dialog-open"] button, [data-testid="v-matrix-dialog-open"] .vp-button').first().click()
    const panel = page.locator('.vp-dialog[role="dialog"]')
    await expect(panel).toBeVisible()
    await page.waitForTimeout(150)
    await expect(panel).toHaveScreenshot(name, {
      animations: 'disabled',
      scale: 'css',
      ...SNAPSHOT_COMPARE
    })
    await page.keyboard.press('Escape')
    await expect(panel).toBeHidden()
    return
  }

  const fixture = page.locator(`[data-visual-matrix="${component}"]`)
  await fixture.scrollIntoViewIfNeeded()
  await expect(fixture).toBeVisible()
  await expect(fixture).toHaveScreenshot(name, {
    animations: 'disabled',
    scale: 'css',
    ...SNAPSHOT_COMPARE
  })
}

test.describe('Visual theme matrix', () => {
  test.describe.configure({ mode: 'serial' })

  for (const design of DESIGN_BRANDS) {
    for (const scheme of schemesForDesign(design)) {
      for (const dir of MATRIX_DIRECTIONS) {
        test(`${design} · ${scheme} · ${dir}`, async ({ page }) => {
          await prepareMatrixPage(page, design, scheme, dir)
          const cases = buildVisualMatrixCases().filter(
            (c) => c.design === design && c.scheme === scheme && c.dir === dir
          )
          for (const { component } of cases) {
            await screenshotFixture(page, design, scheme, dir, component)
          }
        })
      }
    }
  }
})
