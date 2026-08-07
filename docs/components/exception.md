# Exception

Exception 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 Exception 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { Exception } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/Exception/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `status` | `"403" \| "404" \| "500" \| "offline"` | — | — |
| `title` | `string` | — | — |
| `description` | `string` | — | — |
| `trackId` | `string` | — | — |
| `telemetry` | `boolean` | — | — |
| `actionText` | `string` | — | — |
| `actionDisabled` | `boolean` | — | — |
| `ariaLive` | `"polite" \| "assertive" \| "off"` | — | — |
| `secondaryActionText` | `string` | — | — |
| `showCode` | `boolean` | — | — |
| `compact` | `boolean` | — | — |
| `loading` | `boolean` | — | — |

## Events

| Event | Description |
| --- | --- |
| `action` | — |
| `secondaryAction` | — |

## Slots / Expose / Models

见 `generated/component-api/Exception.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/Exception/a11y.json`。

## Keyboard

见 `component-hardening/evidence/Exception/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/Exception.json`

## Known Limitations

以 contract + evidence 为准。
