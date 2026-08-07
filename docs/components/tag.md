# Tag

Tag 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 Tag 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { Tag } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/Tag/index.vue`

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
| `label` | `string` | — | — |
| `type` | `TagSeverity` | — | — |
| `severity` | `TagSeverity` | — | — |
| `effect` | `TagEffect` | — | — |
| `size` | `TagSize` | — | — |
| `icon` | `string` | — | — |
| `iconSize` | `Size` | — | — |
| `closable` | `boolean` | — | — |
| `round` | `boolean` | — | — |
| `rounded` | `boolean` | — | — |
| `borderRadius` | `string` | — | — |
| `disabled` | `boolean` | — | — |
| `clickable` | `boolean` | — | — |
| `wait` | `number` | — | — |
| `beforeClose` | `(event: MouseEvent) => boolean \| void \| Promise<boolean \| void>` | — | — |
| `colorBg` | `string` | — | — |
| `colorText` | `string` | — | — |
| `colorBorder` | `string` | — | — |
| `color` | `string` | — | — |

## Events

| Event | Description |
| --- | --- |
| `close` | — |
| `click` | — |

## Slots / Expose / Models

见 `generated/component-api/Tag.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/Tag/a11y.json`。

## Keyboard

见 `component-hardening/evidence/Tag/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/Tag.json`

## Known Limitations

以 contract + evidence 为准。
