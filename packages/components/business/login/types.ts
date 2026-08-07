import type { BizRequestOptions } from '../_shared'

export type BizLoginMode = 'password' | 'sms' | 'qr'

/** Domain auth result — not a backend DTO. */
export interface BizAuthResult {
  token?: string
  userId?: string | number
  displayName?: string
}

/** Host-owned auth adapter. UI never hard-codes HTTP or wire DTOs. */
export interface BizAuthAdapter {
  login(credentials: BizLoginCredentials, options?: BizRequestOptions): Promise<BizAuthResult>
  register?(payload: BizRegisterPayload, options?: BizRequestOptions): Promise<BizAuthResult>
  resetPassword?(payload: BizForgotPasswordPayload, options?: BizRequestOptions): Promise<void>
  sendCode?(
    channel: 'login' | 'register' | 'forgot',
    target: string,
    options?: BizRequestOptions
  ): Promise<void>
}

export interface BizLoginCredentials {
  username: string
  password: string
  remember?: boolean
  captchaToken?: string
  mode?: BizLoginMode
  phone?: string
  code?: string
}

export interface BizLoginProps {
  title?: string
  subtitle?: string
  loading?: boolean
  /** When set, submit flows through adapter (race-safe + AbortSignal). */
  adapter?: BizAuthAdapter
  defaultUsername?: string
  showRemember?: boolean
  showRegister?: boolean
  showForgot?: boolean
  showCaptcha?: boolean
  captchaMode?: BizCaptchaMode
  /** Enabled auth modes (tabs). Default password + sms + qr. */
  modes?: BizLoginMode[]
  defaultMode?: BizLoginMode
  verifyCaptcha?: () => Promise<string>
}

export interface BizLoginEmits {
  (e: 'submit', payload: BizLoginCredentials): void
  (e: 'auth-success', result: BizAuthResult): void
  (e: 'register'): void
  (e: 'forgot'): void
  (e: 'send-code'): void
  (e: 'update:mode', mode: BizLoginMode): void
}

export type BizCaptchaMode = 'checkbox' | 'slider'

export interface BizCaptchaProps {
  mode?: BizCaptchaMode
  modelValue?: string
  label?: string
  disabled?: boolean
}

export interface BizCaptchaEmits {
  (e: 'update:modelValue', token: string): void
  (e: 'verify', token: string): void
  (e: 'fail'): void
}

export interface BizVerifyCodeProps {
  modelValue?: string
  placeholder?: string
  sendLabel?: string
  cooldown?: number
  loading?: boolean
  disabled?: boolean
  sending?: boolean
}

export interface BizVerifyCodeEmits {
  (e: 'update:modelValue', code: string): void
  (e: 'send'): void
}

export interface BizRegisterPayload {
  username: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  code: string
  captchaToken: string
}

export interface BizRegisterProps {
  title?: string
  subtitle?: string
  loading?: boolean
  adapter?: BizAuthAdapter
  showCaptcha?: boolean
  captchaMode?: BizCaptchaMode
  codeCooldown?: number
}

export interface BizRegisterEmits {
  (e: 'submit', payload: BizRegisterPayload): void
  (e: 'auth-success', result: BizAuthResult): void
  (e: 'login'): void
  (e: 'send-code'): void
}

export interface BizForgotPasswordPayload {
  account: string
  code: string
  password: string
  confirmPassword: string
  captchaToken: string
}

export interface BizForgotPasswordProps {
  title?: string
  subtitle?: string
  loading?: boolean
  adapter?: BizAuthAdapter
  showCaptcha?: boolean
  captchaMode?: BizCaptchaMode
  codeCooldown?: number
}

export interface BizForgotPasswordEmits {
  (e: 'submit', payload: BizForgotPasswordPayload): void
  (e: 'auth-success'): void
  (e: 'login'): void
  (e: 'send-code'): void
}
