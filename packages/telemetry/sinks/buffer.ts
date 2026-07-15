import type { TelemetrySink, VpTelemetryEvent } from '../types'
import { RingBuffer } from '../ringBuffer'

/**
 * Sink that writes into a RingBuffer (standalone or shared).
 * Prefer TelemetryService.getBuffer() for the primary in-memory stream.
 */
export function bufferSink(
  buffer?: RingBuffer
): TelemetrySink & { buffer: RingBuffer } {
  const buf = buffer ?? new RingBuffer()
  return {
    name: 'buffer',
    buffer: buf,
    write(event: VpTelemetryEvent) {
      buf.push(event)
    }
  }
}
