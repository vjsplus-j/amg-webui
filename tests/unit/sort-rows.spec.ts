import { afterEach, describe, expect, it } from 'vitest'
import {
  SORT_WORKER_THRESHOLD,
  disposeSortWorker,
  sortRowsAsync,
  sortRowsSync
} from '@amg-webui/utils/data-display/sortRows'

describe('sortRowsAsync', () => {
  afterEach(() => {
    disposeSortWorker()
  })

  it('delegates to sync sort below the worker threshold', async () => {
    const rows = [
      { id: 3, name: 'c' },
      { id: 1, name: 'a' },
      { id: 2, name: 'b' }
    ]
    const sorted = await sortRowsAsync(rows, 'id', 'asc', SORT_WORKER_THRESHOLD)
    expect(sorted.map((r) => r.id)).toEqual([1, 2, 3])
    expect(sorted).toEqual(sortRowsSync(rows, 'id', 'asc'))
  })

  it('sorts at or above a lowered threshold (worker or sync fallback)', async () => {
    const rows = Array.from({ length: 120 }, (_, i) => ({ id: 120 - i, tag: `r${i}` }))
    const sorted = await sortRowsAsync(rows, 'id', 'asc', 50)
    expect(sorted[0]?.id).toBe(1)
    expect(sorted.at(-1)?.id).toBe(120)
  })

  it('disposeSortWorker clears worker state and allows a fresh sort', async () => {
    const rows = Array.from({ length: 80 }, (_, i) => ({ id: 80 - i }))
    const pending = sortRowsAsync(rows, 'id', 'asc', 10)
    disposeSortWorker()
    // Worker env: pending rejects with disposed/failed.
    // No Worker (jsdom / SSR): falls back to sync resolve — both are valid.
    await Promise.race([
      pending.then(
        () => undefined,
        (err: unknown) => {
          expect(String(err)).toMatch(/disposed|failed/i)
        }
      ),
      new Promise((resolve) => setTimeout(resolve, 500))
    ])

    const sorted = await sortRowsAsync(
      [
        { id: 2 },
        { id: 1 }
      ],
      'id',
      'asc'
    )
    expect(sorted.map((r) => r.id)).toEqual([1, 2])
  })
})
