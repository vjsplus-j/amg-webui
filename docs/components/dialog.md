# Dialog

Dialog 组件 API（v0.1 子集）。

## 基础用法

```vue
<script setup>
import { Dialog } from '@amg-webui/overlay'
</script>

<template>
  <Dialog />
</template>
```

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `visible` | `boolean` | — | — |
| `header` | `string` | — | — |
| `footer` | `string` | — | — |
| `title` | `string` | — | — |
| `modal` | `boolean` | — | — |
| `dismissible` | `boolean` | — | — |
| `closable` | `boolean` | — | — |
| `maximizable` | `boolean` | — | — |
| `minimizable` | `boolean` | — | — |
| `size` | `DialogSize` | — | Preset width — ignored when maximized |
| `width` | `string` | — | Custom width CSS value (overrides size) |


| 事件 | 说明 |
| --- | --- |
| `maximize` | — |

> 完整 Demo 见 `example/demos/Dialog/`。本阶段对外 docs 为薄 API stub；交互预览仅在本地 example（不上线）。
