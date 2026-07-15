export function rowsToCsv(rows: Record<string, unknown>[], columns?: string[]): string {
  if (!rows.length) return ''
  const cols = columns ?? Object.keys(rows[0])
  const escape = (v: unknown) => {
    const s = v == null ? '' : String(v)
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
    return s
  }
  const header = cols.map(escape).join(',')
  const body = rows.map((row) => cols.map((c) => escape(row[c])).join(',')).join('\n')
  return `${header}\n${body}`
}

export function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean)
  if (!lines.length) return []
  const splitLine = (line: string): string[] => {
    const out: string[] = []
    let cur = ''
    let inQ = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        if (inQ && line[i + 1] === '"') {
          cur += '"'
          i++
        } else inQ = !inQ
      } else if (ch === ',' && !inQ) {
        out.push(cur)
        cur = ''
      } else cur += ch
    }
    out.push(cur)
    return out
  }
  const headers = splitLine(lines[0])
  return lines.slice(1).map((line) => {
    const cells = splitLine(line)
    const row: Record<string, string> = {}
    headers.forEach((h, i) => {
      row[h] = cells[i] ?? ''
    })
    return row
  })
}

export function downloadTextFile(filename: string, content: string, mime = 'text/csv;charset=utf-8') {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
