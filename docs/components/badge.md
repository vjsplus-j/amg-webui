# Badge

Badge 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 Badge 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { Badge } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/Badge/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `spin` | `boolean` | — | — |
| `heartbeat` | `boolean` | — | — |
| `bounce` | `boolean` | — | — |
| `blink` | `boolean` | — | — |
| `breathe` | `boolean` | — | — |
| `glow` | `boolean` | — | — |
| `marqueeLeft` | `boolean` | — | — |
| `marqueeRight` | `boolean` | — | — |
| `scrollUp` | `boolean` | — | — |
| `scrollDown` | `boolean` | — | — |
| `dampOut` | `boolean` | — | — |
| `animationDuration` | `number \| string` | — | — |
| `value` | `string \| number` | — | — |
| `max` | `number` | — | — |
| `dot` | `boolean` | — | — |
| `hidden` | `boolean` | — | — |
| `type` | `BadgeSeverity` | — | — |
| `severity` | `BadgeSeverity` | — | — |
| `size` | `BadgeSize` | — | — |
| `position` | `BadgePosition` | — | — |
| `offset` | `[number, number]` | — | — |
| `colorBg` | `string` | — | — |
| `colorText` | `string` | — | — |
| `color` | `string` | — | — |
| `tooltip` | `string` | — | — |
| `tooltipDelay` | `number` | — | — |
| `disabled` | `boolean` | — | — |
| `pulse` | `boolean` | — | — |
| `ariaLabel` | `string` | — | — |
| `decorative` | `boolean` | — | — |

## Events

| Event | Description |
| --- | --- |
| `click` | — |

## Slots / Expose / Models

见 `generated/component-api/Badge.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/Badge/a11y.json`。

## Keyboard

见 `component-hardening/evidence/Badge/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/Badge.json`

## Known Limitations

以 contract + evidence 为准。
