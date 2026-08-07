# LoadingTip

LoadingTip 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 LoadingTip 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { LoadingTip } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/LoadingTip/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `message` | `string` | — | — |
| `loading` | `boolean` | — | — |
| `size` | `LoadingTipSize` | — | — |
| `delay` | `number` | — | — |
| `block` | `boolean` | — | — |
| `overlay` | `boolean` | — | — |
| `persistent` | `boolean` | — | — |
| `live` | `"polite" \| "assertive" \| "off"` | — | — |
| `progress` | `number` | — | — |
| `cancellable` | `boolean` | — | — |
| `cancelText` | `string` | — | — |

## Events

| Event | Description |
| --- | --- |
| `show` | — |
| `hide` | — |
| `cancel` | — |

## Slots / Expose / Models

见 `generated/component-api/LoadingTip.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/LoadingTip/a11y.json`。

## Keyboard

见 `component-hardening/evidence/LoadingTip/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/LoadingTip.json`

## Known Limitations

以 contract + evidence 为准。
