# Select

Select 组件 API（v0.1 子集）。

## 基础用法

```vue
<script setup>
import { Select } from '@amg-webui/form'
</script>

<template>
  <Select />
</template>
```

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `unknown` | — | — |
| `options` | `SelectOption[]` | — | — |
| `placeholder` | `string` | — | — |
| `disabled` | `boolean` | — | — |
| `readonly` | `boolean` | — | — |
| `filterable` | `boolean` | — | — |
| `clearable` | `boolean` | — | — |
| `invalid` | `boolean` | — | — |
| `size` | `Size` | — | — |
| `fluid` | `boolean` | — | — |
| `width` | `string` | — | — |
| `panelClass` | `string` | — | — |
| `panelStyle` | `Record<string, string>` | — | — |


| 事件 | 说明 |
| --- | --- |
| `update:modelValue` | — |
| `change` | — |
| `focus` | — |
| `blur` | — |
| `show` | — |
| `hide` | — |

> 完整 Demo 见 `example/demos/Select/`。本阶段对外 docs 为薄 API stub；交互预览仅在本地 example（不上线）。
