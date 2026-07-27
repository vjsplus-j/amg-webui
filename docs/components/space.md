# Space 间距

子元素之间的统一间距布局：方向、对齐、换行、分隔插槽。

## 基础用法

```vue
<script setup>
import { Button, Space } from '@amg-webui/components/base'
</script>

<template>
  <Space size="md">
    <Button label="A" />
    <Button label="B" />
    <Button label="C" />
  </Space>
</template>
```

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `size` / `gap` | `Size \| string` | `'md'` | 间距（`xs`–`xl` → `--spacing-*`） |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | 布局轴 |
| `align` | `start \| end \| center \| baseline \| stretch` | — | 交叉轴对齐 |
| `justify` | `start \| end \| center \| space-*` | — | 主轴对齐 |
| `wrap` | `boolean` | 水平默认 `true` | 是否换行 |
| `block` | `boolean` | `false` | 拉伸满宽 |
| `ariaLabel` | `string` | — | 组无障碍名称 |

| 插槽 | 说明 |
| --- | --- |
| `default` | 子节点 |
| `separator` | 子项之间的自定义分隔 |

> 完整 Demo 见 `example/demos/Space/`。本阶段对外 docs 为薄 API stub；无 Telemetry（纯展示件）。
