# FixedLayout

FixedLayout 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 FixedLayout 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { FixedLayout } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/FixedLayout/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `"fixed" \| "absolute"` | — | — |
| `position` | `FixedLayoutPosition` | — | — |
| `offset` | `"none" \| "sm" \| "md" \| "lg"` | — | — |
| `zIndex` | `number` | — | — |
| `placeholder` | `boolean` | — | — |
| `safeArea` | `boolean` | — | — |
| `as` | `"div" \| "header" \| "footer" \| "aside" \| "nav"` | — | — |
| `role` | `string` | — | — |
| `ariaLabel` | `string` | — | — |
| `teleportTo` | `string \| HTMLElement` | — | — |

## Events

| Event | Description |
| --- | --- |
| `resize` | — |

## Slots / Expose / Models

见 `generated/component-api/FixedLayout.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/FixedLayout/a11y.json`。

## Keyboard

见 `component-hardening/evidence/FixedLayout/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/FixedLayout.json`

## Known Limitations

以 contract + evidence 为准。
