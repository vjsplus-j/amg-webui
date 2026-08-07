/**
 * LC-012 Golden Path — Playwright E2E against real Studio UI (example /lab/lowcode-studio).
 * Writes honest per-step report to component-hardening/reports/lowcode-golden-path.json.
 */
import { test, expect, type Page } from '@playwright/test'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { loginAsAdmin } from './helpers'
import { buildGeneratedSfcFixture } from '../../scripts/lowcode/build-generated-sfc-fixture.mjs'
import { writeGoldenPathReport } from '../../scripts/lowcode/golden-path-steps.mjs'

const STORAGE_KEY = 'amg-lowcode-studio-doc:studio-0.1'
const STUDIO_ROUTE = '/lab/lowcode-studio'
const ACTION_TIMEOUT = 8_000

type StepResult = { id: number; pass: boolean; note?: string }

const stepResults: StepResult[] = []

function record(id: number, pass: boolean, note?: string) {
  if (!stepResults.some((s) => s.id === id)) stepResults.push({ id, pass, note })
}

async function safeStep(id: number, fn: () => Promise<boolean | void>, noteOnFail?: string) {
  try {
    const result = await fn()
    const ok = result !== false
    record(id, ok, ok ? undefined : noteOnFail)
  } catch (err) {
    record(id, false, `${noteOnFail ?? 'error'}: ${String(err)}`.slice(0, 240))
  }
}

async function dragMaterial(page: Page, type: string, targetX: number, targetY: number) {
  const material = page.getByTestId(`material-${type}`)
  const canvas = page.getByTestId('studio-canvas')
  await material.scrollIntoViewIfNeeded()
  await canvas.scrollIntoViewIfNeeded()
  await material.dragTo(canvas, { targetPosition: { x: targetX, y: targetY } })
  await page.waitForTimeout(250)
}

async function selectOutlineNode(page: Page, type: string) {
  await page.locator('.vp-studio-outline__item').filter({ hasText: type }).first().click({ timeout: ACTION_TIMEOUT })
}

async function deselectAll(page: Page) {
  await page.getByTestId('studio-outline-header').click({ timeout: ACTION_TIMEOUT })
  await page.waitForTimeout(100)
}

async function configureQueryUsersDataSource(page: Page) {
  await deselectAll(page)
  await page.getByTestId('inspector-doc-tab-sources').click({ timeout: ACTION_TIMEOUT })
  await page.getByTestId('inspector-ds-id').locator('input').fill('queryUsers')
  await page.getByTestId('inspector-ds-name').locator('input').fill('Query Users')
  const staticJson = JSON.stringify(
    {
      list: [
        { id: 1, name: 'Ada Lovelace' },
        { id: 2, name: 'Alan Turing' }
      ],
      total: 2
    },
    null,
    2
  )
  await page.getByTestId('inspector-ds-static').locator('textarea').fill(staticJson)
  await page.getByTestId('inspector-save-datasource').locator('button').click({ timeout: ACTION_TIMEOUT })
}

async function applyBinding(page: Page, prop: string, path: string) {
  await page.getByTestId('inspector-tab-data').click({ timeout: ACTION_TIMEOUT })
  await page.getByTestId('inspector-binding-mode').locator('button').click({ timeout: ACTION_TIMEOUT })
  await page.getByTestId('inspector-binding-prop').locator('input').fill(prop)
  await page.getByTestId('inspector-binding-path').locator('input').fill(path)
  await page.getByTestId('inspector-apply-binding').locator('button').click({ timeout: ACTION_TIMEOUT })
  await page.waitForTimeout(150)
}

async function setButtonLabel(page: Page, label: string) {
  await page.getByTestId('inspector-tab-props').click({ timeout: ACTION_TIMEOUT })
  const labelInput = page
    .locator('.vp-studio-inspector__body .vp-studio-field')
    .filter({ has: page.locator('label') })
    .filter({ hasText: /label|Label|标签/i })
    .locator('input')
    .first()
  if ((await labelInput.count()) > 0) {
    await labelInput.fill(label)
    await labelInput.blur()
  }
}

