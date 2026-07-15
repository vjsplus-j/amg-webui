import type { VpTelemetryEvent } from './types'

/** Fixed-capacity FIFO ring buffer for telemetry events */
export class RingBuffer<T = VpTelemetryEvent> {
  private buf: (T | undefined)[]
  private head = 0
  private len = 0
  private _capacity: number

  constructor(capacity = 500) {
    this._capacity = Math.max(1, capacity)
    this.buf = new Array(this._capacity)
  }

  get capacity(): number {
    return this._capacity
  }

  get size(): number {
    return this.len
  }

  resize(capacity: number): void {
    const next = Math.max(1, capacity)
    if (next === this._capacity) return
    const items = this.toArray()
    this._capacity = next
    this.buf = new Array(next)
    this.head = 0
    this.len = 0
    for (const item of items.slice(-next)) {
      this.push(item)
    }
  }

  push(item: T): void {
    if (this.len < this._capacity) {
      this.buf[(this.head + this.len) % this._capacity] = item
      this.len++
      return
    }
    this.buf[this.head] = item
    this.head = (this.head + 1) % this._capacity
  }

  clear(): void {
    this.buf = new Array(this._capacity)
    this.head = 0
    this.len = 0
  }

  toArray(): T[] {
    const out: T[] = []
    for (let i = 0; i < this.len; i++) {
      const v = this.buf[(this.head + i) % this._capacity]
      if (v !== undefined) out.push(v)
    }
    return out
  }
}
