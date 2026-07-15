import type { FormRule } from './types'

export async function runRule(
  value: unknown,
  rule: FormRule
): Promise<string | null> {
  if (rule.required && (value == null || value === '' || (Array.isArray(value) && !value.length))) {
    return rule.message ?? 'required'
  }
  if (rule.min != null && typeof value === 'string' && value.length < rule.min) {
    return rule.message ?? 'min'
  }
  if (rule.max != null && typeof value === 'string' && value.length > rule.max) {
    return rule.message ?? 'max'
  }
  if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
    return rule.message ?? 'pattern'
  }
  if (rule.validator) {
    const result = await rule.validator(value)
    if (result === true) return null
    if (typeof result === 'string') return result
    return rule.message ?? 'invalid'
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
