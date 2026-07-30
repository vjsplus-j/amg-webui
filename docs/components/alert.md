# Alert

Alert 组件 API（v0.1 子集）。

## 基础用法

```vue
<script setup>
import { Alert } from '@amg-webui/components/base'
</script>

<template>
  <Alert />
</template>
```

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | — |
| `severity` | `AlertSeverity` | — | — |
| `closable` | `boolean` | — | — |
| `showIcon` | `boolean` | — | — |


| 事件 | 说明 |
| --- | --- |
| `close` | — |

> 完整 Demo 见 `example/demos/Alert/`。本阶段对外 docs 为薄 API stub；交互预览仅在本地 example（不上线）。
