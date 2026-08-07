export * from './core'
/** Alias: registerOfficialBuiltins is also available from `amg-webui/skill/core`. */
export { createSkillDirective, vSkill } from './vue/directive'
export type {
  SkillDirectiveEntry,
  SkillDirectiveValue,
  SkillObjectDirective
} from './vue/directive'
export { createSkillPlugin, type SkillPluginOptions } from './vue/plugin'
export {
  AmgSkillScope,
  SKILL_RUNTIME_KEY,
  SKILL_SCOPE_KEY,
  type AmgSkillScopeProps,
  useSkillRuntime,
  useSkillScope
} from './vue/scope'
