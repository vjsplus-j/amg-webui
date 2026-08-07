import type { FormRule } from './types'
import { LocaleService, LocaleKeys, type LocaleKey } from '@amg-webui/locale'

function t(key: LocaleKey, params?: Record<string, string | number>) {
  return LocaleService.t(key, params)
}

export async function runRule(
  value: unknown,
  rule: FormRule
): Promise<string | null> {
  if (rule.required && (value == null || value === '' || (Array.isArray(value) && !value.length))) {
    return rule.message ?? t(LocaleKeys.error.required)
  }
  if (rule.min != null && typeof value === 'string' && value.length < rule.min) {
    return rule.message ?? t(LocaleKeys.error.minLength, { min: rule.min })
  }
  if (rule.max != null && typeof value === 'string' && value.length > rule.max) {
    return rule.message ?? t(LocaleKeys.error.maxLength, { max: rule.max })
  }
  if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
    return rule.message ?? t(LocaleKeys.error.pattern)
  }
  if (rule.validator) {
    const result = await rule.validator(value)
    if (result === true) return null
    if (typeof result === 'string') return result
    return rule.message ?? t(LocaleKeys.error.validation)
  }
  return null
}

export async function validateRules(
  value: unknown,
  rules: FormRule | FormRule[] | undefined
): Promise<string | null> {
  if (!rules) return null
  const list = Array.isArray(rules) ? rules : [rules]
  for (const rule of list) {
    const err = await runRule(value, rule)
    if (err) return err
  }
  return null
}
