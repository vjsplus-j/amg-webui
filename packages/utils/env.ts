export const isClient = typeof window !== 'undefined'
export const isServer = !isClient

export function getDocument(): Document | null {
  if (!isClient) return null
  return document
}

export function getWindow(): Window | null {
  if (!isClient) return null
  return window
}
