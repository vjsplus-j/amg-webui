import { computed, inject, toValue, type MaybeRefOrGetter } from 'vue'
import { FORM_INJECTION_KEY } from '../Form/types'
import { FORM_ITEM_INJECTION_KEY } from './types'

export interface UseFormItemOptions {
  id?: MaybeRefOrGetter<string | undefined>
  disabled?: MaybeRefOrGetter<boolean | undefined>
  invalid?: MaybeRefOrGetter<boolean | undefined>
  name?: MaybeRefOrGetter<string | undefined>
}

/**
 * Auto-wire a form control to the nearest FormItem / Form.
 * Child controls call this instead of re-implementing inject + id/aria/disabled merge.
 */
export function useFormItem(options: UseFormItemOptions = {}) {
  const form = inject(FORM_INJECTION_KEY, null)
  const formItem = inject(FORM_ITEM_INJECTION_KEY, null)

  const inputId = computed(() => toValue(options.id) || formItem?.inputId)

  const isDisabled = computed(() =>
    Boolean(toValue(options.disabled) || formItem?.disabled.value || form?.disabled.value)
  )

  const isInvalid = computed(() =>
    Boolean(toValue(options.invalid) || formItem?.error.value)
  )

  const isRequired = computed(() => Boolean(formItem?.required.value))

  const ariaDescribedby = computed(() =>
    formItem?.error.value ? formItem.errorId : undefined
  )

  /** Prefer explicit name; else FormItem `prop` (field key) for native form submit. */
  const name = computed(() => toValue(options.name) ?? formItem?.prop.value)

  async function validateOnBlur(): Promise<string | null> {
    if (!formItem?.prop.value) return null
    return formItem.validate()
  }

  async function validateOnChange(): Promise<string | null> {
    if (!formItem?.prop.value) return null
    if (!formItem.error.value) return null
    return formItem.validate()
  }

  return {
    form,
    formItem,
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
