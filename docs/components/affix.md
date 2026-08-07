# Affix

Affix 组件 API（v0.1 子集）。

## 基础用法

```vue
<script setup>
import { Affix } from '@amg-webui/core'
</script>

<template>
  <Affix />
</template>
```

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `offsetTop` | `number` | — | Distance to top when affixed (px) |
| `offsetBottom` | `number` | — | Distance to bottom when affixed (px) |
| `target` | `string \| HTMLElement \| Window` | — | Scroll container — defaults to window |
| `zIndex` | `number` | — | — |
| `disabled` | `boolean` | — | — |


| 事件 | 说明 |
| --- | --- |
| `change` | — |
| `scroll` | — |

> 完整 Demo 见 `example/demos/Affix/`。本阶段对外 docs 为薄 API stub；交互预览仅在本地 example（不上线）。
