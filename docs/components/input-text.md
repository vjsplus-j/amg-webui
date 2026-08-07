# InputText 文本输入

InputText 组件 API（v0.1 子集）。

## 基础用法

```vue
<script setup>
import { InputText } from '@amg-webui/form'
</script>

<template>
  <InputText />
</template>
```

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | — | — |
| `placeholder` | `string` | — | — |
| `disabled` | `boolean` | — | — |
| `readonly` | `boolean` | — | — |
| `maxlength` | `number` | — | — |
| `size` | `Size` | — | — |
| `invalid` | `boolean` | — | — |
| `fluid` | `boolean` | — | — |
| `type` | `'text' \| 'password' \| 'email' \| 'tel' \| 'url' \| 'search'` | — | — |


| 事件 | 说明 |
| --- | --- |
| `keydown` | — |
| `keyup` | — |

> 完整 Demo 见 `example/demos/InputText/`。本阶段对外 docs 为薄 API stub；交互预览仅在本地 example（不上线）。
