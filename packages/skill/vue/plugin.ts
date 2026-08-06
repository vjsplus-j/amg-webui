import type { App, Plugin } from 'vue'
import type { SkillRuntime } from '../core/runtime'
import { createSkillDirective } from './directive'
import { AmgSkillScope, SKILL_RUNTIME_KEY } from './scope'

export interface SkillPluginOptions {
  runtime: SkillRuntime
}

export function createSkillPlugin(options: SkillPluginOptions): Plugin {
  const runtime = options.runtime
  return {
    install(app: App): void {
      app.provide(SKILL_RUNTIME_KEY, runtime)
      app.component(AmgSkillScope.name ?? 'AmgSkillScope', AmgSkillScope)
      app.directive('skill', createSkillDirective(runtime))
    }
  }
}
