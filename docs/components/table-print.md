# TablePrint

TablePrint 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 TablePrint 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { TablePrint } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/TablePrint/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `{ key: string; label?: string; formatter?: ( value: unknown, row: Record<string, unknown>, index: number, ) => string; }[]` | — | — |
| `data` | `Record<string, unknown>[]` | — | — |
| `title` | `string` | — | — |
| `disabled` | `boolean` | — | — |
| `bordered` | `boolean` | — | — |
| `showToolbar` | `boolean` | — | — |
| `emptyText` | `string` | — | — |

## Events

| Event | Description |
| --- | --- |
| `print` | — |
| `before-print` | — |
| `after-print` | — |
| `error` | — |

## Slots / Expose / Models

见 `generated/component-api/TablePrint.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/TablePrint/a11y.json`。

## Keyboard

见 `component-hardening/evidence/TablePrint/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/TablePrint.json`

## Known Limitations

以 contract + evidence 为准。
