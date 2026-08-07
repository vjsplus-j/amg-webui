import { ref, computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { PasswordProps } from './types'

export function usePassword(
  props: PasswordProps,
  state?: {
    invalid?: MaybeRefOrGetter<boolean>
    disabled?: MaybeRefOrGetter<boolean>
  }
) {
  const visible = ref(false)

  const inputType = computed(() => (visible.value ? 'text' : 'password'))

  const rootClass = computed(() => [
    'vp-password',
    `vp-password--${props.size ?? 'md'}`,
    {
      'vp-password--fluid': props.fluid,
      'vp-password--disabled': props.disabled || toValue(state?.disabled),
      'vp-password--invalid': props.invalid || toValue(state?.invalid)
    },
    props.class
  ])

  const toggle = () => {
    if (props.disabled || toValue(state?.disabled)) return
    visible.value = !visible.value
  }

  return { visible, inputType, rootClass, toggle }
}
