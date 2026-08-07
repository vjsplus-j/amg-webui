import { expect, type Page } from '@playwright/test'

/**
 * Example shell gates most routes behind auth.
 * Login page is public — use mock credentials (admin / admin123).
 */
export async function loginAsAdmin(page: Page, query = '') {
  const q = query && !query.startsWith('?') ? `?${query}` : query
  await page.context().clearCookies()
  await page.goto(`/login${q}`)
  // Already-authenticated sessions may bounce off /login — force a clean login form.
  if (!(await page.locator('.biz-login').isVisible().catch(() => false))) {
    await page.evaluate(() => {
      try {
        localStorage.clear()
        sessionStorage.clear()
      } catch {
        /* ignore */
      }
    })
    await page.goto(`/login${q}`)
  }
  await expect(page.locator('.biz-login')).toBeVisible()

  const password = page.locator('.biz-login__form input[type="password"]')
  await password.fill('admin123')

  await page.locator('.biz-captcha__check').click()
  await page.locator('.biz-login__submit').click()

  await page.waitForURL(/\/dashboard/, { timeout: 15_000 })
}

export const DESIGN_BRANDS = [
  'mercedes',
  'linear',
  'porsche',
  'lamborghini',
  'ferrari',
  'apple',
  'wechat',
  'alipay'
] as const
