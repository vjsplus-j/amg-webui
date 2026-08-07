import { config } from '@vue/test-utils'
import { LocaleService } from '@amg-webui/locale'

export const TEST_FILE_ROOT = 'tests/unit/hardening/keyboard'

export function setupKeyboardHarness() {
  LocaleService.init()
  config.global.stubs = { teleport: true, Transition: false, RouterLink: true }
}

export type KeyboardTestCase = {
  name: string
  key: string
  expected: string
  status: 'PASS' | 'FAIL'
}
