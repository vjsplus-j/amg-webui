# FloatButton

FloatButton 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 FloatButton 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { FloatButton } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/FloatButton/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `Severity` | — | — |
| `severity` | `Severity` | — | — |
| `shape` | `Shape` | — | — |
| `icon` | `string` | — | — |
| `href` | `string` | — | — |
| `top` | `string \| number` | — | — |
| `right` | `string \| number` | — | — |
| `bottom` | `string \| number` | — | — |
| `left` | `string \| number` | — | — |
| `open` | `boolean` | — | — |
| `ariaLabel` | `string` | — | — |

## Events

| Event | Description |
| --- | --- |
| `click` | — |
| `update:open` | — |
| `openChange` | — |

## Slots / Expose / Models

见 `generated/component-api/FloatButton.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/FloatButton/a11y.json`。

## Keyboard

见 `component-hardening/evidence/FloatButton/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/FloatButton.json`

## Known Limitations

以 contract + evidence 为准。
