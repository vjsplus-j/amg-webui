import {
  defineComponent,
  inject,
  onBeforeUnmount,
  provide,
  type DefineComponent,
  type InjectionKey,
  type PropType
} from 'vue'
import type { SkillRuntime } from '../core/runtime'
import type { SkillScope } from '../core/types'

export const SKILL_RUNTIME_KEY: InjectionKey<SkillRuntime> = Symbol('amg-skill-runtime')
export const SKILL_SCOPE_KEY: InjectionKey<SkillScope> = Symbol('amg-skill-scope')

export function useSkillRuntime(): SkillRuntime {
  const runtime = inject(SKILL_RUNTIME_KEY, undefined)
  if (!runtime) throw new Error('useSkillRuntime() requires createSkillPlugin({ runtime })')
  return runtime
}

export function useSkillScope(required = true): SkillScope | undefined {
  const scope = inject(SKILL_SCOPE_KEY, undefined)
  if (!scope && required) {
    throw new Error('useSkillScope() must be called under <AmgSkillScope>')
  }
  return scope
}

export interface AmgSkillScopeProps {
  runtime?: SkillRuntime
  scopeId?: string
}

export const AmgSkillScope = defineComponent({
  name: 'AmgSkillScope',
  props: {
    runtime: {
      type: Object as PropType<SkillRuntime>,
      default: undefined
    },
    scopeId: {
      type: String,
      default: undefined
    }
  },
  setup(props, { slots, expose }) {
    const inheritedRuntime = inject(SKILL_RUNTIME_KEY, undefined)
    const runtime = props.runtime ?? inheritedRuntime
    if (!runtime) {
      throw new Error('<AmgSkillScope> requires a runtime prop or createSkillPlugin({ runtime })')
    }
    const scope = runtime.createScope(props.scopeId)

    provide(SKILL_RUNTIME_KEY, runtime)
    provide(SKILL_SCOPE_KEY, scope)
    expose({ runtime, scope })

    onBeforeUnmount(() => {
      void scope.dispose().catch(() => {
        // Runtime observers own error reporting; component teardown stays safe.
      })
    })

    return () => slots.default?.({ runtime, scope })
  }
}) as DefineComponent<AmgSkillScopeProps>
