/**
 * Headless check: Icon motion via Slider + Switch components.
 */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.PLAY_URL || 'http://127.0.0.1:5173'
const outDir = path.resolve('scripts/.playwright-out')
fs.mkdirSync(outDir, { recursive: true })
const log = (...a) => console.log('[check-icon-motion]', ...a)

async function main() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' })
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  await page.addInitScript(() => {
    localStorage.setItem('amg-webui-token', 'token-playwright')
    localStorage.setItem(
      'amg-webui-user',
      JSON.stringify({
        id: 'admin',
        username: 'admin',
        email: 'admin@example.com',
        roles: ['admin']
      })
    )
  })

  await page.goto(BASE + '/base/Icon', { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForSelector('.vp-icon-style__debug', { timeout: 30000 })

  const section = page.locator('.vp-demo-block').filter({
    has: page.locator('.vp-icon-style__debug')
  })
  await section.first().scrollIntoViewIfNeeded()

  const previewSvg = section.locator('.vp-icon-style__preview svg').first()
  const slider = section.locator('.vp-slider').first()
  const switches = section.locator('.vp-switch')
  const debug = section.locator('.vp-icon-style__debug')

  const track = slider.locator('.vp-slider__track')
  const box = await track.boundingBox()
  if (!box) throw new Error('slider track missing')

  // Click ~25% across track → ≈ 90deg (0–360)
  await page.mouse.click(box.x + box.width * 0.25, box.y + box.height / 2)
  await page.waitForTimeout(400)
  log('debug after slider click', await debug.innerText())

  const afterRotate = await previewSvg.evaluate((el) => ({
    style: el.getAttribute('style'),
    transform: getComputedStyle(el).transform
  }))
  log('AFTER SLIDER', afterRotate)

  // Switch order: spin · pulse · heartbeat · bounce · flipH · flipV
  await switches.nth(0).click()
  await page.waitForTimeout(500)
  log('debug after spin switch', await debug.innerText())
  const afterSpin = await previewSvg.evaluate((el) => {
    const host = el.closest('.vp-icon')
    return {
      hostClass: host?.className,
      animation: host ? getComputedStyle(host).animationName : null
    }
  })
  log('AFTER SPIN SWITCH', afterSpin)

  // turn off spin, enable heartbeat (index 2)
  await switches.nth(0).click()
  await switches.nth(2).click()
  await page.waitForTimeout(400)
  log('debug after heartbeat', await debug.innerText())
  const afterHeartbeat = await previewSvg.evaluate((el) => {
    const host = el.closest('.vp-icon')
    return {
      hostClass: host?.className,
      animation: host ? getComputedStyle(host).animationName : null
    }
  })
  log('AFTER HEARTBEAT', afterHeartbeat)

  // turn off heartbeat, enable bounce (index 3)
  await switches.nth(2).click()
  await switches.nth(3).click()
  await page.waitForTimeout(400)
  log('debug after bounce', await debug.innerText())
  const afterBounce = await previewSvg.evaluate((el) => {
    const host = el.closest('.vp-icon')
    return {
      hostClass: host?.className,
      animation: host ? getComputedStyle(host).animationName : null
    }
  })
  log('AFTER BOUNCE', afterBounce)

  // turn off bounce, enable flipH (index 4)
  await switches.nth(3).click()
  await switches.nth(4).click()
  await page.waitForTimeout(400)
  log('debug after flipH', await debug.innerText())
  const afterFlip = await previewSvg.evaluate((el) => el.getAttribute('style'))
  log('AFTER FLIP SWITCH', afterFlip)

  await page.screenshot({ path: path.join(outDir, '04-slider-switch.png'), fullPage: true })

  const rotateOk = (afterRotate.style || '').includes('rotate(') || afterRotate.transform !== 'none'
  const spinOk = (afterSpin.hostClass || '').includes('vp-icon--spin')
  const heartbeatOk = (afterHeartbeat.hostClass || '').includes('vp-icon--heartbeat')
  const bounceOk = (afterBounce.hostClass || '').includes('vp-icon--bounce')
  const flipOk = (afterFlip || '').includes('scaleX(-1)')
  log('RESULT', { rotateOk, spinOk, heartbeatOk, bounceOk, flipOk })

  await browser.close()
  if (!rotateOk || !spinOk || !heartbeatOk || !bounceOk || !flipOk) process.exitCode = 1
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
