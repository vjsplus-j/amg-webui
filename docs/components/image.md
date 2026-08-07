# Image

Image 组件 API（v0.1 子集）。

## 基础用法

```vue
<script setup>
import { Image } from '@amg-webui/core'
</script>

<template>
  <Image />
</template>
```

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `src` | `string` | **必填** | — |
| `alt` | `string` | — | — |
| `fit` | `ImageFit` | — | — |
| `lazy` | `boolean` | — | — |
| `preview` | `boolean` | — | — |
| `previewSrc` | `string` | — | — |
| `previewSrcList` | `string[]` | — | — |
| `initialIndex` | `number` | — | — |
| `width` | `string` | — | — |
| `height` | `string` | — | — |
| `fallback` | `string` | — | — |
| `placeholder` | `string` | — | — |
| `disabled` | `boolean` | — | — |


| 事件 | 说明 |
| --- | --- |
| `load` | — |
| `error` | — |
| `click` | — |
| `switch` | — |

> 完整 Demo 见 `example/demos/Image/`。本阶段对外 docs 为薄 API stub；交互预览仅在本地 example（不上线）。
