import type { TeleportTarget } from './types'
import { getDocument, isClient } from '@amg-webui/utils/env'

/** Resolve Teleport `to` for Vue — SSR returns fallback without touching DOM. */
export function resolveTeleportTarget(
  target: TeleportTarget,
  fallback: TeleportTarget = 'body'
): TeleportTarget {
  if (target === undefined || target === null) return fallback
  if (typeof target !== 'string') return target
  if (!isClient) return target || fallback
  if (target === 'body' || target === 'html') return target
  const doc = getDocument()
  if (!doc) return fallback
  try {
    if (doc.querySelector(target)) return target
  } catch {
    return fallback
  }
  return fallback
}

export function createTeleportManager(getDefault: () => TeleportTarget) {
  return {
    resolve(override?: TeleportTarget): TeleportTarget {
      return resolveTeleportTarget(override ?? getDefault(), getDefault() ?? 'body')
    }
  }
}

export type TeleportManager = ReturnType<typeof createTeleportManager>
