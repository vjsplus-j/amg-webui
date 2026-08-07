/**
 * ENG-005 DateTime Model — parse/format/min/max/range helpers.
 */
import { parseISODate, toISODate, toTimeString, formatWithIntl } from '../dateIntl'

export type DateInput = Date | string | number | null | undefined

export function toDate(value: DateInput): Date | null {
  if (value == null || value === '') return null
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }
  if (typeof value === 'number') {
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? null : d
  }
  const iso = parseISODate(String(value))
  if (iso) return iso
  const d = new Date(String(value))
  return Number.isNaN(d.getTime()) ? null : d
}

export function formatDateValue(
  value: DateInput,
  kind: 'date' | 'time' | 'datetime' = 'date'
): string {
  const d = toDate(value)
  if (!d) return ''
  if (kind === 'date') return toISODate(d)
  if (kind === 'time') return toTimeString(d)
  return `${toISODate(d)} ${toTimeString(d)}`
}

export function formatDateLocalized(
  value: DateInput,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }
): string {
  const d = toDate(value)
  if (!d) return ''
  return formatWithIntl(d, options)
}

export function isBefore(a: DateInput, b: DateInput): boolean {
  const da = toDate(a)
  const db = toDate(b)
  if (!da || !db) return false
  return da.getTime() < db.getTime()
}

export function isAfter(a: DateInput, b: DateInput): boolean {
  const da = toDate(a)
  const db = toDate(b)
  if (!da || !db) return false
  return da.getTime() > db.getTime()
}

export function clampDate(
  value: DateInput,
  min?: DateInput,
  max?: DateInput
): Date | null {
  let d = toDate(value)
  if (!d) return null
  const minD = toDate(min)
  const maxD = toDate(max)
  if (minD && d.getTime() < minD.getTime()) d = minD
  if (maxD && d.getTime() > maxD.getTime()) d = maxD
  return d
}

export function isInRange(
  value: DateInput,
  start: DateInput,
  end: DateInput
): boolean {
  const d = toDate(value)
  const s = toDate(start)
  const e = toDate(end)
  if (!d || !s || !e) return false
  const t = d.getTime()
  return t >= s.getTime() && t <= e.getTime()
}
