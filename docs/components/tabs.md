# Tabs 标签页

基础标签切换：`v-model` 受控、键盘可访问、懒加载面板。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
import { Tabs, TabPane } from '@amg-webui/components/base'

const active = ref('a')
</script>

<template>
  <Tabs v-model="active" aria-label="Demo tabs">
    <TabPane name="a" label="Tab A">Content A</TabPane>
    <TabPane name="b" label="Tab B">Content B</TabPane>
  </Tabs>
</template>
```

## 常用 API（Tabs）

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | — | 当前激活面板 |
| `ariaLabel` | `string` | — | tablist 无障碍名称 |

| 事件 | 说明 |
| --- | --- |
| `update:modelValue` / `change` | 激活项变化 |
| `tabClick` | 点击 / 键盘激活 |

## 常用 API（TabPane）

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `name` | `string \| number` | — | 面板标识（必填） |
| `label` | `string` | — | 标签文案 |
| `disabled` | `boolean` | `false` | 禁用 |
| `lazy` | `boolean` | `false` | 首次激活前不渲染 |

> 完整 Demo 见 `example/demos/Tabs/`。本阶段对外 docs 为薄 API stub。
