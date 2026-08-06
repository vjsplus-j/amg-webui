export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function generateId(): string {
  return `amg-webui-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function getObjectValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((current: unknown, key: string) => {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      return (current as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

export function setObjectValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split('.')
  const lastKey = keys.pop()
  const parent = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {}
    return current[key] as Record<string, unknown>
  }, obj)
  if (lastKey) parent[lastKey] = value
}

export function cloneDeep<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function isObject(obj: unknown): obj is Record<string, unknown> {
  return obj !== null && typeof obj === 'object'
}

export function isArray(obj: unknown): obj is unknown[] {
  return Array.isArray(obj)
}

export function isString(obj: unknown): obj is string {
  return typeof obj === 'string'
}

export function isNumber(obj: unknown): obj is number {
  return typeof obj === 'number' && !isNaN(obj)
}

export function isBoolean(obj: unknown): obj is boolean {
  return typeof obj === 'boolean'
}

export function isFunction(obj: unknown): obj is (...args: unknown[]) => unknown {
  return typeof obj === 'function'
}

export function isEmpty(obj: unknown): boolean {
  if (obj === null || obj === undefined) return true
  if (isArray(obj) || isString(obj)) return obj.length === 0
  if (isObject(obj)) return Object.keys(obj).length === 0
  return false
}

export function formatNumber(
  num: number,
  decimals: number = 0,
  useThousandsSeparator: boolean = true
): string {
  let formatted = num.toFixed(decimals)
  if (useThousandsSeparator) {
    const parts = formatted.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    formatted = parts.join('.')
  }
  return formatted
}

export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + suffix
}
