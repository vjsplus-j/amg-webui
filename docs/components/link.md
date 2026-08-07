# Link

Link 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 Link 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { Link } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/Link/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `href` | `string` | — | — |
| `to` | `string` | — | — |
| `type` | `LinkType` | — | — |
| `size` | `Size` | — | — |
| `underline` | `LinkUnderline` | — | — |
| `disabled` | `boolean` | — | — |
| `readonly` | `boolean` | — | — |
| `loading` | `boolean` | — | — |
| `target` | `'_self' \| '_blank' \| '_parent' \| '_top' \| string` | — | — |
| `replace` | `boolean` | — | — |
| `icon` | `string` | — | — |
| `iconPos` | `LinkIconPos` | — | — |
| `iconSize` | `Size` | — | — |
| `iconGap` | `Size \| string` | — | — |
| `ariaLabel` | `string` | — | — |
| `tooltip` | `string` | — | — |
| `stopPropagation` | `boolean` | — | — |
| `permission` | `boolean \| (() => boolean)` | — | — |
| `permissionMode` | `LinkPermissionMode` | — | — |
| `permissionTip` | `string` | — | — |
| `beforeClick` | `(event: MouseEvent) => boolean \| void \| Promise<boolean \| void>` | — | — |
| `clickGuard` | `LinkClickGuard` | — | — |
| `wait` | `number` | — | — |

## Events

| Event | Description |
| --- | --- |
| `click` | — |
| `focus` | — |
| `blur` | — |

## Slots / Expose / Models

见 `generated/component-api/Link.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/Link/a11y.json`。

## Keyboard

见 `component-hardening/evidence/Link/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/Link.json`

## Known Limitations

以 contract + evidence 为准。
