# Card

Card 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 Card 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { Card } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/Card/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `header` | `string` | — | — |
| `footer` | `string` | — | — |
| `title` | `string` | — | — |
| `subTitle` | `string` | — | — |
| `subtitle` | `string` | — | — |
| `raised` | `boolean` | — | — |
| `hover` | `boolean` | — | — |
| `hoverable` | `boolean` | — | — |
| `selected` | `boolean` | — | — |
| `selectable` | `boolean` | — | — |
| `bordered` | `boolean` | — | — |
| `loading` | `boolean` | — | — |
| `skeleton` | `CardSkeleton` | — | — |

## Events

| Event | Description |
| --- | --- |
| `click` | — |
| `update:selected` | — |

## Slots / Expose / Models

见 `generated/component-api/Card.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/Card/a11y.json`。

## Keyboard

见 `component-hardening/evidence/Card/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/Card.json`

## Known Limitations

以 contract + evidence 为准。
