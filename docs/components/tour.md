# Tour

Tour 组件 API（v0.1 子集）。

## 基础用法

```vue
<script setup>
import { Tour } from '@amg-webui/overlay'
</script>

<template>
  <Tour />
</template>
```

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number` | — | — |
| `current` | `number` | — | — |
| `steps` | `TourStep[]` | **必填** | — |
| `open` | `boolean` | — | — |
| `mask` | `boolean` | — | — |
| `type` | `TourType` | — | — |


| 事件 | 说明 |
| --- | --- |
| `update:open` | — |
| `update:current` | — |
| `update:modelValue` | — |
| `change` | — |
| `finish` | — |
| `close` | — |
| `skip` | — |

> 完整 Demo 见 `example/demos/Tour/`。本阶段对外 docs 为薄 API stub；交互预览仅在本地 example（不上线）。
