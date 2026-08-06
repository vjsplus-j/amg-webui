import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import {
  AmgSkillScope,
  SkillAbortError,
  SkillRuntimeError,
  createSkillConsoleObserver,
  createSkillPipeline,
  createSkillPipelineExecutor,
  createSkillPlugin,
  createSkillRuntime,
  defineSkill,
  useSkillScope
} from '@amg-webui/skill'

function deferred<T>(): {
  promise: Promise<T>
  resolve(value: T): void
  reject(reason?: unknown): void
} {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((nextResolve, nextReject) => {
    resolve = nextResolve
    reject = nextReject
  })
  return { promise, resolve, reject }
}

describe('Skill Runtime core', () => {
  it('isolates instance state and shares only the explicit scope bus', async () => {
    let sequence = 0
    const runtime = createSkillRuntime({ idFactory: (prefix) => `${prefix}-${++sequence}` })
    const teardown = vi.fn()
    runtime.register(
      defineSkill<{ value: number }, number>({
        name: 'counter',
        setup(ctx, config) {
          ctx.state.value = config.value
          ctx.on<number>('increment', (amount) => {
            ctx.state.value = Number(ctx.state.value) + amount
          })
          return Number(ctx.state.value)
        },
        teardown
      })
    )

    const scope = runtime.createScope('shared')
    const first = scope.mount<{ value: number }, number>('counter', { value: 1 })
    const second = scope.mount<{ value: number }, number>('counter', { value: 10 })

    await Promise.all([first.ready, second.ready])
    expect(first.id).not.toBe(second.id)
    expect(first.context.state).not.toBe(second.context.state)
    scope.emit('increment', 2)
    expect(first.context.state.value).toBe(3)
    expect(second.context.state.value).toBe(12)

    await scope.dispose()
    expect(teardown).toHaveBeenCalledTimes(2)
    expect(first.phase).toBe('disposed')
    expect(second.phase).toBe('disposed')
  })

  it('makes early async disposal idempotent and instance-owned', async () => {
    const gate = deferred<string>()
    const teardown = vi.fn()
    const observer = vi.fn()
    const runtime = createSkillRuntime({ observers: [observer] })
    runtime.register(
      defineSkill<void, string>({
        name: 'slow',
        setup: () => gate.promise,
        teardown
      })
    )

    const handle = runtime.mount<void, string>('slow', undefined)
    const firstDispose = handle.dispose()
    const secondDispose = handle.dispose()
    gate.resolve('ready')
    await expect(handle.ready).rejects.toThrow(SkillAbortError)
    await Promise.all([firstDispose, secondDispose])

    expect(teardown).toHaveBeenCalledTimes(1)
    expect(handle.phase).toBe('disposed')
    expect(handle.output).toBeUndefined()
    expect(handle.context.signal.aborted).toBe(true)
    expect(
      observer.mock.calls.some(([event]) => event.phase === 'setup:success')
    ).toBe(false)
  })

  it('surfaces teardown errors when early disposal wins the setup race', async () => {
    const gate = deferred<string>()
    const runtime = createSkillRuntime()
    runtime.register(
      defineSkill<void, string>({
        name: 'slow-cleanup-error',
        setup: () => gate.promise,
        teardown() {
          throw new Error('late cleanup failed')
        }
      })
    )

    const handle = runtime.mount<void, string>('slow-cleanup-error', undefined)
    const disposal = handle.dispose()
    gate.resolve('late-output')

    await expect(handle.ready).rejects.toThrow(SkillAbortError)
    await expect(disposal).rejects.toThrow('late cleanup failed')
    expect(handle.output).toBeUndefined()
    expect(handle.phase).toBe('disposed')
    await expect(handle.dispose()).resolves.toBeUndefined()
  })

  it('owns request cancellation, retry and named adapters per context', async () => {
    const aborted = vi.fn()
    let adapterSignal: AbortSignal | undefined
    const runtime = createSkillRuntime()
    runtime.registerAdapter({
      name: 'double',
      execute(input: number, context) {
        adapterSignal = context.signal
        return input * 2
      }
    })
    runtime.register(
      defineSkill<number, number>({
        name: 'request-wrapper',
        async setup(ctx, value) {
          const controller = ctx.utils.createAbortController()
          controller.signal.addEventListener('abort', aborted, { once: true })
          const result = await ctx.utils.retry(
            (attempt) => {
              if (attempt < 2) throw new Error('retry')
              return ctx.useAdapter<number, number>('double', value)
            },
            { maxAttempts: 2 }
          )
          return result
        },
        teardown(ctx) {
          ctx.utils.cancelAllRequests()
        }
      })
    )

    const handle = runtime.mount<number, number>('request-wrapper', 4)
    await expect(handle.ready).resolves.toBe(8)
    expect(adapterSignal).toBe(handle.context.signal)
    await handle.dispose()
    expect(adapterSignal?.aborted).toBe(true)
    expect(aborted).toHaveBeenCalledOnce()
  })

  it('reports setup failures without allowing onError to replace the cause', async () => {
    const runtime = createSkillRuntime()
    const onError = vi.fn(() => {
      throw new Error('secondary')
    })
    runtime.register(
      defineSkill<void, void>({
        name: 'broken',
        setup() {
          throw new Error('primary')
        },
        teardown() {},
        onError
      })
    )

    const handle = runtime.mount<void, void>('broken', undefined)
    await expect(handle.ready).rejects.toThrow('primary')
    expect(onError).toHaveBeenCalledOnce()
    expect(handle.phase).toBe('disposed')
  })

  it('rejects accidental overrides and isolates observer failures', async () => {
    const observer = vi.fn(() => {
      throw new Error('observer must stay side-channel')
    })
    const runtime = createSkillRuntime({ observers: [observer] })
    const unit = defineSkill<void, string>({
      name: 'stable',
      setup: () => 'ok',
      teardown() {}
    })
    runtime.register(unit)
    expect(() => runtime.register(unit)).toThrow('already registered')

    const handle = runtime.mount<void, string>('stable', undefined, { instanceId: 'stable-1' })
    expect(() =>
      runtime.mount<void, string>('stable', undefined, { instanceId: 'stable-1' })
    ).toThrow('already active')
    await expect(handle.ready).resolves.toBe('ok')
    await expect(handle.dispose()).resolves.toBeUndefined()
    expect(observer).toHaveBeenCalled()
  })

  it('keeps raw error details out of console observation unless explicitly enabled', async () => {
    const logger = { debug: vi.fn(), error: vi.fn() }
    const runtime = createSkillRuntime({
      observers: [createSkillConsoleObserver({ logger })]
    })
    runtime.register(
      defineSkill<{ secret: string }, void>({
        name: 'redacted',
        setup(_ctx, config) {
          throw new Error(`sensitive:${config.secret}`)
        },
        teardown() {}
      })
    )

    const handle = runtime.mount('redacted', { secret: 'TOKEN_SENTINEL' })
    await expect(handle.ready).rejects.toThrow('TOKEN_SENTINEL')
    expect(JSON.stringify(logger.error.mock.calls)).not.toContain('TOKEN_SENTINEL')
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('[AMG Skill] redacted#')
    )
  })

  it('keeps nested scopes independent and surfaces teardown errors once', async () => {
    const runtime = createSkillRuntime()
    const teardown = vi.fn(() => {
      throw new Error('cleanup failed')
    })
    runtime.register(
      defineSkill<void, void>({ name: 'cleanup', setup() {}, teardown })
    )
    const outer = runtime.createScope('outer')
    const inner = runtime.createScope('inner')
    outer.state.value = 'outer'
    inner.state.value = 'inner'
    expect(outer.state).not.toBe(inner.state)

    const handle = outer.mount<void, void>('cleanup', undefined)
    await handle.ready
    await expect(handle.dispose()).rejects.toThrow('cleanup failed')
    await expect(handle.dispose()).resolves.toBeUndefined()
    expect(teardown).toHaveBeenCalledOnce()
    await expect(outer.dispose()).resolves.toBeUndefined()
    await inner.dispose()
  })
})

