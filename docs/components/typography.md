# Typography

Typography 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 Typography 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { Typography } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/Typography/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `spin` | `boolean` | — | — |
| `pulse` | `boolean` | — | — |
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
| `type` | `TypographyType` | — | — |
| `typeColor` | `Severity` | — | — |
| `color` | `Severity` | — | — |
| `copyable` | `TypographyCopyable` | — | — |
| `ellipsis` | `TypographyEllipsis` | — | — |
| `strong` | `boolean` | — | — |
| `italic` | `boolean` | — | — |
| `underline` | `boolean` | — | — |
| `delete` | `boolean` | — | — |
| `mark` | `boolean` | — | — |
| `code` | `boolean` | — | — |
| `disabled` | `boolean` | — | — |
| `loading` | `boolean` | — | — |
| `shimmer` | `boolean` | — | — |
| `clickable` | `boolean` | — | — |
| `fontFamily` | `TypographyFontFamily` | — | — |
| `lineHeight` | `string \| number` | — | — |
| `content` | `string` | — | — |

## Events

| Event | Description |
| --- | --- |
| `copy` | — |
| `copyError` | — |
| `click` | — |

## Slots / Expose / Models

见 `generated/component-api/Typography.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/Typography/a11y.json`。

## Keyboard

见 `component-hardening/evidence/Typography/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/Typography.json`

## Known Limitations

以 contract + evidence 为准。
