import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { loginAsAdmin } from './helpers'

/**
 * Deep a11y / keyboard path — Chromium only (see playwright.config projects).
 * Does not claim full WCAG certification; catches regressions on Dialog trap + axe serious+.
 */
test.describe('Dialog focus trap & a11y', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/base/Dialog')
    await expect(page.locator('.vp-curated')).toBeVisible()
  })

  test('opens dialog, traps Tab, closes on Escape, restores focus', async ({ page }) => {
    const openBtn = page.locator('.vp-curated .vp-button').first()
    await openBtn.focus()
    await expect(openBtn).toBeFocused()
    await openBtn.click()

    const dialog = page.locator('.vp-dialog[role="dialog"]')
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAttribute('aria-modal', 'true')

    // Focus should move into the dialog panel (autofocus / trap).
    await expect
      .poll(async () =>
        page.evaluate(() => {
          const root = document.querySelector('.vp-dialog[role="dialog"]')
          return Boolean(root && root.contains(document.activeElement))
        })
      )
      .toBe(true)

    // Tab cycling must stay inside the dialog.
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab')
      const inside = await page.evaluate(() => {
        const root = document.querySelector('.vp-dialog[role="dialog"]')
        return Boolean(root && root.contains(document.activeElement))
      })
      expect(inside).toBe(true)
    }

    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(openBtn).toBeFocused()
  })

  test('Dialog page has no serious/critical axe violations', async ({ page }) => {
    const openBtn = page.locator('.vp-curated .vp-button').first()
    await openBtn.click()
    await expect(page.locator('.vp-dialog[role="dialog"]')).toBeVisible()

    const results = await new AxeBuilder({ page })
      .include('.vp-dialog-overlay')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const blocking = results.violations.filter((v) =>
      ['serious', 'critical'].includes(v.impact ?? '')
    )
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([])
  })
})
