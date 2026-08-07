import type { BaseProps } from '@amg-webui/types'

export interface CryptoBoxProps extends BaseProps {
  modelValue?: string
  passphrase?: string
  masked?: boolean
  disabled?: boolean
}

export interface CryptoBoxEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'encrypted', cipher: string): void
  (e: 'decrypted', plain: string): void
}
