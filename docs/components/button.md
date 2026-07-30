# Button

Button 组件 API（v0.1 子集）。

## 基础用法

```vue
<script setup>
import { Button } from '@amg-webui/components/base'
</script>

<template>
  <Button />
</template>
```

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `spin` | `boolean` | — | Continuous rotate — shared Motion |
| `pulse` | `boolean` | — | Soft opacity pulse — shared Motion |
| `heartbeat` | `boolean` | — | Scale heartbeat — shared Motion |
| `bounce` | `boolean` | — | Jump upward — shared Motion |
| `blink` | `boolean` | — | Sharp flash — shared Motion |
| `breathe` | `boolean` | — | Breathing light — shared Motion |
| `glow` | `boolean` | — | Fluorescent glow — shared Motion |
| `marqueeLeft` | `boolean` | — | Marquee scroll left — shared Motion |
| `marqueeRight` | `boolean` | — | Marquee scroll right — shared Motion |
| `scrollUp` | `boolean` | — | Vertical scroll up — shared Motion |
| `scrollDown` | `boolean` | — | Vertical scroll down — shared Motion |
| `dampOut` | `boolean` | — | Damped zoom then fade out — shared Motion |
| `animationDuration` | `number \| string` | — | Animation duration (ms or CSS time) — shared Motion |
| `label` | `string` | — | — |
| `icon` | `string` | — | Lucide icon name (e.g. `Star`) — used when `#icon` slot is empty |
| `iconPos` | `ButtonIconPos` | — | — |
| `iconSize` | `Size` | — | Override icon size token (defaults to button size) |
| `iconGap` | `Size \| string` | — | Gap between icon and label — Size token or CSS length |
| `severity` | `ButtonSeverity` | — | — |
| `variant` | `ButtonVariant` | — | — |
| `size` | `Size` | — | 极小 xs → 超大 xl，映射 `--height-*` |
| `shape` | `ButtonShape` | — | 形状：矩形（默认）/ 方形 / 圆形 |
| `rounded` | `boolean` | — | Pill / full radius |
| `borderRadius` | `string` | — | Custom radius — CSS value (prefer token / `%`) |


| 事件 | 说明 |
| --- | --- |
| `click` | — |
| `focus` | — |
| `blur` | — |
| `confirm` | — |
| `cancelConfirm` | — |

> 完整 Demo 见 `example/demos/Button/`。本阶段对外 docs 为薄 API stub；交互预览仅在本地 example（不上线）。
