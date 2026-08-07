import { computed, useAttrs } from 'vue'

/**
 * Forward undeclared native / ARIA attrs onto the real `<input>` / `<textarea>` /
 * trigger control — not the component wrapper (`inheritAttrs: false`).
 *
 * Declared props never appear in `useAttrs()`, so do **not** maintain a prop-name
 * blacklist that drifts from each component's template. Explicit bindings that
 * come after `v-bind="nativeAttrs"` already win; only pass `exclude` for keys
 * that must not land on the control at all.
 */
export function useNativeInputAttrs(exclude: Iterable<string> = []) {
  const attrs = useAttrs()
  const excludeSet = exclude instanceof Set ? exclude : new Set(exclude)

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
