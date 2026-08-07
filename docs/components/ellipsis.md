# Ellipsis 文本省略

单行 / 多行截断，溢出时可 Tooltip 展示全文，并暴露溢出状态。

## 基础用法

```vue
<script setup>
import { Ellipsis } from '@amg-webui/core'
</script>

<template>
  <Ellipsis :lines="1" tooltip>
    很长很长的标题或描述文本……
  </Ellipsis>
</template>
```

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `lines` | `number` | `1` | 可见行数 |
| `tooltip` | `boolean` | `false` | 溢出时 Tooltip 全文 |
| `tooltipPlacement` | `TooltipPlacement` | — | Tooltip 位置 |
| `content` | `string` | — | 无插槽时的纯文本；亦可作 Tooltip 源 |
| `ariaLabel` | `string` | — | 截断可聚焦时的无障碍名称 |

| 事件 | 说明 |
| --- | --- |
| `overflowChange` | 是否发生截断 |

| 插槽 | 说明 |
| --- | --- |
| `default` | 源内容 |

> 完整 Demo 见 `example/demos/Ellipsis/`。本阶段对外 docs 为薄 API stub。
