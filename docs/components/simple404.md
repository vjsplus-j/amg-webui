# Simple404

Simple404 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 Simple404 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { Simple404 } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/Simple404/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `code` | `string \| number` | — | — |
| `title` | `string` | — | — |
| `description` | `string` | — | — |
| `actions` | `Simple404Action[]` | — | — |
| `homeHref` | `string` | — | — |
| `retryable` | `boolean` | — | — |
| `modelValue` | `string` | — | — |
| `data` | `unknown` | — | — |
| `disabled` | `boolean` | — | — |
| `loading` | `boolean` | — | — |

## Events

| Event | Description |
| --- | --- |
| `update:modelValue` | — |
| `change` | — |
| `click` | — |
| `action` | — |
| `home` | — |
| `retry` | — |

## Slots / Expose / Models

见 `generated/component-api/Simple404.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/Simple404/a11y.json`。

## Keyboard

见 `component-hardening/evidence/Simple404/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/Simple404.json`

## Known Limitations

以 contract + evidence 为准。
