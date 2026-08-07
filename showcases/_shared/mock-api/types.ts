export type MockRecordStatus = 'active' | 'inactive'

export interface MockRecord {
  id: string
  name: string
  status: MockRecordStatus
  updatedAt: string
}

export type FetchPhase = 'idle' | 'loading' | 'empty' | 'error' | 'ready'

export interface MockAdapterConfig {
  seed?: MockRecord[]
  latencyMs?: number
  forceEmpty?: boolean
  forceError?: boolean
}
