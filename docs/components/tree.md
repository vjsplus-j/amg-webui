# Tree

Tree 组件 API（v0.1 子集）。

## 基础用法

```vue
<script setup>
import { Tree } from '@amg-webui/data'
</script>

<template>
  <Tree />
</template>
```

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | — |
| `description` | `string` | — | — |
| `data` | `unknown` | — | — |
| `modelValue` | `unknown` | — | — |
| `disabled` | `boolean` | — | — |
| `loading` | `boolean` | — | — |


| 事件 | 说明 |
| --- | --- |
| `update:modelValue` | — |
| `change` | — |
| `click` | — |

> 完整 Demo 见 `example/demos/Tree/`。本阶段对外 docs 为薄 API stub；交互预览仅在本地 example（不上线）。
