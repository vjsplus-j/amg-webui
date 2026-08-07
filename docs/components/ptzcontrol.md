# PTZControl

PTZControl 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 PTZControl 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { PTZControl } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/PTZControl/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `PtzCommand \| null` | — | — |
| `disabled` | `boolean` | — | — |
| `speed` | `number` | — | — |
| `minSpeed` | `number` | — | — |
| `maxSpeed` | `number` | — | — |
| `step` | `number` | — | — |
| `keyboard` | `boolean` | — | — |
| `showAdvanced` | `boolean` | — | — |
| `presets` | `number[]` | — | — |

## Events

| Event | Description |
| --- | --- |
| `update:modelValue` | — |
| `update:speed` | — |
| `command` | — |
| `change` | — |

## Slots / Expose / Models

见 `generated/component-api/PTZControl.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/PTZControl/a11y.json`。

## Keyboard

见 `component-hardening/evidence/PTZControl/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/PTZControl.json`

## Known Limitations

以 contract + evidence 为准。
