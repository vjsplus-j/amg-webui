import { test, expect, type Page } from '@playwright/test'

/**
 * Example shell gates most routes behind auth.
 * Login page is public — use mock credentials (admin / admin123).
 */
async function loginAsAdmin(page: Page) {
  await page.goto('/login')
  await expect(page.locator('.biz-login')).toBeVisible()

  const password = page.locator('.biz-login__form input[type="password"]')
  await password.fill('admin123')

  await page.locator('.biz-captcha__check').click()
  await page.locator('.biz-login__submit').click()

  await page.waitForURL(/\/dashboard/, { timeout: 15_000 })
}

test.describe('example shell smoke', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  test('DataTable doc page renders table chrome', async ({ page }) => {
    await page.goto('/base/DataTable')
    await expect(page.locator('.vp-doc-page')).toBeVisible()
    await expect(page.locator('.vp-datatable')).toBeVisible()
    await expect(page.locator('.vp-datatable__table')).toBeVisible()
  })

  test('Dialog doc page renders curated demo controls', async ({ page }) => {
    await page.goto('/base/Dialog')
    await expect(page.locator('.vp-doc-page')).toBeVisible()
    await expect(page.locator('.vp-curated')).toBeVisible()
    await expect(page.locator('.vp-button').first()).toBeVisible()
  })

  test('Form doc page renders form demo', async ({ page }) => {
    await page.goto('/base/Form')
    await expect(page.locator('.vp-doc-page')).toBeVisible()
    await expect(page.locator('.vp-form').first()).toBeVisible()
    await expect(page.locator('.vp-form-item').first()).toBeVisible()
  })
})
