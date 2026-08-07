# DataCard

DataCard 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 DataCard 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { DataCard } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/DataCard/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | — |
| `description` | `string` | — | — |
| `value` | `DataCardValue` | — | — |
| `data` | `DataCardValue` | — | — |
| `prefix` | `string` | — | — |
| `suffix` | `string` | — | — |
| `formatter` | `(value: DataCardValue) => string` | — | — |
| `trend` | `number` | — | — |
| `trendType` | `DataCardTrend` | — | — |
| `trendLabel` | `string` | — | — |
| `status` | `Severity` | — | — |
| `icon` | `string` | — | — |
| `loading` | `boolean` | — | — |
| `disabled` | `boolean` | — | — |
| `clickable` | `boolean` | — | — |
| `selected` | `boolean` | — | — |
| `progress` | `number` | — | — |

## Events

| Event | Description |
| --- | --- |
| `update:selected` | — |
| `change` | — |
| `click` | — |

## Slots / Expose / Models

见 `generated/component-api/DataCard.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/DataCard/a11y.json`。

## Keyboard

见 `component-hardening/evidence/DataCard/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/DataCard.json`

## Known Limitations

以 contract + evidence 为准。
