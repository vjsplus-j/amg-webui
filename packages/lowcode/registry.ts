import type { CanvasMaterialItem } from '@amg-webui/utils'
import type {
  ComponentRegistry,
  CreateComponentRegistryOptions,
  LowcodeComponentMeta,
  RegistryConflictPolicy,
  RegistryRegisterResult
} from './types'

export class RegistryConflictError extends Error {
  readonly type: string
  constructor(type: string) {
    super(`Component type "${type}" is already registered`)
    this.name = 'RegistryConflictError'
    this.type = type
  }
}

export function createComponentRegistry(
  initial?: LowcodeComponentMeta[],
  options: CreateComponentRegistryOptions = {}
): ComponentRegistry {
  const map = new Map<string, LowcodeComponentMeta>()
  const onConflict: RegistryConflictPolicy = options.onConflict ?? 'throw'

  const api: ComponentRegistry = {
    get onConflict() {
      return onConflict
    },
    register(meta) {
      const list = Array.isArray(meta) ? meta : [meta]
      const result: RegistryRegisterResult = {
        registered: [],
        skipped: [],
        replaced: []
      }
      for (const item of list) {
        if (!item?.type || !item.component) continue
        const exists = map.has(item.type)
        if (exists) {
          if (onConflict === 'throw') {
            throw new RegistryConflictError(item.type)
          }
          if (onConflict === 'skip') {
            result.skipped.push(item.type)
            continue
          }
          map.set(item.type, item)
          result.replaced.push(item.type)
          continue
        }
        map.set(item.type, item)
        result.registered.push(item.type)
      }
      return result
    },
    unregister(type) {
      map.delete(type)
    },
    has(type) {
      return map.has(type)
    },
    get(type) {
      return map.get(type)
    },
    list(group) {
      const all = [...map.values()]
      return group ? all.filter((m) => m.group === group) : all
    },
    toMaterials(): CanvasMaterialItem[] {
      return [...map.values()].map((m) => ({
        type: m.type,
        label: m.label,
        group: m.group,
        defaultProps: m.defaultProps ? { ...m.defaultProps } : undefined,
        defaultSize: m.defaultSize ? { ...m.defaultSize } : undefined
      }))
    },
    clear() {
      map.clear()
    }
  }

  if (initial?.length) api.register(initial)
  return api
}
