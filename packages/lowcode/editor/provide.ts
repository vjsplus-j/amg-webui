import { inject, provide, type InjectionKey } from 'vue'
import type { LowcodeEditor } from './types'

export const LowcodeEditorKey: InjectionKey<LowcodeEditor> = Symbol('vp-lowcode-editor')

export function provideLowcodeEditor(editor: LowcodeEditor): LowcodeEditor {
  provide(LowcodeEditorKey, editor)
  return editor
}

export function useLowcodeEditor(): LowcodeEditor | undefined {
  return inject(LowcodeEditorKey, undefined)
}
