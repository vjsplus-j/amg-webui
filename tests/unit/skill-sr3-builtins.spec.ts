import { describe, expect, it, vi } from 'vitest'
import {
  OFFICIAL_BUILTIN_NAMES,
  createPipelineDebugger,
  createSkillInspector,
  createSkillPipeline,
  createSkillPipelineExecutor,
  createSkillRuntime,
  createSkillTelemetryBridge,
  registerOfficialBuiltins,
  type TableSearchResult
} from '@amg-webui/skill/core'

describe('Skill SR3 built-ins', () => {
  it('registers all five official built-ins', () => {
    const runtime = createSkillRuntime()
    const names = registerOfficialBuiltins(runtime)
    expect(names).toEqual([...OFFICIAL_BUILTIN_NAMES])
    expect(OFFICIAL_BUILTIN_NAMES).toEqual([
      'table-search',
      'dict-mapping',
      'form-submit',
      'table-export',
      'request-wrapper'
    ])
    for (const name of OFFICIAL_BUILTIN_NAMES) {
      expect(runtime.has(name)).toBe(true)
    }
  })

  it('table-search uses adapter and returns paged result', async () => {
    const runtime = createSkillRuntime()
    registerOfficialBuiltins(runtime)
    runtime.registerAdapter({
      name: 'search',
      async execute(input: { keyword?: string; page: number; pageSize: number }) {
        return {
          list: [{ id: 1, name: input.keyword }],
          total: 1,
          page: input.page,
          pageSize: input.pageSize
        }
      }
    })
    const handle = runtime.mount('table-search', {
      keyword: 'alice',
      page: 1,
      pageSize: 10
    })
    const result = (await handle.ready) as TableSearchResult
    expect(result.list).toEqual([{ id: 1, name: 'alice' }])
    expect(result.total).toBe(1)
    expect(result.keyword).toBe('alice')
    await handle.dispose()
  })

  it('dict-mapping maps codes to labels', async () => {
    const runtime = createSkillRuntime()
    registerOfficialBuiltins(runtime)
    runtime.registerAdapter({
      name: 'dict',
      async execute() {
        return { map: { active: '启用', inactive: '停用' } }
      }
    })
    const handle = runtime.mount('dict-mapping', {
      dict: 'user.status',
      values: ['active', 'inactive', 'unknown']
    })
    const result = await handle.ready
    expect(result.map.active).toBe('启用')
    expect(result.labels).toEqual(['启用', '停用', 'unknown'])
    await handle.dispose()
  })

  it('form-submit validates and submits via adapter', async () => {
    const runtime = createSkillRuntime()
    registerOfficialBuiltins(runtime)
    runtime.registerAdapter({
      name: 'submit',
      async execute(input: { values: Record<string, unknown> }) {
        return { ok: true, id: 'row-1', values: input.values }
      }
    })
    const handle = runtime.mount('form-submit', {
      values: { name: 'n1' }
    })
    await expect(handle.ready).resolves.toMatchObject({
      ok: true,
      id: 'row-1'
    })
    await handle.dispose()
  })

  it('table-export serializes CSV without adapter', async () => {
    const runtime = createSkillRuntime()
    registerOfficialBuiltins(runtime)
    const handle = runtime.mount('table-export', {
      rows: [
        { id: 1, name: 'a' },
        { id: 2, name: 'b,c' }
      ],
      columns: [
        { field: 'id', header: 'ID' },
        { field: 'name', header: 'Name' }
      ],
      format: 'csv',
      filename: 'users.csv'
    })
    const result = await handle.ready
    expect(result.filename).toBe('users.csv')
    expect(result.content).toContain('ID,Name')
    expect(result.content).toContain('"b,c"')
    expect(result.byteLength).toBeGreaterThan(0)
    await handle.dispose()
  })

  it('request-wrapper retries until adapter succeeds', async () => {
    const runtime = createSkillRuntime()
    registerOfficialBuiltins(runtime)
    let calls = 0
    runtime.registerAdapter({
      name: 'request',
      async execute() {
        calls += 1
        if (calls < 3) throw new Error('transient')
        return { ok: true }
      }
    })
    const handle = runtime.mount('request-wrapper', {
      input: { url: '/api' },
      maxAttempts: 3,
      delayMs: 1
    })
    const result = await handle.ready
    expect(result.data).toEqual({ ok: true })
    expect(result.attempts).toBe(3)
    await handle.dispose()
  })
})

describe('Skill SR3 DevTools', () => {
  it('inspector records skill lifecycle and pipeline debugger filters', async () => {
    const inspector = createSkillInspector({ maxEvents: 50 })
    const runtime = createSkillRuntime({ observers: [inspector.observer] })
    registerOfficialBuiltins(runtime)
    runtime.registerAdapter({
      name: 'search',
      async execute() {
        return { list: [], total: 0 }
      }
    })
    const handle = runtime.mount('table-search', { keyword: '' })
    await handle.ready
    await handle.dispose()

    const snap = inspector.getSnapshot()
    expect(snap.events.some((e) => e.kind === 'skill' && e.skillName === 'table-search')).toBe(
      true
    )

    const pipeline = createSkillPipeline({
      version: 1,
      name: 'demo',
      items: [{ type: 'skill', name: 'table-search', config: { keyword: 'x' } }]
    })
    const executor = createSkillPipelineExecutor(runtime)
    const scope = runtime.createScope('dbg')
    const pipeHandle = executor.start(pipeline, { scope })
    await pipeHandle.ready
    await pipeHandle.dispose()
    await scope.dispose()

    const dbg = createPipelineDebugger(inspector)
    expect(dbg.getTraces().length).toBeGreaterThan(0)
  })

  it('telemetry bridge forwards when enabled and stays silent when disabled', async () => {
    const track = vi.fn()
    const disabled = createSkillTelemetryBridge({ track, enabled: false })
    disabled({
      kind: 'skill',
      traceId: 't1',
      timestamp: Date.now(),
      phase: 'setup:start',
      skillName: 'table-search',
      instanceId: 'i1'
    })
    expect(track).not.toHaveBeenCalled()

    const enabled = createSkillTelemetryBridge({ track, enabled: true, appId: 'lab' })
    enabled({
      kind: 'skill',
      traceId: 't2',
      timestamp: Date.now(),
      phase: 'setup:success',
      skillName: 'table-search',
      instanceId: 'i2',
      durationMs: 12
    })
    expect(track).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'skill',
        type: 'setup:success',
        component: 'table-search'
      })
    )
  })
})
