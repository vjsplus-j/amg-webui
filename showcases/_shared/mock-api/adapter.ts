import type { MockAdapterConfig, MockRecord, MockRecordStatus } from './types'

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function createSeed(prefix: string, count = 5): MockRecord[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${prefix.toLowerCase()}-${index + 1}`,
    name: `${prefix} ${index + 1}`,
    status: (index % 2 === 0 ? 'active' : 'inactive') as MockRecordStatus,
    updatedAt: new Date(Date.now() - index * 86_400_000).toISOString()
  }))
}

/** In-memory CRUD adapter with simulated latency and fault injection. */
export class MockCrudAdapter {
  private items: MockRecord[]
  private readonly latencyMs: number
  private forceEmpty: boolean
  private forceError: boolean

  constructor(config: MockAdapterConfig = {}) {
    this.items = [...(config.seed ?? createSeed('Item'))]
    this.latencyMs = config.latencyMs ?? 450
    this.forceEmpty = config.forceEmpty ?? false
    this.forceError = config.forceError ?? false
  }

  setForceEmpty(value: boolean) {
    this.forceEmpty = value
  }

  setForceError(value: boolean) {
    this.forceError = value
  }

  async list(): Promise<MockRecord[]> {
    await delay(this.latencyMs)
    if (this.forceError) throw new Error('Mock network failure')
    if (this.forceEmpty) return []
    return [...this.items]
  }

  async create(payload: Pick<MockRecord, 'name' | 'status'>): Promise<MockRecord> {
    await delay(this.latencyMs)
    if (this.forceError) throw new Error('Mock network failure')
    const row: MockRecord = {
      id: `id-${Date.now()}`,
      name: payload.name.trim(),
      status: payload.status,
      updatedAt: new Date().toISOString()
    }
    this.items.unshift(row)
    this.forceEmpty = false
    return row
  }

  async update(
    id: string,
    payload: Partial<Pick<MockRecord, 'name' | 'status'>>
  ): Promise<MockRecord> {
    await delay(this.latencyMs)
    if (this.forceError) throw new Error('Mock network failure')
    const index = this.items.findIndex((item) => item.id === id)
    if (index < 0) throw new Error(`Record not found: ${id}`)
    const next: MockRecord = {
      ...this.items[index],
      ...payload,
      name: payload.name?.trim() ?? this.items[index].name,
      updatedAt: new Date().toISOString()
    }
    this.items[index] = next
    return next
  }

  async remove(id: string): Promise<void> {
    await delay(this.latencyMs)
    if (this.forceError) throw new Error('Mock network failure')
    this.items = this.items.filter((item) => item.id !== id)
  }
}
