# Empty 空状态

列表 / 搜索 / 筛选无结果时的空状态占位。

## 基础用法

```vue
<script setup>
import { Empty } from '@amg-webui/core'
</script>

<template>
  <Empty />
</template>
```

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `description` | `string` | `common.noData` | 描述文案 |
| `title` | `string` | — | 标题 |
| `image` | `string` | — | 自定义插画 URL；失败回退内置 SVG |
| `imageAlt` | `string` | — | 图片无障碍文案 |
| `imageSize` | `Size \| number \| string` | `'md'` | 插画尺寸（Token 优先） |

| 事件 | 说明 |
| --- | --- |
| `imageError` | 自定义图片加载失败（回退前触发） |

| 插槽 | 说明 |
| --- | --- |
| `default` | 底部操作区 |
| `image` / `title` / `description` | 覆盖对应区域 |

> 完整交互与边界场景见本地 example curated demo（`example/demos/Empty/`）。本阶段对外 docs 以薄 API  stub 为主。
