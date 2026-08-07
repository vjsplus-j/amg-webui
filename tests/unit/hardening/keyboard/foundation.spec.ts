/**
 * Foundation family keyboard evidence — Button behavior assertions.
 * @vitest-environment happy-dom
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Button from '@amg-webui/core/Button/index.vue'
import { writeKeyboardEvidence } from '../../../../scripts/hardening/write-keyboard-evidence.mjs'
import { validateKeyboardEvidence } from '../../../../scripts/hardening/evidence.mjs'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { setupKeyboardHarness, type KeyboardTestCase } from './_shared'

const TEST_FILE = 'tests/unit/hardening/keyboard/foundation.spec.ts'

beforeAll(() => setupKeyboardHarness())

describe('Foundation family keyboard — Button', () => {
  const testCases: KeyboardTestCase[] = []

  function flushEvidence() {
    writeKeyboardEvidence({
      component: 'Button',
      family: 'foundation',
      testFile: TEST_FILE,
      testCases
    })
  }

  afterAll(() => flushEvidence())

  it('Space on focused anchor button emits click', async () => {
    const wrapper = mount(Button, {
      props: { label: 'Docs', href: 'https://example.com' }
    })
    const anchor = wrapper.get('a')
    await anchor.trigger('keydown', { key: ' ' })
    await nextTick()

    expect(wrapper.emitted('click')?.length).toBeGreaterThan(0)

    testCases.push({
      name: 'space-activates-anchor',
      key: 'Space',
      expected: 'Space on focused anchor Button synthesizes click and emits click',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('disabled Button does not emit click on Space', async () => {
    const wrapper = mount(Button, {
      props: { label: 'Locked', disabled: true }
    })
    const btn = wrapper.get('button')
    await btn.trigger('keydown', { key: ' ' })
    await nextTick()

    expect(wrapper.emitted('click')).toBeUndefined()

    testCases.push({
      name: 'disabled-no-click',
      key: 'Space',
      expected: 'disabled Button does not emit click on Space',
      status: 'PASS'
    })
    wrapper.unmount()
  })

  it('on-disk Button keyboard evidence validates', () => {
    flushEvidence()
    const data = JSON.parse(
      readFileSync(
        join(process.cwd(), 'component-hardening/evidence/Button/keyboard.json'),
        'utf8'
      )
    )
    expect(validateKeyboardEvidence(data).ok).toBe(true)
    expect(data.sourceHash).toBeTruthy()
    expect(data.contractHash).toBeTruthy()
  })
})
