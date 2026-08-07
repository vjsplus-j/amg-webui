import { test, expect } from '@playwright/test'
import { DESIGN_BRANDS, loginAsAdmin } from './helpers'

/**
 * Direction is independent of locale. RTL smoke loads full document so boot URL params apply.
 * Attaches an RTL screenshot artifact — not a flaky visual baseline gate.
 */
test.describe('RTL & design brands', () => {
  test('dir=rtl flips layout without requiring ar-SA', async ({ page }, testInfo) => {
    await loginAsAdmin(page, 'lang=zh-CN&dir=rtl')
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
    await expect(page.locator('html')).toHaveAttribute('data-locale', 'zh-CN')

    await page.goto('/base/Dialog')
    await expect(page.locator('.vp-curated')).toBeVisible()
    await page.locator('.vp-curated .vp-button').first().click()
    await expect(page.locator('.vp-dialog[role="dialog"]')).toBeVisible()

    const png = await page.screenshot({ fullPage: false })
    await testInfo.attach('rtl-dialog', { body: png, contentType: 'image/png' })
  })

  test('ar-SA alone does not flip to rtl', async ({ page }) => {
    await loginAsAdmin(page, 'lang=ar-SA')
    await expect(page.locator('html')).toHaveAttribute('data-locale', 'ar-SA')
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar')
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr')
  })

  test('ar-SA + dir=rtl combines language pack with RTL chrome', async ({ page }) => {
    await loginAsAdmin(page, 'lang=ar-SA&dir=rtl')
    await expect(page.locator('html')).toHaveAttribute('data-locale', 'ar-SA')
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar')
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  })

  for (const brand of DESIGN_BRANDS) {
    test(`design=${brand} applies data-design on boot`, async ({ page }) => {
      await page.goto(`/login?design=${brand}`)
      await expect(page.locator('html')).toHaveAttribute('data-design', brand)
      await expect(page.locator('.biz-login')).toBeVisible()
    })
  }
})
