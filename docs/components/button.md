# Button

Button 为 **Stable** 公共组件（API frozen）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## Overview

Button 已通过 Component Hardening 证据门禁；完整交互演示见本地 example curated demo。

## When To Use

- **适用**：生产可用的 Stable 组件场景。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## When Not To Use

见上节「不适用」口径。

## Related Components

- [ButtonGroup](./button-group)
- [Dialog](./dialog)

## Examples

```vue
<script setup>
import { Button } from '@amg-webui/core'
</script>

<template>
  <Button />
</template>
```

Curated demo：`example/demos/Button/index.vue`

<DocsDemo name="button-basic" />

## API

### Props

| Prop | 类型 | 默认 | 说明 |
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
| `icon` | `string` | — | — |
| `iconPos` | `ButtonIconPos` | — | — |
| `iconSize` | `Size` | — | — |
| `iconGap` | `Size \| string` | — | — |
| `severity` | `ButtonSeverity` | — | — |
| `variant` | `ButtonVariant` | — | — |
| `size` | `Size` | — | — |
| `shape` | `ButtonShape` | — | — |
| `rounded` | `boolean` | — | — |
| `borderRadius` | `string` | — | — |
| `raised` | `boolean` | — | — |
| `link` | `boolean` | — | — |
| `block` | `boolean` | — | — |
| `fluid` | `boolean` | — | — |
| `loading` | `boolean` | — | — |
| `loadingText` | `string` | — | — |
| `disabled` | `boolean` | — | — |
| `disabledTitle` | `string` | — | — |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `click` | `event: MouseEvent` | — |
| `focus` | `event: FocusEvent` | — |
| `blur` | `event: FocusEvent` | — |
| `confirm` | `event: Event` | — |
| `cancelConfirm` | `event: Event` | — |

### Slots

| Slot | Props | 说明 |
| --- | --- | --- |
| `default` | `props: Record<string, never>` | — |
| `icon` | `props: Record<string, never>` | — |
| `loading` | `props: Record<string, never>` | — |

### Expose

| Expose | 类型 | 说明 |
| --- | --- | --- |
| `el` | `HTMLElement \| null` | — |
| `focus` | `() => void` | — |
| `blur` | `() => void` | — |

### Public types

- `ButtonSeverity`
- `ButtonIconPos`
- `ButtonShape`
- `ButtonVariant`
- `ButtonClickGuard`
- `ButtonPermissionMode`
- `ButtonNativeType`
- `ButtonInstance`
- `ButtonProps`
- `ButtonEmits`
- `ButtonSlots`
- `ButtonExpose`

## Accessibility

交互行为与键盘路径以 `component-hardening/evidence/Button/a11y.json` · `keyboard.json` 为准；本地可复现：`example/demos/Button/`。

## Stability

| 字段 | 值 |
| --- | --- |
| maturity | `stable` |
| apiFreeze | `frozen` |
| API extract | `generated/component-api/Button.json` |

> 完整 Demo 见 `example/demos/Button`。对外 docs 为 API 导向页面；交互预览仅在本地 example（不上线）。
