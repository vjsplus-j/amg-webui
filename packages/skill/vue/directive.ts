import type { ObjectDirective } from 'vue'
import type { SkillRuntime } from '../core/runtime'
import type { SkillHandle, SkillScope } from '../core/types'

export interface SkillDirectiveEntry {
  name: string
  config?: unknown
  runtime?: SkillRuntime
  scope?: SkillScope
  /** Explicit, versioned capability bridge exposed to the Skill. */
  host?: object
  onError?: (error: Error) => void
}

export type SkillDirectiveValue = SkillDirectiveEntry | readonly SkillDirectiveEntry[]
export type SkillObjectDirective = ObjectDirective<
  object,
  SkillDirectiveValue,
  string,
  string | undefined
>

interface DirectiveMount {
  handles: SkillHandle[]
  disposed: boolean
}

const mounts = new WeakMap<object, DirectiveMount>()
const revisions = new WeakMap<object, number>()

function normalize(value: SkillDirectiveValue): readonly SkillDirectiveEntry[] {
  return Array.isArray(value) ? value : [value as SkillDirectiveEntry]
}

async function disposeMount(element: object): Promise<void> {
  const mount = mounts.get(element)
  if (!mount || mount.disposed) return
  mount.disposed = true
  mounts.delete(element)
  await Promise.allSettled([...mount.handles].reverse().map((handle) => handle.dispose()))
}

function report(error: unknown, entry: SkillDirectiveEntry): void {
  const normalized = error instanceof Error ? error : new Error(String(error))
  if (entry.onError) entry.onError(normalized)
  else {
    console.error(
      `[AMG Skill Runtime] v-skill setup failed: ${entry.name} (${normalized.name})`
    )
  }
}

function mountEntries(
  element: object,
  value: SkillDirectiveValue,
  fallbackRuntime?: SkillRuntime
): void {
  const mount: DirectiveMount = { handles: [], disposed: false }
  mounts.set(element, mount)

  for (const entry of normalize(value)) {
    const runtime = entry.runtime ?? fallbackRuntime
    if (!runtime) {
      report(new Error('v-skill requires entry.runtime or createSkillPlugin({ runtime })'), entry)
      continue
    }
    try {
      const options = { host: entry.host }
      const handle = entry.scope
        ? entry.scope.mount(entry.name, entry.config, options)
        : runtime.mount(entry.name, entry.config, options)
      mount.handles.push(handle)
      void handle.ready.catch((error: unknown) => report(error, entry))
    } catch (error) {
      report(error, entry)
    }
  }
}

export function createSkillDirective(
  runtime?: SkillRuntime
): SkillObjectDirective {
  return {
    mounted(element, binding) {
      revisions.set(element, 0)
      mountEntries(element, binding.value, runtime)
    },
    updated(element, binding) {
      if (binding.value === binding.oldValue) return
      const revision = (revisions.get(element) ?? 0) + 1
      revisions.set(element, revision)
      void disposeMount(element).finally(() => {
        if (revisions.get(element) === revision) {
          mountEntries(element, binding.value, runtime)
        }
      })
    },
    unmounted(element) {
      revisions.set(element, (revisions.get(element) ?? 0) + 1)
      void disposeMount(element)
    }
  }
}

export const vSkill: SkillObjectDirective = createSkillDirective()