describe('Skill Pipeline JSON v1', () => {
  it('runs sequence, parallel, named conditions, retry and fallback without eval', async () => {
    const observer = vi.fn()
    const runtime = createSkillRuntime({ observers: [observer] })
    const attempts = new Map<string, number>()
    const disposed: string[] = []
    runtime.register(
      defineSkill<{ id: string; failUntil?: number }, string>({
        name: 'step',
        setup(_ctx, config) {
          const attempt = (attempts.get(config.id) ?? 0) + 1
          attempts.set(config.id, attempt)
          if (attempt <= (config.failUntil ?? 0)) throw new Error(`failed:${config.id}`)
          return `${config.id}:${attempt}`
        },
        teardown(ctx) {
          disposed.push(ctx.instanceId)
        }
      })
    )

    const definition = createSkillPipeline({
      version: 1,
      name: 'search-flow',
      items: [
        { type: 'skill', id: 'first', name: 'step', config: { id: 'first' } },
        {
          type: 'parallel',
          items: [
            { type: 'skill', id: 'left', name: 'step', config: { id: 'left' } },
            { type: 'skill', id: 'right', name: 'step', config: { id: 'right' } }
          ]
        },
        {
          type: 'if',
          condition: 'use-retry',
          then: [
            {
              type: 'retry',
              max: 2,
              item: {
                type: 'skill',
                id: 'retried',
                name: 'step',
                config: { id: 'retried', failUntil: 1 }
              }
            }
          ]
        },
        {
          type: 'fallback',
          item: {
            type: 'skill',
            name: 'step',
            config: { id: 'primary', failUntil: 2 }
          },
          fallback: {
            type: 'skill',
            id: 'degraded',
            name: 'step',
            config: { id: 'degraded' }
          }
        }
      ]
    })
    const executor = createSkillPipelineExecutor(runtime)
    executor.registerCondition('use-retry', ({ outputs }) => outputs.first === 'first:1')

    const pipeline = executor.start(definition)
    const result = await pipeline.ready
    expect(result.outputs).toMatchObject({
      first: 'first:1',
      left: 'left:1',
      right: 'right:1',
      retried: 'retried:2',
      degraded: 'degraded:1'
    })
    expect(attempts.get('primary')).toBe(1)
    await pipeline.dispose()
    expect(pipeline.phase).toBe('disposed')
    expect(disposed.length).toBeGreaterThanOrEqual(7)
    const pipelinePhases = observer.mock.calls
      .map(([event]) => event)
      .filter((event) => event.kind === 'pipeline')
      .map((event) => event.phase)
    expect(pipelinePhases).toEqual([
      'pipeline:start',
      'pipeline:success',
      'pipeline:disposed'
    ])
  })

  it('rejects executable or non-JSON pipeline configuration', () => {
    expect(() =>
      createSkillPipeline({
        version: 1,
        items: [
          {
            type: 'skill',
            name: 'unsafe',
            config: { callback: (() => undefined) as unknown as string }
          }
        ]
      })
    ).toThrow(SkillRuntimeError)

    expect(() =>
      createSkillPipeline({
        version: 1,
        items: [],
        unsafe: () => undefined
      } as unknown as Parameters<typeof createSkillPipeline>[0])
    ).toThrow(SkillRuntimeError)
  })

  it('requires registered condition names', async () => {
    const runtime = createSkillRuntime()
    const executor = createSkillPipelineExecutor(runtime)
    const run = executor.start({
      version: 1,
      items: [{ type: 'if', condition: 'window.eval', then: [] }]
    })
    await expect(run.ready).rejects.toThrow('never eval')
  })

  it('does not route registry or configuration failures through fallback', async () => {
    const recovered = vi.fn()
    const runtime = createSkillRuntime()
    runtime.register(
      defineSkill<void, void>({
        name: 'recovery',
        setup: recovered,
        teardown() {}
      })
    )
    const run = createSkillPipelineExecutor(runtime).start({
      version: 1,
      items: [
        {
          type: 'fallback',
          item: { type: 'skill', name: 'missing-registration' },
          fallback: { type: 'skill', name: 'recovery' }
        }
      ]
    })

    await expect(run.ready).rejects.toThrow('Unknown skill')
    expect(recovered).not.toHaveBeenCalled()
  })

  it('keeps earlier sequence handles alive while retrying a failed parallel node', async () => {
    const stableTeardown = vi.fn()
    const branchTeardown = vi.fn()
    let attempts = 0
    const runtime = createSkillRuntime()
    runtime.register(
      defineSkill<void, string>({
        name: 'stable-before-parallel',
        setup: () => 'stable',
        teardown: stableTeardown
      })
    )
    runtime.register(
      defineSkill<{ flaky?: boolean }, string>({
        name: 'parallel-branch',
        setup(_ctx, config) {
          if (config.flaky && ++attempts === 1) throw new Error('retry parallel')
          return config.flaky ? 'flaky-ok' : 'sibling-ok'
        },
        teardown: branchTeardown
      })
    )

    const run = createSkillPipelineExecutor(runtime).start({
      version: 1,
      items: [
        { type: 'skill', id: 'stable', name: 'stable-before-parallel' },
        {
          type: 'retry',
          max: 2,
          item: {
            type: 'parallel',
            items: [
              { type: 'skill', id: 'flaky', name: 'parallel-branch', config: { flaky: true } },
              { type: 'skill', id: 'sibling', name: 'parallel-branch', config: {} }
            ]
          }
        }
      ]
    })

    await expect(run.ready).resolves.toMatchObject({
      outputs: { stable: 'stable', flaky: 'flaky-ok', sibling: 'sibling-ok' }
    })
    expect(stableTeardown).not.toHaveBeenCalled()
    await run.dispose()
    expect(stableTeardown).toHaveBeenCalledOnce()
    expect(branchTeardown).toHaveBeenCalledTimes(4)
  })

  it('cancels an in-flight pipeline through its owned scope', async () => {
    const runtime = createSkillRuntime()
    runtime.register(
      defineSkill<void, void>({
        name: 'pending',
        setup(ctx) {
          return new Promise<void>((_resolve, reject) => {
            ctx.signal.addEventListener(
              'abort',
              () => reject(new SkillAbortError()),
              { once: true }
            )
          })
        },
        teardown() {}
      })
    )
    const run = createSkillPipelineExecutor(runtime).start({
      version: 1,
      items: [{ type: 'skill', name: 'pending' }]
    })
    await Promise.resolve()
    await run.dispose()
    await expect(run.ready).rejects.toThrow(SkillAbortError)
    expect(run.phase).toBe('disposed')
  })

  it('finishes the pipeline lifecycle even when disposal reports cleanup errors', async () => {
    const runtime = createSkillRuntime()
    runtime.register(
      defineSkill<void, void>({
        name: 'pipeline-cleanup-error',
        setup() {},
        teardown() {
          throw new Error('pipeline cleanup failed')
        }
      })
    )
    const run = createSkillPipelineExecutor(runtime).start({
      version: 1,
      items: [{ type: 'skill', name: 'pipeline-cleanup-error' }]
    })

    await run.ready
    await expect(run.dispose()).rejects.toThrow('failed to dispose')
    expect(run.phase).toBe('disposed')
    await expect(run.dispose()).resolves.toBeUndefined()
  })
})

