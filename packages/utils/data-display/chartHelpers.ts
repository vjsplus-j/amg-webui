export const CHART_COLORS = [
  'var(--primary-500)',
  'var(--primary-400)',
  'var(--primary-600)',
  'var(--status-success)',
  'var(--status-warning)',
  'var(--status-danger)',
  'var(--status-info)',
  'var(--text-secondary)'
] as const

export function toNumberSeries(data: unknown, fallback: number[] = []): number[] {
  if (!Array.isArray(data)) return fallback
  if (data.length && typeof data[0] === 'object') {
    return (data as { value?: number; y?: number }[]).map((d) => Number(d.value ?? d.y ?? 0))
  }
  return (data as unknown[]).map((n) => Number(n) || 0)
}

export function toLabelSeries(
  data: unknown,
  fallback: { label: string; value: number }[] = []
): { label: string; value: number }[] {
  if (!Array.isArray(data)) return fallback
  if (data.length && typeof data[0] === 'object') {
    return (data as { label?: string; name?: string; value?: number }[]).map((d, i) => ({
      label: String(d.label ?? d.name ?? i + 1),
      value: Number(d.value ?? 0)
    }))
  }
  return (data as number[]).map((v, i) => ({ label: String(i + 1), value: Number(v) || 0 }))
}

export function chartColor(i: number): string {
  return CHART_COLORS[i % CHART_COLORS.length]
}

export function polarPoint(cx: number, cy: number, r: number, angle: number) {
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle)
  }
}

export function pieSlices(
  items: { label: string; value: number }[],
  cx: number,
  cy: number,
  r: number
) {
  const total = items.reduce((s, d) => s + d.value, 0) || 1
  let start = -Math.PI / 2
  return items.map((d, i) => {
    const sweep = (d.value / total) * Math.PI * 2
    const end = start + sweep
    const x1 = cx + r * Math.cos(start)
    const y1 = cy + r * Math.sin(start)
    const x2 = cx + r * Math.cos(end)
    const y2 = cy + r * Math.sin(end)
    const large = sweep > Math.PI ? 1 : 0
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`
    start = end
    return { ...d, path, color: chartColor(i) }
  })
}

export function radarPolygon(
  values: number[],
  cx: number,
  cy: number,
  maxR: number,
  maxVal: number
) {
  const n = values.length
  if (!n) return ''
  return values
    .map((v, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2
      const r = (v / Math.max(1, maxVal)) * maxR
      const { x, y } = polarPoint(cx, cy, r, angle)
      return `${x},${y}`
    })
    .join(' ')
}
