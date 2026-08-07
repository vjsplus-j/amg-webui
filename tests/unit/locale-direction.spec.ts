import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LocaleService } from '../../packages/locale/LocaleService'

describe('LocaleService direction independence', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      store: {} as Record<string, string>,
      getItem(key: string) {
        return this.store[key] ?? null
      },
      setItem(key: string, value: string) {
        this.store[key] = value
      },
      removeItem(key: string) {
        delete this.store[key]
      },
      clear() {
        this.store = {}
      }
    })
    document.documentElement.removeAttribute('dir')
    document.documentElement.removeAttribute('lang')
    document.documentElement.removeAttribute('data-locale')
    LocaleService.setDirection('ltr')
    LocaleService.setLocale('zh-CN')
  })

  it('keeps ltr when switching to ar-SA', () => {
    LocaleService.setDirection('ltr')
    LocaleService.setLocale('ar-SA')
    expect(LocaleService.getLocale()).toBe('ar-SA')
    expect(LocaleService.getDir()).toBe('ltr')
    expect(document.documentElement.getAttribute('dir')).toBe('ltr')
    expect(document.documentElement.getAttribute('lang')).toBe('ar')
  })

  it('applies rtl to any locale via setDirection', () => {
    LocaleService.setLocale('zh-CN')
    LocaleService.setDirection('rtl')
    expect(LocaleService.getDir()).toBe('rtl')
    expect(document.documentElement.getAttribute('dir')).toBe('rtl')
    expect(document.documentElement.getAttribute('data-locale')).toBe('zh-CN')
  })

  it('toggleDirection flips between ltr and rtl', () => {
    LocaleService.setDirection('ltr')
    expect(LocaleService.toggleDirection()).toBe('rtl')
    expect(LocaleService.toggleDirection()).toBe('ltr')
  })

  it('setDirection(null) resets to ltr without following locale meta', () => {
    LocaleService.setLocale('ar-SA')
    LocaleService.setDirection('rtl')
    LocaleService.setDirection(null)
    expect(LocaleService.getDir()).toBe('ltr')
  })

  it('maps legacy zh-TW to zh-HK', () => {
    LocaleService.setLocale('zh-TW')
    expect(LocaleService.getLocale()).toBe('zh-HK')
    expect(document.documentElement.getAttribute('data-locale')).toBe('zh-HK')
    expect(document.documentElement.getAttribute('lang')).toBe('zh-HK')
  })

  it('loads hi-IN and ug-CN packs', () => {
    LocaleService.setLocale('hi-IN')
    expect(LocaleService.getLocale()).toBe('hi-IN')
    LocaleService.setLocale('ug-CN')
    expect(LocaleService.getLocale()).toBe('ug-CN')
    expect(document.documentElement.getAttribute('lang')).toBe('ug')
  })
})
