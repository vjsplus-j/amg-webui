import type { BaseProps } from '@amg-webui/types'
export interface GbsRegister { deviceId: string; sipDomain: string; expires: number; password: string }
export interface GbsRegisterFormProps extends BaseProps { modelValue?: GbsRegister; disabled?: boolean }
export interface GbsRegisterFormEmits { (e: 'update:modelValue', v: GbsRegister): void; (e: 'register', v: GbsRegister): void }
