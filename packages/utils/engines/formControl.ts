/**
 * ENG-001 FormControl Engine — unified field id/name/disabled/invalid/required/aria/model helpers.
 */
import { computed, type ComputedRef, type Ref } from 'vue'

export interface FormControlOptions {
  id?: string
  name?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  invalid?: boolean
  describedBy?: string
}

export interface FormControlBindings {
  id: string | undefined
  name: string | undefined
  disabled: boolean
  readonly: boolean
  required: boolean
  'aria-invalid': boolean | undefined
  'aria-required': boolean | undefined
  'aria-describedby': string | undefined
}

let idSeq = 0

export function createFieldId(prefix = 'vp-field'): string {
  idSeq += 1
  return `${prefix}-${idSeq}`
}

export function useFormControl(
  options: Ref<FormControlOptions> | ComputedRef<FormControlOptions>
): ComputedRef<FormControlBindings> {
  return computed(() => {
    const o = options.value
    const id = o.id || undefined
    return {
      id,
      name: o.name,
      disabled: Boolean(o.disabled),
      readonly: Boolean(o.readonly),
      required: Boolean(o.required),
      'aria-invalid': o.invalid ? true : undefined,
      'aria-required': o.required ? true : undefined,
      'aria-describedby': o.describedBy
    }
  })
}

export function resolveClearValue(multiple: boolean): unknown {
  return multiple ? [] : undefined
}
