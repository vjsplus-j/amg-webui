# Segmented

Segmented 组件 API（v0.1 子集）。

## 基础用法

```vue
<script setup>
import { Segmented } from '@amg-webui/components/base'
</script>

<template>
  <Segmented />
</template>
```

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| boolean` | — | — |
| `options` | `SegmentedOption[]` | — | — |
| `size` | `Size` | — | — |
| `block` | `boolean` | — | — |
| `name` | `string` | — | — |
| `ariaLabel` | `string` | — | — |


| 事件 | 说明 |
| --- | --- |
| `update:modelValue` | — |
| `change` | — |

> 完整 Demo 见 `example/demos/Segmented/`。本阶段对外 docs 为薄 API stub；交互预览仅在本地 example（不上线）。
