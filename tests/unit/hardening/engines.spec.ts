import { describe, expect, it } from 'vitest'
import {
  createFieldId,
  resolveClearValue,
  useSelectionModel,
  resolveKeyboardNavAction,
  moveRovingIndex,
  toDate,
  clampDate,
  formatDateValue,
  createFeedbackQueue,
  createMockMediaAdapter,
  useUploadEngine
} from '@amg-webui/utils'
import { ref } from 'vue'

describe('hardening engines', () => {
  it('formControl createFieldId and clear value', () => {
    expect(createFieldId('x')).toMatch(/^x-/)
    expect(resolveClearValue(true)).toEqual([])
    expect(resolveClearValue(false)).toBeUndefined()
  })

  it('selection model select/clear', () => {
    const modelValue = ref<string | undefined>('a')
    const emitted: unknown[] = []
    const api = useSelectionModel({
      multiple: false,
      modelValue,
      emitChange: (v) => {
        emitted.push(v)
        modelValue.value = v as string | undefined
      }
    })
    api.select('b')
    expect(emitted.at(-1)).toBe('b')
    api.clear()
    expect(emitted.at(-1)).toBeUndefined()
  })

  it('keyboard nav actions and roving index', () => {
    const down = resolveKeyboardNavAction({ key: 'ArrowDown' } as KeyboardEvent)
    expect(down).toBe('next')
    expect(moveRovingIndex(0, 'next', 3, true)).toBe(1)
    expect(moveRovingIndex(2, 'next', 3, true)).toBe(0)
  })

  it('datetime clamp', () => {
    const d = toDate('2024-06-15')
    expect(d).toBeInstanceOf(Date)
    const clamped = clampDate('2024-01-01', '2024-06-01', '2024-12-01')
    expect(formatDateValue(clamped, 'date')).toBe('2024-06-01')
  })

  it('feedback queue push/remove', () => {
    const q = createFeedbackQueue(2)
    q.push({ type: 'toast', content: 'a', duration: 0 })
    q.push({ type: 'toast', content: 'b', duration: 0 })
    q.push({ type: 'toast', content: 'c', duration: 0 })
    expect(q.items.value).toHaveLength(2)
    q.dispose()
    expect(q.items.value).toHaveLength(0)
  })

  it('media mock adapter lifecycle', async () => {
    const states: string[] = []
    const adapter = createMockMediaAdapter({ onState: (s) => states.push(s) })
    await adapter.connect()
    expect(adapter.state).toBe('ready')
    adapter.destroy()
    expect(adapter.state).toBe('destroyed')
    expect(states).toContain('ready')
  })

  it('upload engine queue abort', async () => {
    const engine = useUploadEngine({
      concurrency: 1,
      autoUpload: false,
      request: async (_f, signal) => {
        await new Promise((r, j) => {
          signal.addEventListener('abort', () => j(new Error('aborted')))
          setTimeout(r, 50)
        })
      }
    })
    const file = new File(['x'], 'a.txt')
    engine.addFiles([file])
    expect(engine.queue.value[0]?.status).toBe('queued')
    engine.abortAll()
    engine.clear()
    expect(engine.queue.value).toHaveLength(0)
  })
})
