import type { BaseProps } from '@amg-webui/types'
import type { QrcodeErrorCorrectionLevel, QrcodeStandard } from '@amg-webui/utils'

export interface QrcodeProps extends BaseProps {
  modelValue?: string | number
  value?: string | number
  /** @deprecated Kept for compatibility; QR size is selected by the encoder. */
  size?: number
  pixelSize?: number
  /** QR Code standard profile. */
  standard?: QrcodeStandard
  /** QR Code error correction level. */
  errorCorrection?: QrcodeErrorCorrectionLevel
  /** Quiet-zone padding around the generated symbol. */
  quietZone?: number
  ariaLabel?: string
  editable?: boolean
  disabled?: boolean
  loading?: boolean
}

export interface QrcodeEmits {
  'update:modelValue': [value: string]
  change: [value: string]
  error: [payload: { standard: QrcodeStandard; value: string; message: string }]
}

export type { QrcodeErrorCorrectionLevel, QrcodeStandard }
