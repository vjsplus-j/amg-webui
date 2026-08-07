import type { BaseProps } from '@amg-webui/types'
import type { BarcodeFormat } from '@amg-webui/utils'

export type { BarcodeFormat }

export interface BarcodeProps extends BaseProps {
  modelValue?: string
  value?: string
  barWidth?: number
  height?: number
  showLabel?: boolean
  /** Standards-based barcode symbology. */
  format?: BarcodeFormat
  /** Show the editable source input above the symbol. */
  editable?: boolean
  /** Quiet-zone padding around the generated symbol. */
  quietZone?: number
  ariaLabel?: string
  disabled?: boolean
  loading?: boolean
}

export interface BarcodeEmits {
  'update:modelValue': [value: string]
  change: [value: string]
  error: [payload: { format: BarcodeFormat; value: string; message: string }]
}
