# Container

Container 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 Container 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { Container } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/Container/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `ContainerSize` | — | — |
| `fluid` | `boolean` | — | — |
| `padded` | `boolean` | — | — |
| `align` | `'start' \| 'center' \| 'end'` | — | — |
| `gap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'section'` | — | — |
| `tag` | `'div' \| 'main' \| 'section' \| 'article'` | — | — |
| `ariaLabel` | `string` | — | — |
| `fullBleed` | `boolean` | — | — |
| `maxWidth` | `string` | — | — |
| `class` | `string` | — | — |
| `style` | `Record<string, string>` | — | — |

## Events

| Event | Description |
| --- | --- |
| — | See generated API |

## Slots / Expose / Models

见 `generated/component-api/Container.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/Container/a11y.json`。

## Keyboard

见 `component-hardening/evidence/Container/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/Container.json`

## Known Limitations

以 contract + evidence 为准。
