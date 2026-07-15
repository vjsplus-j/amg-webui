import { LocaleService } from '@amg-webui/locale'
import type { LocaleCode } from '@amg-webui/locale'

export function getLocaleCode(): LocaleCode {
  return LocaleService.getLocale()
}

export function formatWithIntl(
  date: Date,
  options: Intl.DateTimeFormatOptions,
  locale?: LocaleCode
): string {
  return new Intl.DateTimeFormat(locale ?? getLocaleCode(), options).format(date)
}

export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function toTimeString(date: Date, withSeconds = true): string {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  if (!withSeconds) return `${h}:${m}`
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${h}:${m}:${s}`
}

export function parseISODate(str: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str)
  if (!match) return null
  const d = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return Number.isNaN(d.getTime()) ? null : d
}

export function getWeekdayLabels(locale?: LocaleCode): string[] {
  const code = locale ?? getLocaleCode()
  const fmt = new Intl.DateTimeFormat(code, { weekday: 'short' })
  const base = new Date(2024, 0, 7)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base)
    d.setDate(base.getDate() + i)
    return fmt.format(d)
  })
}

export function getMonthLabels(year: number, locale?: LocaleCode): string[] {
  const code = locale ?? getLocaleCode()
  const fmt = new Intl.DateTimeFormat(code, { month: 'short' })
  return Array.from({ length: 12 }, (_, m) => fmt.format(new Date(year, m, 1)))
}

export function getMonthYearLabel(date: Date, locale?: LocaleCode): string {
  return formatWithIntl(date, { month: 'long', year: 'numeric' }, locale)
}

export function getCalendarDays(year: number, month: number): (Date | null)[][] {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startDay = first.getDay()
  const totalDays = last.getDate()
  const weeks: (Date | null)[][] = []
  let week: (Date | null)[] = Array(startDay).fill(null)
  for (let day = 1; day <= totalDays; day++) {
    week.push(new Date(year, month, day))
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }
  return weeks
}

export function sameDate(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function cssVarToHex(cssValue: string): string {
  if (typeof document === 'undefined') return cssValue
  const el = document.createElement('div')
  el.style.color = cssValue
  document.body.appendChild(el)
  const rgb = getComputedStyle(el).color
  document.body.removeChild(el)
  const match = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(rgb)
  if (!match) return cssValue
  const r = Number(match[1]).toString(16).padStart(2, '0')
  const g = Number(match[2]).toString(16).padStart(2, '0')
  const b = Number(match[3]).toString(16).padStart(2, '0')
  return `#${r}${g}${b}`.toUpperCase()
}
