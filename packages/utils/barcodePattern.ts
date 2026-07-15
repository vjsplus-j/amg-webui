/** Simple Code128-style bar pattern from text (SVG bars, no external lib). */
export function buildBarcodeBars(text: string): number[] {
  const bars: number[] = [2, 1, 1]
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i)
    bars.push((code & 1) === 1 ? 3 : 1)
    bars.push((code & 2) === 2 ? 2 : 1)
    bars.push((code & 4) === 4 ? 3 : 1)
    bars.push(1)
  }
  bars.push(2, 1, 3)
  return bars
}

export function barsToSvg(
  bars: number[],
  barWidth = 2,
  height = 48,
  fg = 'currentColor'
): string {
  let x = 0
  let rects = ''
  bars.forEach((w, i) => {
    if (i % 2 === 0) {
      rects += `<rect x="${x}" y="0" width="${w * barWidth}" height="${height}" fill="${fg}"/>`
    }
    x += w * barWidth
  })
  const totalW = x
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${height}" width="${totalW}" height="${height}">${rects}</svg>`
}
