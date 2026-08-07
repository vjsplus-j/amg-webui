import type { BaseProps } from '@amg-webui/types'
import type { MatrixCodeErrorCorrection, MatrixCodeFormat } from '@amg-webui/utils'

export type { MatrixCodeErrorCorrection, MatrixCodeFormat }

export interface MatrixCodeProps extends BaseProps {
  modelValue?: string | number
  value?: string | number
  /** Two-dimensional or stacked barcode symbology. */
  format?: MatrixCodeFormat
  /** Module pixel scale. */
  pixelSize?: number
  /** Quiet-zone padding around the generated symbol. */
  quietZone?: number
  /** Format-specific error correction: QR L/M/Q/H, PDF417 0-8, Ultracode EC1-EC5. */
  errorCorrection?: MatrixCodeErrorCorrection
  /** Optional format-specific version, e.g. rMQR R17x43. */
  version?: string | number
  ariaLabel?: string
  editable?: boolean
  disabled?: boolean
  loading?: boolean
}

export interface MatrixCodeEmits {
  'update:modelValue': [value: string]
  change: [value: string]
  error: [payload: { format: MatrixCodeFormat; value: string; message: string }]
}
