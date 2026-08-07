# Drawer

Drawer 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 Drawer 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { Drawer } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/Drawer/index.vue`

## 交互演示

<DocsDemo name="drawer-basic" />

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | — | — |
| `title` | `string` | — | — |
| `placement` | `DrawerPlacement` | — | — |
| `width` | `string` | — | — |
| `height` | `string` | — | — |
| `modal` | `boolean` | — | — |
| `closable` | `boolean` | — | — |
| `dismissible` | `boolean` | — | — |
| `closeOnClickOverlay` | `boolean` | — | — |
| `closeOnPressEscape` | `boolean` | — | — |
| `lockScroll` | `boolean` | — | — |
| `loading` | `boolean` | — | — |
| `zIndex` | `number` | — | — |
| `teleportTo` | `string \| HTMLElement` | — | — |
| `ariaLabel` | `string` | — | — |
| `beforeClose` | `( reason: DrawerCloseReason, event?: Event, ) => boolean \| Promise<boolean>` | — | — |
| `trackId` | `string` | — | — |
| `telemetry` | `boolean` | — | — |

## Events

| Event | Description |
| --- | --- |
| `update:visible` | — |
| `show` | — |
| `hide` | — |
| `open` | — |
| `closed` | — |
| `close` | — |
| `error` | — |

## Slots / Expose / Models

见 `generated/component-api/Drawer.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/Drawer/a11y.json`。

## Keyboard

见 `component-hardening/evidence/Drawer/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/Drawer.json`

## Known Limitations

以 contract + evidence 为准。
