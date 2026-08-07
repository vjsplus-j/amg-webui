/** Pointer shim — SSOT lives in `packages/demos/registry.ts`. */
export {
  sharedDemoRegistry,
  sharedDemoIds,
  docsDemoRegistry,
  type SharedDemoEntry,
  type SharedDemoId,
  type DocsDemoId
} from '@amg-webui/demos/registry'

export type { SharedDemoEntry as DocsDemoEntry } from '@amg-webui/demos/registry'
