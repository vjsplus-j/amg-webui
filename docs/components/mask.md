# Mask

Mask 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 Mask 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { Mask } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/Mask/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | — | — |
| `dismissible` | `boolean` | — | — |
| `zIndex` | `number` | — | — |
| `lockScroll` | `boolean` | — | — |
| `trapFocus` | `boolean` | — | — |
| `centered` | `boolean` | — | — |
| `blur` | `boolean` | — | — |
| `teleportTo` | `string \| HTMLElement` | — | — |
| `ariaLabel` | `string` | — | — |
| `closeOnPressEscape` | `boolean` | — | — |
| `beforeClose` | `( reason: MaskCloseReason, event?: Event, ) => boolean \| Promise<boolean>` | — | — |
| `trackId` | `string` | — | — |
| `telemetry` | `boolean` | — | — |

## Events

| Event | Description |
| --- | --- |
| `update:visible` | — |
| `close` | — |
| `open` | — |
| `closed` | — |
| `error` | — |

## Slots / Expose / Models

见 `generated/component-api/Mask.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/Mask/a11y.json`。

## Keyboard

见 `component-hardening/evidence/Mask/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/Mask.json`

## Known Limitations

以 contract + evidence 为准。
