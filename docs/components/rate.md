# Rate

Rate 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 Rate 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { Rate } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/Rate/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | — | — |
| `name` | `string` | — | — |
| `modelValue` | `number` | — | — |
| `max` | `number` | — | — |
| `allowHalf` | `boolean` | — | — |
| `clearable` | `boolean` | — | — |
| `readonly` | `boolean` | — | — |
| `size` | `RateSize` | — | — |
| `showScore` | `boolean` | — | — |
| `texts` | `string[]` | — | — |
| `ariaLabel` | `string` | — | — |

## Events

| Event | Description |
| --- | --- |
| `update:modelValue` | — |
| `change` | — |
| `hoverChange` | — |
| `focus` | — |
| `blur` | — |

## Slots / Expose / Models

见 `generated/component-api/Rate.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/Rate/a11y.json`。

## Keyboard

见 `component-hardening/evidence/Rate/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/Rate.json`

## Known Limitations

以 contract + evidence 为准。
