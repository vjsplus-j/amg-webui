# TimelineList

TimelineList 组件（Stable 文档页，由 Repository Completion Audit 流水线生成）。

## Overview

企业组件库公开组件。完整交互与边界用例见本地 example playground（不上线）。

## When To Use

需要 TimelineList 能力时使用。

## When Not To Use

不需要该交互面时改用更轻量的基础件。

## Import

```ts
import { TimelineList } from 'amg-webui'
```

## Demos

运行态 Demo：`example/demos/TimelineList/index.vue`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | — |
| `description` | `string` | — | — |
| `items` | `TimelineListItem[]` | — | — |
| `data` | `TimelineListItem[]` | — | — |
| `modelValue` | `TimelineListKey \| null` | — | — |
| `selectable` | `boolean` | — | — |
| `reverse` | `boolean` | — | — |
| `groupBy` | `"day" \| "none" \| ((item: TimelineListItem) => string)` | — | — |
| `collapsible` | `boolean` | — | — |
| `defaultExpandedKeys` | `string[]` | — | — |
| `disabled` | `boolean` | — | — |
| `loading` | `boolean` | — | — |
| `pending` | `boolean \| string` | — | — |
| `emptyText` | `string` | — | — |
| `ariaLabel` | `string` | — | — |

## Events

| Event | Description |
| --- | --- |
| `update:modelValue` | — |
| `change` | — |
| `itemClick` | — |
| `groupToggle` | — |
| `click` | — |

## Slots / Expose / Models

见 `generated/component-api/TimelineList.json`。

## Accessibility

见组件实现与 `component-hardening/evidence/TimelineList/a11y.json`。

## Keyboard

见 `component-hardening/evidence/TimelineList/keyboard.json`。

## Design Tokens

使用语义 token（`vp-` / theme CSS variables），禁止硬编码色值。

## Version

- Inventory: public
- Maturity: see `component-hardening/contracts/TimelineList.json`

## Known Limitations

以 contract + evidence 为准。
