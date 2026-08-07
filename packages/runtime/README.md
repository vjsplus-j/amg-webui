# `@amg-webui/runtime` — UI Overlay kernel

Framework-free overlay stack for Dialog / Drawer / Popover and friends.

Public import: `amg-webui/runtime` (dev alias `@amg-webui/runtime`).

See [`docs/OVERLAY.md`](../../docs/OVERLAY.md).

```ts
import {
  createOverlayRuntime,
  getDefaultOverlayRuntime,
  configureDefaultOverlayRuntime
} from 'amg-webui/runtime'
```

Vue apps should prefer `useOverlay` from `amg-webui/hooks`.
