import { computed, inject, toValue, type MaybeRefOrGetter } from 'vue'
import { FORM_INJECTION_KEY } from '../Form/types'
import { FORM_ITEM_INJECTION_KEY } from './types'

export interface UseFormItemOptions {
  id?: MaybeRefOrGetter<string | undefined>
  disabled?: MaybeRefOrGetter<boolean | undefined>
  invalid?: MaybeRefOrGetter<boolean | undefined>
  name?: MaybeRefOrGetter<string | undefined>
  /** When true, skip FormItem inject merge (e.g. child of CheckboxGroup). */
  skip?: MaybeRefOrGetter<boolean | undefined>
}

/**
 * Auto-wire a form control to the nearest FormItem / Form.
 * Child controls call this instead of re-implementing inject + id/aria/disabled merge.
 */
export function useFormItem(options: UseFormItemOptions = {}) {
  const form = inject(FORM_INJECTION_KEY, null)
  const formItem = inject(FORM_ITEM_INJECTION_KEY, null)

  const skipped = computed(() => Boolean(toValue(options.skip)))
  const activeFormItem = computed(() => (skipped.value ? null : formItem))

  const inputId = computed(
    () => toValue(options.id) || activeFormItem.value?.inputId
  )

  const isDisabled = computed(() =>
    Boolean(
      toValue(options.disabled) ||
        activeFormItem.value?.disabled.value ||
        form?.disabled.value
    )
  )

  const isInvalid = computed(() =>
    Boolean(toValue(options.invalid) || activeFormItem.value?.error.value)
  )

  const isRequired = computed(() => Boolean(activeFormItem.value?.required.value))

  const ariaDescribedby = computed(() =>
    activeFormItem.value?.error.value ? activeFormItem.value.errorId : undefined
  )

  /** Prefer explicit name; else FormItem `prop` (field key) for native form submit. */
  const name = computed(() => toValue(options.name) ?? activeFormItem.value?.prop.value)

  async function validateOnBlur(): Promise<string | null> {
    if (!activeFormItem.value?.prop.value) return null
    return activeFormItem.value.validate()
  }

  async function validateOnChange(): Promise<string | null> {
    if (!activeFormItem.value?.prop.value) return null
    if (!activeFormItem.value.error.value) return null
    return activeFormItem.value.validate()
  }

  return {
    form,
    formItem: activeFormItem,
    inputId,
    isDisabled,
    isInvalid,
    isRequired,
    ariaDescribedby,
    name,
    validateOnBlur,
    validateOnChange
  }
}
