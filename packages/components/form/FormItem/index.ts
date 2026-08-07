import Comp from './index.vue'
import type { FormItemProps, FormItemContext } from './types'

export { Comp as FormItem }
export type { FormItemProps, FormItemContext }
export { FORM_ITEM_INJECTION_KEY } from './types'
export { useFormItem } from './useFormItem'
export type { UseFormItemOptions } from './useFormItem'
export { useNativeInputAttrs, NATIVE_INPUT_ATTR_EXCLUDES } from './useNativeInputAttrs'
export { useControlAriaLabel } from './useControlAriaLabel'
export default Comp
