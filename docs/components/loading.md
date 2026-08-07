# Loading

Loading 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 Loading 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { Loading } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/Loading/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `visible` | `boolean` | — | — |
| `text` | `string` | — | — |
| `fullscreen` | `boolean` | — | — |
| `size` | `LoadingSize` | — | — |
| `indicator` | `LoadingIndicator` | — | — |
| `lockScroll` | `boolean` | — | — |
| `backdrop` | `boolean` | — | — |
| `delay` | `number` | — | — |
| `progress` | `number` | — | — |
| `cancellable` | `boolean` | — | — |
| `cancelText` | `string` | — | — |
| `zIndex` | `number` | — | — |
| `live` | `"polite" \| "assertive" \| "off"` | — | — |

## Events

| Event | Description |
| --- | --- |
| `update:visible` | — |
| `visibleChange` | — |
| `cancel` | — |
| `after-enter` | — |
| `after-leave` | — |

## Slots / Expose / Models

见 `generated/component-api/Loading.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/Loading/a11y.json`。

## Keyboard

见 `component-hardening/evidence/Loading/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/Loading.json`

## Known Limitations

以 contract + evidence 为准。
