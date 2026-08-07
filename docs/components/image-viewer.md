# ImageViewer

ImageViewer 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 ImageViewer 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { ImageViewer } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/ImageViewer/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | — | — |
| `urlList` | `string[]` | — | — |
| `initialIndex` | `number` | — | — |
| `infinite` | `boolean` | — | — |
| `zoomRate` | `number` | — | — |
| `minScale` | `number` | — | — |
| `maxScale` | `number` | — | — |
| `teleported` | `boolean` | — | — |
| `class` | `string` | — | — |
| `style` | `Record<string, string>` | — | — |

## Events

| Event | Description |
| --- | --- |
| `update:visible` | — |
| `close` | — |
| `switch` | — |

## Slots / Expose / Models

见 `generated/component-api/ImageViewer.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/ImageViewer/a11y.json`。

## Keyboard

见 `component-hardening/evidence/ImageViewer/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/ImageViewer.json`

## Known Limitations

以 contract + evidence 为准。
