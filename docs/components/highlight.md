# Highlight 文本高亮

在源文本中按关键词高亮匹配段，支持多关键词、忽略大小写、整词匹配与多种视觉形态。

## 基础用法

```vue
<script setup>
import { Highlight } from '@amg-webui/components/base'
</script>

<template>
  <Highlight text="Vue 3 composition API" keyword="Vue" />
</template>
```

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `text` | `string` | — | 源文本 |
| `keyword` | `string \| string[]` | — | 关键词 |
| `ignoreCase` | `boolean` | `true` | 忽略大小写 |
| `matchWholeWord` | `boolean` | `false` | 整词边界 |
| `variant` | `'mark' \| 'underline' \| 'background'` | `'mark'` | 视觉形态 |
| `color` / `colorText` | `string` | Token | 高亮色（优先 CSS Token） |
| `ariaLabel` | `string` | — | 无障碍标签 |

| 事件 | 说明 |
| --- | --- |
| `matchChange` | 匹配段数量变化 |

> 完整 Demo 见 `example/demos/Highlight/`。本阶段对外 docs 为薄 API stub。
