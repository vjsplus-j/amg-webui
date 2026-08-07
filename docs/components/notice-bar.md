# NoticeBar

NoticeBar 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 NoticeBar 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { NoticeBar } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/NoticeBar/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | — | — |
| `message` | `string` | — | — |
| `title` | `string` | — | — |
| `severity` | `Severity` | — | — |
| `icon` | `string \| boolean` | — | — |
| `closable` | `boolean` | — | — |
| `scrollable` | `boolean` | — | — |
| `speed` | `number` | — | — |
| `pauseOnHover` | `boolean` | — | — |
| `wrap` | `boolean` | — | — |
| `actionText` | `string` | — | — |

## Events

| Event | Description |
| --- | --- |
| `update:modelValue` | — |
| `close` | — |
| `click` | — |
| `action` | — |

## Slots / Expose / Models

见 `generated/component-api/NoticeBar.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/NoticeBar/a11y.json`。

## Keyboard

见 `component-hardening/evidence/NoticeBar/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/NoticeBar.json`

## Known Limitations

以 contract + evidence 为准。
