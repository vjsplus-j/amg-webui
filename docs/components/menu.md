# Menu

Menu 组件 API（v0.1 子集）。

## 基础用法

```vue
<script setup>
import { Menu } from '@amg-webui/core'
</script>

<template>
  <Menu />
</template>
```

## 交互演示

<DocsDemo name="menu-basic" />

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `items` | `MenuItem[]` | — | — |
| `modelValue` | `string` | — | — |
| `openKeys` | `string[]` | — | — |
| `collapsed` | `boolean` | — | — |
| `direction` | `'vertical' \| 'horizontal'` | — | — |
| `mode` | `'auto' \| 'inline' \| 'popup'` | — | — |
| `disabled` | `boolean` | — | — |
| `trackId` | `string` | — | — |
| `telemetry` | `boolean` | — | — |


| 事件 | 说明 |
| --- | --- |
| `update:modelValue` | — |
| `update:openKeys` | — |
| `change` | — |
| `select` | — |
| `openChange` | — |

> 完整 Demo 见 `example/demos/Menu/`。本阶段对外 docs 为薄 API stub；交互预览仅在本地 example（不上线）。
