# VideoSnapshot

VideoSnapshot 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 VideoSnapshot 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { VideoSnapshot } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/VideoSnapshot/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `videoRef` | `HTMLVideoElement \| null` | — | — |
| `src` | `string` | — | — |
| `stream` | `MediaStream \| null` | — | — |
| `crossOrigin` | `"" \| "anonymous" \| "use-credentials"` | — | — |
| `controls` | `boolean` | — | — |
| `autoplay` | `boolean` | — | — |
| `muted` | `boolean` | — | — |
| `format` | `VideoSnapshotFormat` | — | — |
| `quality` | `number` | — | — |
| `maxWidth` | `number` | — | — |
| `maxHeight` | `number` | — | — |
| `preview` | `boolean` | — | — |
| `downloadable` | `boolean` | — | — |
| `fileName` | `string` | — | — |
| `disabled` | `boolean` | — | — |
| `loading` | `boolean` | — | — |
| `title` | `string` | — | — |
| `emptyText` | `string` | — | — |
| `ariaLabel` | `string` | — | — |

## Events

| Event | Description |
| --- | --- |
| `capture` | — |
| `clear` | — |
| `download` | — |
| `error` | — |

## Slots / Expose / Models

见 `generated/component-api/VideoSnapshot.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/VideoSnapshot/a11y.json`。

## Keyboard

见 `component-hardening/evidence/VideoSnapshot/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/VideoSnapshot.json`

## Known Limitations

以 contract + evidence 为准。
