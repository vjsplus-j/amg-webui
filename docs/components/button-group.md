# ButtonGroup 按钮组

将多个 `Button` 编组：统一尺寸 / 语义 / 变体，支持方向与禁用 / 加载级联。

## 基础用法

```vue
<script setup>
import { Button, ButtonGroup } from '@amg-webui/components/base'
</script>

<template>
  <ButtonGroup size="md" severity="primary">
    <Button label="One" />
    <Button label="Two" />
    <Button label="Three" />
  </ButtonGroup>
</template>
```

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `size` | `Size` | — | 级联子按钮尺寸 |
| `severity` / `variant` | 与 Button 同 | — | 级联语义 / 变体 |
| `block` | `boolean` | `false` | 组拉伸满宽 |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | 布局轴 |
| `disabled` / `loading` | `boolean` | `false` | 级联禁用 / 加载 |
| `ariaLabel` | `string` | — | 组无障碍名称 |

| 插槽 | 说明 |
| --- | --- |
| `default` | 子 `Button`（及兼容子项） |

> 完整 Demo 见 `example/demos/ButtonGroup/`。本阶段对外 docs 为薄 API stub。
