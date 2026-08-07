# Avatar

Avatar 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 Avatar 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { Avatar } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/Avatar/index.vue`

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
| `src` | `string` | — | — |
| `alt` | `string` | — | — |
| `text` | `string` | — | — |
| `textMaxLength` | `number` | — | — |
| `size` | `AvatarSize` | — | — |
| `shape` | `AvatarShape` | — | — |
| `borderRadius` | `string` | — | — |
| `icon` | `string` | — | — |
| `bordered` | `boolean` | — | — |
| `borderColor` | `string` | — | — |
| `borderWidth` | `string` | — | — |
| `variant` | `'default' \| 'neon'` | — | — |
| `colorBg` | `string` | — | — |
| `colorText` | `string` | — | — |
| `tooltip` | `string` | — | — |
| `tooltipDelay` | `number` | — | — |
| `disabled` | `boolean` | — | — |
| `loading` | `boolean` | — | — |
| `clickable` | `boolean` | — | — |
| `fallbackSrc` | `string` | — | — |
| `fallbackText` | `string` | — | — |
| `fallbackIcon` | `string` | — | — |

## Events

| Event | Description |
| --- | --- |
| `error` | — |
| `click` | — |
| `load` | — |

## Slots / Expose / Models

见 `generated/component-api/Avatar.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/Avatar/a11y.json`。

## Keyboard

见 `component-hardening/evidence/Avatar/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/Avatar.json`

## Known Limitations

以 contract + evidence 为准。
