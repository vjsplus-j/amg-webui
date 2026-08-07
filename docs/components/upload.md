# Upload

Upload 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 Upload 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { Upload } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/Upload/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `UploadFile[]` | — | — |
| `id` | `string` | — | — |
| `invalid` | `boolean` | — | — |
| `multiple` | `boolean` | — | — |
| `accept` | `string` | — | — |
| `drag` | `boolean` | — | — |
| `beforeUpload` | `(file: File) => boolean \| void \| Promise<boolean \| void>` | — | — |

## Events

| Event | Description |
| --- | --- |
| `update:modelValue` | — |
| `beforeUpload` | — |
| `change` | — |
| `remove` | — |

## Slots / Expose / Models

见 `generated/component-api/Upload.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/Upload/a11y.json`。

## Keyboard

见 `component-hardening/evidence/Upload/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/Upload.json`

## Known Limitations

以 contract + evidence 为准。
