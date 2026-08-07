import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { LocaleKey } from '@amg-webui/locale'

/**
 * Resolve `aria-label` for standalone form controls (no visible FormItem label).
 * When a visible label exists via FormItem, callers should omit aria-label and use
 * `aria-labelledby` from {@link useFormItem} instead.
 */
export function useControlAriaLabel(
  ariaLabel: MaybeRefOrGetter<string | undefined>,
  fallbackKey: LocaleKey,
  hasVisibleLabel: MaybeRefOrGetter<boolean> = false
) {
  const { t } = useLocale()
  return computed(() => {
    if (toValue(hasVisibleLabel)) return undefined
    return toValue(ariaLabel) || t(fallbackKey)
  })
}