describe('Skill Runtime Vue adapter', () => {
  it('mounts and tears down v-skill with an explicit host bridge', async () => {
    const runtime = createSkillRuntime()
    const hosts: object[] = []
    const hostBridge = { focus: vi.fn() }
    const teardown = vi.fn()
    runtime.register(
      defineSkill<void, void>({
        name: 'dom-skill',
        setup(ctx) {
          if (ctx.host) hosts.push(ctx.host)
        },
        teardown
      })
    )
    const App = defineComponent({
      setup: () => ({ binding: { name: 'dom-skill', host: hostBridge } }),
      template: '<button v-skill="binding">host</button>'
    })
    const wrapper = mount(App, { global: { plugins: [createSkillPlugin({ runtime })] } })
    await flushPromises()
    expect(hosts[0]).toBe(hostBridge)
    wrapper.unmount()
    await flushPromises()
    expect(teardown).toHaveBeenCalledOnce()
  })

  it('provides an isolated scope to descendants', async () => {
    const runtime = createSkillRuntime()
    const scopeIds: string[] = []
    const teardown = vi.fn()
    runtime.register(
      defineSkill<void, void>({
        name: 'scoped',
        setup(ctx) {
          if (ctx.scope) scopeIds.push(ctx.scope.id)
        },
        teardown
      })
    )
    const Child = defineComponent({
      setup() {
        const scope = useSkillScope()
        scope?.mount<void, void>('scoped', undefined)
        return () => null
      }
    })
    const Root = defineComponent({
      components: { AmgSkillScope, Child },
      template: '<AmgSkillScope scope-id="page"><Child /></AmgSkillScope>'
    })

    const wrapper = mount(Root, { global: { plugins: [createSkillPlugin({ runtime })] } })
    await flushPromises()
    expect(scopeIds).toEqual(['page'])
    wrapper.unmount()
    await flushPromises()
    expect(teardown).toHaveBeenCalledOnce()
  })

  it('keeps nested AmgSkillScope state and disposal independent', async () => {
    const runtime = createSkillRuntime()
    const scopes = new Map<string, ReturnType<typeof runtime.createScope>>()
    const disposedScopes: string[] = []
    runtime.register(
      defineSkill<string, void>({
        name: 'nested-scope-probe',
        setup(ctx, label) {
          ctx.state.label = label
        },
        teardown(ctx) {
          disposedScopes.push(ctx.scope?.id ?? 'missing')
        }
      })
    )
    const Probe = defineComponent({
      props: { label: { type: String, required: true } },
      setup(props) {
        const scope = useSkillScope()!
        scope.state.label = props.label
        scopes.set(props.label, scope)
        scope.mount<string, void>('nested-scope-probe', props.label)
        return () => null
      }
    })
    const showInner = ref(true)
    const Root = defineComponent({
      components: { AmgSkillScope, Probe },
      setup: () => ({ showInner }),
      template: `
        <AmgSkillScope scope-id="outer">
          <Probe label="outer" />
          <AmgSkillScope v-if="showInner" scope-id="inner">
            <Probe label="inner" />
          </AmgSkillScope>
        </AmgSkillScope>
      `
    })

    const wrapper = mount(Root, { global: { plugins: [createSkillPlugin({ runtime })] } })
    await flushPromises()
    expect(scopes.get('outer')?.id).toBe('outer')
    expect(scopes.get('inner')?.id).toBe('inner')
    expect(scopes.get('outer')?.state.label).toBe('outer')
    expect(scopes.get('inner')?.state.label).toBe('inner')

    showInner.value = false
    await nextTick()
    await flushPromises()
    expect(disposedScopes).toEqual(['inner'])
    expect(scopes.get('outer')?.disposed).toBe(false)
    expect(scopes.get('outer')?.state.label).toBe('outer')

    wrapper.unmount()
    await flushPromises()
    expect(disposedScopes).toEqual(['inner', 'outer'])
  })

  it('rebinds v-skill after the binding identity changes', async () => {
    const runtime = createSkillRuntime()
    const setup = vi.fn()
    const teardown = vi.fn()
    runtime.register(
      defineSkill<{ value: number }, void>({
        name: 'rebind',
        setup(_ctx, config) {
          setup(config.value)
        },
        teardown
      })
    )
    const binding = ref({ name: 'rebind', config: { value: 1 } })
    const App = defineComponent({
      setup: () => ({ binding }),
      template: '<div v-skill="binding" />'
    })
    const wrapper = mount(App, { global: { plugins: [createSkillPlugin({ runtime })] } })
    await flushPromises()
    binding.value = { name: 'rebind', config: { value: 2 } }
    await nextTick()
    await flushPromises()
    expect(setup).toHaveBeenNthCalledWith(1, 1)
    expect(setup).toHaveBeenNthCalledWith(2, 2)
    expect(teardown).toHaveBeenCalledTimes(1)
    wrapper.unmount()
    await flushPromises()
    expect(teardown).toHaveBeenCalledTimes(2)
  })

  it('keeps core import SSR-safe', async () => {
    await expect(import('@amg-webui/skill/core')).resolves.toHaveProperty('createSkillRuntime')
    expect(new SkillAbortError()).toBeInstanceOf(Error)
  })
})
