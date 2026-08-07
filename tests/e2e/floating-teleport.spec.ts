import { test, expect, type Page } from '@playwright/test'

async function loginAsAdmin(page: Page) {
  await page.goto('/login')
  await expect(page.locator('.biz-login')).toBeVisible()
  await page.locator('.biz-login__form input[type="password"]').fill('admin123')
  await page.locator('.biz-captcha__check').click()
  await page.locator('.biz-login__submit').click()
  await page.waitForURL(/\/dashboard/, { timeout: 15_000 })
}

test.describe('floating Teleport panels', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  test('Select panel teleports to body as fixed overlay', async ({ page }) => {
    await page.goto('/base/Select')
    await expect(page.locator('.vp-doc-page')).toBeVisible()
    const trigger = page.locator('.vp-select__trigger').first()
    await expect(trigger).toBeVisible()
    await trigger.click()

    const panel = page.locator('body > .vp-select__panel').first()
    await expect(panel).toBeVisible()
    await expect(panel).toHaveCSS('position', 'fixed')

    // Not trapped under the component host
    const nested = await page.locator('.vp-select .vp-select__panel').count()
    expect(nested).toBe(0)

    await page.keyboard.press('Escape')
    await expect(panel).toHaveCount(0)
  })

  test('DatePicker panel teleports to body as fixed overlay', async ({ page }) => {
    await page.goto('/base/DatePicker')
    await expect(page.locator('.vp-doc-page')).toBeVisible()
    const trigger = page.locator('.vp-datepicker__trigger').first()
    await expect(trigger).toBeVisible()
    await trigger.click()

    const panel = page.locator('body > .vp-datepicker__panel').first()
    await expect(panel).toBeVisible()
    await expect(panel).toHaveCSS('position', 'fixed')

    const nested = await page.locator('.vp-datepicker .vp-datepicker__panel').count()
    expect(nested).toBe(0)

    await page.keyboard.press('Escape')
    await expect(panel).toHaveCount(0)
  })
})
