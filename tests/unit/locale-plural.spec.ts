import { describe, it, expect, afterEach } from 'vitest'
import { LocaleService, resolvePlurals } from '@amg-webui/locale'

describe('locale plurals (ICU-lite)', () => {
  afterEach(() => {
    LocaleService.setLocale('zh-CN')
  })

  it('resolves russian one/few/many via Intl.PluralRules', () => {
    const tpl =
      '{count, plural, one {# элемент} few {# элемента} many {# элементов} other {# элемента}}'
    expect(resolvePlurals(tpl, { count: 1 }, 'ru-RU')).toBe('1 элемент')
    expect(resolvePlurals(tpl, { count: 3 }, 'ru-RU')).toBe('3 элемента')
    expect(resolvePlurals(tpl, { count: 5 }, 'ru-RU')).toBe('5 элементов')
    expect(resolvePlurals(tpl, { count: 1.5 }, 'ru-RU')).toBe('1.5 элемента')
  })

  it('exact =N arms win over CLDR categories', () => {
    const tpl = '{count, plural, =0 {ничего} one {# штука} other {# штук}}'
    expect(resolvePlurals(tpl, { count: 0 }, 'ru-RU')).toBe('ничего')
    expect(resolvePlurals(tpl, { count: 1 }, 'ru-RU')).toBe('1 штука')
    expect(resolvePlurals(tpl, { count: 7 }, 'ru-RU')).toBe('7 штук')
  })

  it('falls back to other when the value is missing', () => {
    const tpl = '{count, plural, one {# item} other {# items}}'
    expect(resolvePlurals(tpl, undefined, 'en-US')).toBe(' items')
  })

  it('keeps non-plural templates untouched', () => {
    expect(resolvePlurals('共 {count} 个', { count: 3 }, 'zh-CN')).toBe('共 {count} 个')
    expect(resolvePlurals('plain text', undefined, 'ru-RU')).toBe('plain text')
  })

  it('LocaleService.t applies russian declension', () => {
    LocaleService.setLocale('ru-RU')
    expect(LocaleService.t('avatar.group.overflow', { count: 1 })).toBe('ещё 1 человек')
    expect(LocaleService.t('avatar.group.overflow', { count: 3 })).toBe('ещё 3 человека')
    expect(LocaleService.t('avatar.group.overflow', { count: 5 })).toBe('ещё 5 человек')
    expect(LocaleService.t('error.minLength', { min: 1 })).toBe('Не менее 1 символ')
    expect(LocaleService.t('error.minLength', { min: 2 })).toBe('Не менее 2 символа')
    expect(LocaleService.t('error.minLength', { min: 6 })).toBe('Не менее 6 символов')
  })

  it('english plural and unaffected locales stay stable', () => {
    LocaleService.setLocale('en-US')
    expect(LocaleService.t('error.minLength', { min: 1 })).toBe('At least 1 character')
    expect(LocaleService.t('error.minLength', { min: 6 })).toBe('At least 6 characters')

    LocaleService.setLocale('zh-CN')
    expect(LocaleService.t('error.minLength', { min: 6 })).toBe('最少 6 个字符')
    expect(LocaleService.t('avatar.group.overflow', { count: 5 })).toBe('还有 5 人')
  })
})
