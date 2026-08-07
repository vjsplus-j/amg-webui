# Divider 分割线

区块 / 行内内容分割：水平 / 垂直、虚线、文案位、装饰性分隔。

## 基础用法

```vue
<script setup>
import { Divider } from '@amg-webui/core'
</script>

<template>
  <Divider />
  <Divider content-position="left">Section</Divider>
  <Divider direction="vertical" />
</template>
```

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `direction` / `type` | `'horizontal' \| 'vertical'` | `'horizontal'` | 布局轴（`type` 为别名） |
| `contentPosition` | `'left' \| 'center' \| 'right'` | `'center'` | 插槽文案位置 |
| `dashed` | `boolean` | `false` | 虚线 |
| `plain` | `boolean` | `false` | 更轻视觉权重 |
| `margin` | `'none' \| 'sm' \| 'md' \| 'lg'` | — | 主轴外边距（Token） |
| `decorative` | `boolean` | `false` | 纯装饰：`aria-hidden`，无 `role="separator"` |
| `ariaLabel` | `string` | — | 地标分隔时的无障碍名称 |

| 插槽 | 说明 |
| --- | --- |
| `default` | 分割线中间文案 |

> 完整 Demo 见 `example/demos/Divider/`。本阶段对外 docs 为薄 API stub；无 Telemetry（纯展示件）。
