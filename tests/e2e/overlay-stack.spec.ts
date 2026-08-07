import { test, expect } from '@playwright/test'
import { loginAsAdmin } from './helpers'

/**
 * Nested overlay stack — Escape closes top layer only; scroll lock until last closes.
 * Uses the nested-stack demo on the existing Dialog doc route.
 */
test.describe('Nested overlay stack', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/base/Dialog')
    await expect(page.locator('.vp-curated')).toBeVisible()
  })

  test('Escape closes only the top layer and scroll lock persists until all close', async ({
    page
  }) => {
    const nestedSection = page.locator('[data-demo="dialog-nested-stack"]')
    await nestedSection.getByRole('button').first().click()

    const dialogs = page.locator('.vp-dialog[role="dialog"]')
    await expect(dialogs).toHaveCount(1)

    // Open inner dialog from within the outer panel
    await dialogs.first().getByRole('button').first().click()
    await expect(dialogs).toHaveCount(2)

    const outer = dialogs.first()
    const inner = dialogs.last()
    await expect(outer).toBeVisible()
    await expect(inner).toBeVisible()

    const bodyOverflowBefore = await page.evaluate(() => document.body.style.overflow)
    expect(bodyOverflowBefore).not.toBe('')

    await page.keyboard.press('Escape')
    await expect(dialogs).toHaveCount(1)
    await expect(outer).toBeVisible()

    const bodyOverflowMid = await page.evaluate(() => document.body.style.overflow)
    expect(bodyOverflowMid).not.toBe('')

    await page.keyboard.press('Escape')
    await expect(page.locator('.vp-dialog[role="dialog"]')).toHaveCount(0)

    await expect
      .poll(async () => page.evaluate(() => document.body.style.overflow))
      .toBe('')
  })
})
