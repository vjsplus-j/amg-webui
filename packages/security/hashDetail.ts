/**
 * Sync FNV-1a 32-bit hash for alert correlation (SSR-safe, no Web Crypto).
 * Not a cryptographic hash — only for dedupe / monitoring keys.
 */
export function hashDetail(value: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16).padStart(8, '0')
}
