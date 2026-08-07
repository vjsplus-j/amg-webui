# Block

Block 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 Block 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { Block } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/Block/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `display` | `BlockDisplay` | — | — |
| `padding` | `BlockPadding` | — | — |
| `padded` | `boolean` | — | — |
| `bordered` | `boolean` | — | — |
| `gap` | `BlockGap` | — | — |
| `margin` | `BlockMargin` | — | — |
| `bg` | `BlockBg` | — | — |
| `fullBleed` | `boolean` | — | — |
| `radius` | `BlockRadius` | — | — |
| `raised` | `boolean` | — | — |

## Events

| Event | Description |
| --- | --- |
| — | See generated API |

## Slots / Expose / Models

见 `generated/component-api/Block.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/Block/a11y.json`。

## Keyboard

见 `component-hardening/evidence/Block/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/Block.json`

## Known Limitations

以 contract + evidence 为准。
