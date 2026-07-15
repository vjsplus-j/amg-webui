export interface BizLoginCredentials {
  username: string
  password: string
  remember?: boolean
  captchaToken?: string
}

export interface BizLoginProps {
  title?: string
  subtitle?: string
  loading?: boolean
  defaultUsername?: string
  showRemember?: boolean
  showRegister?: boolean
  showForgot?: boolean
  showCaptcha?: boolean
  captchaMode?: BizCaptchaMode
}

export interface BizLoginEmits {
  (e: 'submit', payload: BizLoginCredentials): void
  (e: 'register'): void
  (e: 'forgot'): void
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
  showCaptcha?: boolean
  captchaMode?: BizCaptchaMode
  codeCooldown?: number
}

export interface BizRegisterEmits {
  (e: 'submit', payload: BizRegisterPayload): void
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
  showCaptcha?: boolean
  captchaMode?: BizCaptchaMode
  codeCooldown?: number
}

export interface BizForgotPasswordEmits {
  (e: 'submit', payload: BizForgotPasswordPayload): void
  (e: 'login'): void
  (e: 'send-code'): void
}
