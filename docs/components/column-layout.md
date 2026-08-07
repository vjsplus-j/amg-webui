# ColumnLayout

ColumnLayout 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 ColumnLayout 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { ColumnLayout } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/ColumnLayout/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `number` | — | — |
| `gap` | `ColumnGap` | — | — |
| `align` | `ColumnAlign` | — | — |
| `dense` | `boolean` | — | — |
| `label` | `string` | — | — |
| `class` | `string` | — | — |
| `style` | `Record<string, string>` | — | — |

## Events

| Event | Description |
| --- | --- |
| `columns-change` | — |

## Slots / Expose / Models

见 `generated/component-api/ColumnLayout.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/ColumnLayout/a11y.json`。

## Keyboard

见 `component-hardening/evidence/ColumnLayout/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/ColumnLayout.json`

## Known Limitations

以 contract + evidence 为准。
