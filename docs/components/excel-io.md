# ExcelIo

ExcelIo 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 ExcelIo 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { ExcelIo } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/ExcelIo/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `string[]` | — | — |
| `data` | `Record<string, unknown>[]` | — | — |
| `filename` | `string` | — | — |
| `disabled` | `boolean` | — | — |
| `encoding` | `string` | — | — |
| `maxPreviewRows` | `number` | — | — |
| `showPreview` | `boolean` | — | — |
| `loading` | `boolean` | — | — |

## Events

| Event | Description |
| --- | --- |
| `import` | — |
| `export` | — |
| `error` | — |

## Slots / Expose / Models

见 `generated/component-api/ExcelIo.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/ExcelIo/a11y.json`。

## Keyboard

见 `component-hardening/evidence/ExcelIo/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/ExcelIo.json`

## Known Limitations

以 contract + evidence 为准。