test.describe('LC-012 lowcode golden path (Studio E2E)', () => {
  test.beforeEach(async ({ page }) => {
    stepResults.length = 0
    await page.addInitScript((key: string) => {
      localStorage.removeItem(key)
    }, STORAGE_KEY)
    await loginAsAdmin(page)
    await page.goto(STUDIO_ROUTE)
    await expect(page.getByTestId('lowcode-studio')).toBeVisible({ timeout: 30_000 })
  })

  test.afterEach(async () => {
    writeGoldenPathReport(stepResults, {
      runId: `lc012-e2e-${Date.now()}`,
      source: 'tests/e2e/lowcode-golden-path.spec.ts'
    })
  })

  test('runs 19-step acceptance against Studio UI', async ({ page }) => {
    test.setTimeout(180_000)

    await safeStep(1, async () => {
      await page.getByTestId('studio-action-blank').locator('button').click({ timeout: ACTION_TIMEOUT })
      await expect(page.getByTestId('studio-node-count')).toHaveText('0 nodes')
      return true
    })

    await safeStep(2, async () => {
      await dragMaterial(page, 'Container', 220, 180)
      const text = await page.getByTestId('studio-node-count').innerText()
      return text.includes('1 nodes') && (await page.locator('.vp-studio-outline__item').filter({ hasText: 'Container' }).count()) > 0
    })

    await safeStep(3, async () => {
      await dragMaterial(page, 'Form', 260, 240)
      return (await page.locator('.vp-studio-outline__item').filter({ hasText: 'Form' }).count()) > 0
    })

    await safeStep(4, async () => {
      await dragMaterial(page, 'InputText', 280, 280)
      return (await page.locator('.vp-studio-outline__item').filter({ hasText: 'InputText' }).count()) > 0
    })

    await safeStep(5, async () => {
      await selectOutlineNode(page, 'InputText')
      await page.getByTestId('inspector-tab-advanced').click({ timeout: ACTION_TIMEOUT })
      const textarea = page.locator('.vp-studio-inspector__body textarea').first()
      const raw = await textarea.inputValue()
      let props: Record<string, unknown>
      try {
        props = JSON.parse(raw)
      } catch {
        props = {}
      }
      props.label = 'Search keyword'
      await textarea.fill(JSON.stringify(props, null, 2))
      await textarea.blur()
      await page.waitForTimeout(200)
      const outline = await page.locator('.vp-studio-outline__item').filter({ hasText: 'InputText' }).first().innerText()
      return outline.toLowerCase().includes('search keyword')
    })

    try {
      await configureQueryUsersDataSource(page)
    } catch (err) {
      record(6, false, `dataSource setup: ${String(err)}`.slice(0, 200))
    }

    await safeStep(6, async () => {
      await selectOutlineNode(page, 'InputText')
      await applyBinding(page, 'modelValue', 'state.keyword')
      const code = await page.locator('.vp-studio-inspector__body pre.vp-studio-code').innerText()
      return code.includes('state.keyword')
    })

    await safeStep(7, async () => {
      await dragMaterial(page, 'Button', 420, 280)
      await selectOutlineNode(page, 'Button')
      await setButtonLabel(page, 'Search')
      return (await page.locator('.vp-studio-outline__item').filter({ hasText: 'Button' }).count()) > 0
    })

    await safeStep(8, async () => {
      await selectOutlineNode(page, 'Button')
      await page.getByTestId('inspector-tab-events').click({ timeout: ACTION_TIMEOUT })
      await page.getByTestId('inspector-event-handler').locator('input').fill('onSearch')
      await page.waitForTimeout(200)
      await deselectAll(page)
      await page.getByTestId('inspector-doc-tab-actions').click({ timeout: ACTION_TIMEOUT })
      const actionsJson = await page.locator('.vp-studio-inspector__body pre.vp-studio-code').innerText()
      return actionsJson.includes('onSearch') && actionsJson.includes('queryUsers')
    })

    await safeStep(9, async () => {
      await dragMaterial(page, 'DataTable', 260, 360)
      return (await page.locator('.vp-studio-outline__item').filter({ hasText: 'DataTable' }).count()) > 0
    })

    await safeStep(10, async () => {
      await selectOutlineNode(page, 'DataTable')
      await applyBinding(page, 'value', 'data.queryUsers.list')
      const code = await page.locator('.vp-studio-inspector__body pre.vp-studio-code').innerText()
      return code.includes('data.queryUsers.list')
    })

    await safeStep(11, async () => {
      await page.getByTestId('studio-action-preview').locator('button').click({ timeout: ACTION_TIMEOUT })
      await expect(page.getByTestId('studio-preview-layer')).toBeVisible({ timeout: ACTION_TIMEOUT })
      return true
    })

    await safeStep(12, async () => {
      const preview = page.getByTestId('studio-preview-layer')
      const searchBtn = preview.locator('button').first()
      await searchBtn.click({ timeout: ACTION_TIMEOUT })
      await page.waitForTimeout(800)
      const rows = preview.locator('.vp-datatable tbody tr')
      return (await rows.count()) >= 2
    })

    await page.getByTestId('studio-action-preview').locator('button').click({ timeout: ACTION_TIMEOUT })

    await safeStep(13, async () => {
      await page.getByTestId('studio-action-save').locator('button').click({ timeout: ACTION_TIMEOUT })
      const stored = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)
      return stored != null && stored.includes('queryUsers')
    })

    const savedJson = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)
    const exportFixturePath = join(process.cwd(), 'tests/fixtures/lowcode-golden-export.json')
    if (savedJson) writeFileSync(exportFixturePath, savedJson, 'utf8')

    let reloadOk = false
    await safeStep(14, async () => {
      await page.reload()
      await expect(page.getByTestId('lowcode-studio')).toBeVisible({ timeout: 30_000 })
      reloadOk = true
      return true
    })

    await safeStep(15, async () => {
      if (!reloadOk) return false
      await page.waitForTimeout(600)
      const nodeText = await page.getByTestId('studio-node-count').innerText()
      const hasTable = (await page.locator('.vp-studio-outline__item').filter({ hasText: 'DataTable' }).count()) > 0
      return !nodeText.startsWith('0 nodes') && hasTable
    })

    await safeStep(16, async () => {
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 10_000 }),
        page.getByTestId('studio-action-export').locator('button').click({ timeout: ACTION_TIMEOUT })
      ])
      return (await download.path()) != null
    })

    await safeStep(17, async () => {
      await page.getByTestId('studio-action-blank').locator('button').click({ timeout: ACTION_TIMEOUT })
      await expect(page.getByTestId('studio-node-count')).toHaveText('0 nodes')
      await page.getByTestId('studio-import-input').setInputFiles(exportFixturePath)
      await page.waitForTimeout(500)
      const nodeText = await page.getByTestId('studio-node-count').innerText()
      return !nodeText.startsWith('0 nodes')
    })

    await safeStep(18, async () => {
      await page.getByTestId('studio-action-codegen').locator('button').click({ timeout: ACTION_TIMEOUT })
      await expect(page.getByTestId('studio-codegen-output')).toBeVisible({ timeout: 10_000 })
      const sfc = await page.getByTestId('studio-codegen-output').innerText()
      return sfc.includes('<script setup') && sfc.includes('createPageRuntime') && sfc.includes('onSearch')
    })

    await safeStep(19, async () => {
      const sfc = await page.getByTestId('studio-codegen-output').innerText()
      if (!sfc.trim()) throw new Error('empty codegen output')
      const build = buildGeneratedSfcFixture(sfc)
      if (!build.ok) throw new Error(build.issues.join('; '))
      return true
    }, 'vite build')

    const passed = stepResults.filter((s) => s.pass).length
    const failed = stepResults.filter((s) => !s.pass).map((s) => s.id)
    const ids = stepResults.map((s) => s.id).sort((a, b) => a - b)
    const uniqueIds = [...new Set(ids)]
    test.info().annotations.push({
      type: 'lc012-summary',
      description: `${passed}/19 pass; failed steps: ${failed.join(', ') || 'none'}`
    })

    expect(stepResults, 'LC-012 must record exactly 19 steps').toHaveLength(19)
    expect(uniqueIds, 'LC-012 step IDs must be unique').toHaveLength(19)
    expect(ids, 'LC-012 must include step IDs 1..19').toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
    ])
    expect(failed, `LC-012 failed steps: ${failed.join(', ')}`).toEqual([])
    expect(passed, 'LC-012 requires 19/19').toBe(19)
    for (const step of stepResults) {
      expect(step.pass, `LC-012 step ${step.id} must pass`).toBe(true)
    }
  })
})
