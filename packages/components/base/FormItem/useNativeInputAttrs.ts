import { computed, useAttrs } from 'vue'

/**
 * Attrs bound explicitly on the native control — exclude from `$attrs` fallthrough
 * so they are not duplicated / do not land on the wrapper host.
 */
const DEFAULT_EXCLUDE = new Set([
  'class',
  'style',
  'id',
  'name',
  'disabled',
  'readonly',
  'placeholder',
  'maxlength',
  'minlength',
  'type',
  'value',
  'rows',
  'cols',
  'autocomplete',
  'inputmode',
  'pattern',
  'aria-label',
  'aria-labelledby',
  'aria-invalid',
  'aria-required',
  'aria-describedby',
  'aria-disabled'
])

/**
 * Forward undeclared native / ARIA attrs onto the real `<input>` / `<textarea>`,
 * not the component wrapper (Vue default fallthrough would hit the root div).
 *
 * Pair with `defineOptions({ inheritAttrs: false })`.
 */
export function useNativeInputAttrs(exclude: Iterable<string> = []) {
  const attrs = useAttrs()
  const excludeSet = new Set([...DEFAULT_EXCLUDE, ...exclude])

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
