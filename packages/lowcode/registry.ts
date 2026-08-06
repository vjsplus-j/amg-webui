import type { CanvasMaterialItem } from '@amg-webui/utils'
import type { ComponentRegistry, LowcodeComponentMeta } from './types'

export function createComponentRegistry(
  initial?: LowcodeComponentMeta[]
): ComponentRegistry {
  const map = new Map<string, LowcodeComponentMeta>()

  const api: ComponentRegistry = {
    register(meta) {
      const list = Array.isArray(meta) ? meta : [meta]
      for (const item of list) {
        if (!item?.type || !item.component) continue
        map.set(item.type, item)
      }
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
