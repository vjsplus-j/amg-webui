import { ref, computed } from 'vue'
import type { PasswordProps } from './types'

export function usePassword(props: PasswordProps) {
  const visible = ref(false)

  const inputType = computed(() => (visible.value ? 'text' : 'password'))

  const rootClass = computed(() => [
    'vp-password',
    `vp-password--${props.size ?? 'md'}`,
    {
      'vp-password--fluid': props.fluid,
      'vp-password--disabled': props.disabled,
      'vp-password--invalid': props.invalid
    },
    props.class
  ])

  const toggle = () => {
    if (props.disabled) return
    visible.value = !visible.value
  }

  return { visible, inputType, rootClass, toggle }
}
