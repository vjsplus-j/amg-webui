import { test, expect } from '@playwright/test'
import { loginAsAdmin } from './helpers'

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
