# Pagination

Pagination 组件 API（v0.1 子集）。

## 基础用法

```vue
<script setup>
import { Pagination } from '@amg-webui/data'
</script>

<template>
  <Pagination />
</template>
```

## 交互演示

<DocsDemo name="pagination-basic" />

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `total` | `number` | — | — |
| `page` | `number` | — | — |
| `pageSize` | `number` | — | — |
| `pageSizes` | `number[]` | — | — |
| `disabled` | `boolean` | — | — |


| 事件 | 说明 |
| --- | --- |
| `update:page` | — |
| `update:pageSize` | — |
| `change` | — |

> 完整 Demo 见 `example/demos/Pagination/`。本阶段对外 docs 为薄 API stub；交互预览仅在本地 example（不上线）。
