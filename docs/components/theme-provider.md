# ThemeProvider

ThemeProvider 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 ThemeProvider 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { ThemeProvider } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/ThemeProvider/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `design` | `DesignStyleName \| string` | — | — |
| `theme` | `string` | — | — |
| `scheme` | `ColorScheme` | — | — |
| `font` | `FontName \| string` | — | — |
| `iconStyle` | `IconStyleName \| string` | — | — |
| `tokens` | `Record<string, string>` | — | — |
| `primary` | `string` | — | — |
| `runtime` | `ThemeRuntime` | — | — |
| `persist` | `boolean` | — | — |
| `storageNamespace` | `string` | — | — |
| `tag` | `string` | — | — |
| `display` | `'block' \| 'contents' \| 'inline'` | — | — |
| `ariaLabel` | `string` | — | — |

## Events

| Event | Description |
| --- | --- |
| `change` | — |

## Slots / Expose / Models

见 `generated/component-api/ThemeProvider.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/ThemeProvider/a11y.json`。

## Keyboard

见 `component-hardening/evidence/ThemeProvider/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/ThemeProvider.json`

## Known Limitations

以 contract + evidence 为准。
