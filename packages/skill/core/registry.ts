import type { SkillAdapter } from '../adapters/types'
import { SkillRegistrationError } from './errors'
import type { SkillRegisterOptions, SkillUnit } from './types'

function assertName(name: string, kind: string): void {
  if (!name.trim()) throw new SkillRegistrationError(`${kind} name cannot be empty`)
}

export class SkillRegistry {
  private readonly units = new Map<string, SkillUnit>()

  register<Config, Output>(
    unit: SkillUnit<Config, Output>,
    options: SkillRegisterOptions = {}
  ): () => void {
    assertName(unit.name, 'Skill')
    if (this.units.has(unit.name) && !options.override) {
      throw new SkillRegistrationError(`Skill "${unit.name}" is already registered`)
    }
    this.units.set(unit.name, unit as SkillUnit)
    return () => {
      if (this.units.get(unit.name) === unit) this.units.delete(unit.name)
    }
  }

  unregister(name: string): boolean {
    return this.units.delete(name)
  }

  get(name: string): SkillUnit | undefined {
    return this.units.get(name)
  }

  has(name: string): boolean {
    return this.units.has(name)
  }

  list(): readonly string[] {
    return [...this.units.keys()].sort()
  }
}

export class SkillAdapterRegistry {
  private readonly adapters = new Map<string, SkillAdapter>()

  register<Input, Output>(
    adapter: SkillAdapter<Input, Output>,
    options: SkillRegisterOptions = {}
  ): () => void {
    assertName(adapter.name, 'Adapter')
    if (this.adapters.has(adapter.name) && !options.override) {
      throw new SkillRegistrationError(`Adapter "${adapter.name}" is already registered`)
    }
    this.adapters.set(adapter.name, adapter as SkillAdapter)
    return () => {
      if (this.adapters.get(adapter.name) === adapter) this.adapters.delete(adapter.name)
    }
  }

  get(name: string): SkillAdapter | undefined {
    return this.adapters.get(name)
  }
}

