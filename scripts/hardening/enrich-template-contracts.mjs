/**
 * Enrich template contracts for Select / DatePicker / Dialog / Form / DataTable.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const hardening = join(root, 'component-hardening')

const TEMPLATES = {
  Select: {
    maturity: 'rc',
    requiredExpose: ['focus', 'blur', 'open', 'close', 'clear'],
    requiredSlots: ['default', 'option', 'empty', 'loading'],
    models: [
      {
        name: 'modelValue',
        type: 'string | number | Array<string | number> | undefined',
        clearValue: 'multiple ? [] : undefined',
        notes: 'multiple flips value to array; clear emits update:modelValue'
      }
    ],
    behavioralContract: {
      open: 'Opens dropdown panel; sets aria-expanded true',
      close: 'Closes panel; restores focus to trigger',
      clear: 'Clears selection; emits update:modelValue and clear',
      disabled: 'No open/select when disabled',
      unmount: 'Removes listeners and floating panel'
    },
    keyboard: ['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Home', 'End'],
    states: ['default', 'open', 'disabled', 'loading', 'empty']
  },
  DatePicker: {
    maturity: 'rc',
    requiredExpose: ['focus', 'blur', 'open', 'close'],
    requiredSlots: ['default'],
    models: [
      {
        name: 'modelValue',
        type: 'string | Date | null | undefined',
        clearValue: 'undefined',
        notes: 'valueFormat controls string serialization'
      }
    ],
    behavioralContract: {
      open: 'Opens calendar panel',
      clear: 'Clears value to undefined and emits change',
      minMax: 'Dates outside min/max are not selectable',
      unmount: 'Panel and listeners disposed'
    },
    keyboard: ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', 'Escape'],
    states: ['default', 'open', 'disabled', 'readonly']
  },
  Dialog: {
    maturity: 'rc',
    requiredExpose: ['open', 'close'],
    requiredSlots: ['default', 'header', 'footer'],
    models: [
      {
        name: 'visible',
        type: 'boolean',
        clearValue: 'false',
        notes: 'v-model:visible; beforeClose may veto'
      }
    ],
    behavioralContract: {
      open: 'Registers with OverlayRuntime; traps focus',
      close: 'Emits close reason; restores focus; unlocks scroll',
      escape: 'Escape closes topmost dialog only',
      unmount: 'Force-dismiss from overlay stack'
    },
    keyboard: ['Escape', 'Tab'],
    states: ['default', 'open', 'disabled']
  },
  Form: {
    maturity: 'rc',
    requiredExpose: ['validate', 'validateField', 'resetFields', 'clearValidate', 'scrollToField'],
    requiredSlots: ['default'],
    models: [],
    behavioralContract: {
      validate: 'Returns Promise<boolean>; stale async results ignored',
      resetFields: 'Restores initial values and clears validate state',
      unmount: 'Clears field registry'
    },
    keyboard: [],
    states: ['default', 'disabled', 'validating', 'error']
  },
  DataTable: {
    maturity: 'rc',
    requiredExpose: ['scrollTo', 'clearSelection', 'getSelectionRows'],
    requiredSlots: ['default', 'empty', 'loading', 'cell', 'header'],
    models: [],
    behavioralContract: {
      sort: 'Toggles column sort and emits sort-change',
      filter: 'Applies column filters; virtual window resets to top',
      unmount: 'Cancels pending sort workers and observers'
    },
    keyboard: ['ArrowUp', 'ArrowDown', 'Home', 'End'],
    states: ['default', 'loading', 'empty', 'disabled']
  }
}

function main() {
  for (const [name, patch] of Object.entries(TEMPLATES)) {
    const path = join(hardening, 'contracts', `${name}.json`)
    if (!existsSync(path)) {
      console.warn(`[enrich-templates] missing ${name}`)
      continue
    }
    const contract = JSON.parse(readFileSync(path, 'utf8'))
    const wasFrozen = Boolean(contract.apiFreeze?.frozen)
    Object.assign(contract, patch)
    if (wasFrozen) {
      contract.maturity = 'stable'
      contract.promoteStable = true
      contract.apiFreeze = {
        version: '1',
        frozen: true,
        frozenAt: contract.apiFreeze?.frozenAt || new Date().toISOString()
      }
    }
    contract.generated = false
    contract.template = true
    contract.updatedAt = new Date().toISOString()
    writeFileSync(path, JSON.stringify(contract, null, 2) + '\n')
    console.log(`[enrich-templates] ${name}`)
  }
}

main()
