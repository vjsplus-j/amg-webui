/** Deterministic pseudo-QR matrix from string (no external API). */
export function buildQrcodeMatrix(text: string, size = 21): boolean[][] {
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false))

  const setFinder = (ox: number, oy: number) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const border = x === 0 || y === 0 || x === 6 || y === 6
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4
        matrix[oy + y][ox + x] = border || core
      }
    }
  }

  setFinder(0, 0)
  setFinder(size - 7, 0)
  setFinder(0, size - 7)

  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (matrix[y][x]) continue
      const inQuiet =
        (x < 8 && y < 8) ||
        (x >= size - 8 && y < 8) ||
        (x < 8 && y >= size - 8)
      if (inQuiet) continue
      const seed = (hash + x * 17 + y * 23 + text.length * 13) >>> 0
      matrix[y][x] = (seed & 3) !== 0
    }
  }

  return matrix
}

export function matrixToSvg(
  matrix: boolean[][],
  pixelSize = 4,
  fg = 'currentColor',
  bg = 'transparent'
): string {
  const rows = matrix.length
  const cols = matrix[0]?.length ?? 0
  const w = cols * pixelSize
  const h = rows * pixelSize
  let rects = ''
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (matrix[y][x]) {
        rects += `<rect x="${x * pixelSize}" y="${y * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${fg}"/>`
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><rect width="100%" height="100%" fill="${bg}"/>${rects}</svg>`
}
