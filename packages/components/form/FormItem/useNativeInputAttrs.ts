import { computed, useAttrs } from 'vue'

/** Sample-mount / doc-preview props that must not leak onto native controls. */
export const NATIVE_INPUT_ATTR_EXCLUDES = [
  'title',
  'message',
  'content',
  'text',
  'label',
  'items',
  'options',
  'data',
  'treeData',
  'columns',
  'rows',
  'value',
  'fields',
  'suggestions',
  'slides',
  'src',
  'poster',
  'url',
  'visible',
  'open'
] as const

/**
 * Forward undeclared native / ARIA attrs onto the real `<input>` / `<textarea>` /
 * trigger control — not the component wrapper (`inheritAttrs: false`).
 *
 * Declared props never appear in `useAttrs()`, so do **not** maintain a prop-name
 * blacklist that drifts from each component's template. Explicit bindings that
 * come after `v-bind="nativeAttrs"` already win; only pass `exclude` for keys
 * that must not land on the control at all.
 */
export function useNativeInputAttrs(
  exclude: Iterable<string> = NATIVE_INPUT_ATTR_EXCLUDES
) {
  const attrs = useAttrs()
  const excludeSet =
    exclude === NATIVE_INPUT_ATTR_EXCLUDES
      ? new Set(NATIVE_INPUT_ATTR_EXCLUDES)
      : exclude instanceof Set
        ? new Set([...NATIVE_INPUT_ATTR_EXCLUDES, ...exclude])
        : new Set([...NATIVE_INPUT_ATTR_EXCLUDES, ...exclude])

  const nativeAttrs = computed(() => {
    const out: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(attrs)) {
      if (excludeSet.has(key)) continue
      out[key] = value
    }
    return out
  })

  return { attrs, nativeAttrs }
}
