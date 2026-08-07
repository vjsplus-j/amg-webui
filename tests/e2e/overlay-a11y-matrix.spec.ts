import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { loginAsAdmin } from './helpers'

/**
 * Overlay keyboard / a11y — Drawer + MessageBox (Chromium deep project).
 */
test.describe('Drawer focus trap & a11y', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/base/Drawer')
    await expect(page.locator('.vp-curated')).toBeVisible()
  })

  test('opens drawer, traps Tab, closes on Escape', async ({ page }) => {
    const openBtn = page.locator('.vp-curated .vp-button').first()
    await openBtn.focus()
    await openBtn.click()

    const drawer = page.locator('.vp-drawer[role="dialog"], [role="dialog"].vp-drawer, .vp-drawer-panel[role="dialog"]').first()
    // Fallback: any dialog role under curated overlay
    const panel = page.locator('[role="dialog"]').first()
    await expect(panel).toBeVisible()

    await expect
      .poll(async () =>
        page.evaluate(() => {
          const root = document.querySelector('[role="dialog"]')
          return Boolean(root && root.contains(document.activeElement))
        })
      )
      .toBe(true)

    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab')
      const inside = await page.evaluate(() => {
        const root = document.querySelector('[role="dialog"]')
        return Boolean(root && root.contains(document.activeElement))
      })
      expect(inside).toBe(true)
    }

    await page.keyboard.press('Escape')
    await expect(page.locator('[role="dialog"]')).toHaveCount(0)
  })

  test('Drawer panel has no serious/critical axe violations', async ({ page }) => {
    await page.locator('.vp-curated .vp-button').first().click()
    await expect(page.locator('[role="dialog"]').first()).toBeVisible()

    const results = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const blocking = results.violations.filter((v) =>
      ['serious', 'critical'].includes(v.impact ?? '')
    )
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([])
  })
})

test.describe('MessageBox focus trap', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/base/MessageBox')
    await expect(page.locator('.vp-curated')).toBeVisible()
  })

  test('opens message box and Escape closes top layer', async ({ page }) => {
    const openBtn = page.locator('.vp-curated .vp-button').first()
    await openBtn.click()

    const panel = page.locator('[role="dialog"], [role="alertdialog"]').first()
    await expect(panel).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.locator('[role="dialog"], [role="alertdialog"]')).toHaveCount(0)
  })
})
