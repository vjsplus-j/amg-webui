# PivotTable

PivotTable 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 PivotTable 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { PivotTable } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/PivotTable/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | — |
| `description` | `string` | — | — |
| `data` | `PivotRecord[]` | — | — |
| `rows` | `PivotRecord[]` | — | — |
| `rowField` | `string` | — | — |
| `columnField` | `string` | — | — |
| `colField` | `string` | — | — |
| `valueField` | `string` | — | — |
| `valueFormatter` | `(value: number, cell?: PivotCell) => string` | — | — |
| `modelValue` | `string \| null` | — | — |
| `rowLabel` | `string` | — | — |
| `showRowTotals` | `boolean` | — | — |
| `showColumnTotals` | `boolean` | — | — |
| `stickyHeader` | `boolean` | — | — |
| `loading` | `boolean` | — | — |
| `disabled` | `boolean` | — | — |

## Events

| Event | Description |
| --- | --- |
| `update:modelValue` | — |
| `change` | — |
| `cellClick` | — |
| `rowClick` | — |

## Slots / Expose / Models

见 `generated/component-api/PivotTable.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/PivotTable/a11y.json`。

## Keyboard

见 `component-hardening/evidence/PivotTable/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/PivotTable.json`

## Known Limitations

以 contract + evidence 为准。
