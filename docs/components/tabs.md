# Tabs 标签页

Tabs 标签页：面向企业场景的 Navigation 组件（成熟度 rc）。

## 组件介绍

Tabs 标签页：面向企业场景的 Navigation 组件（成熟度 rc）。

## 核心特性

- Navigation 家族组件
- v-model 双向绑定
- 事件回调

## 何时使用 / 不适用

**适用**

- 菜单、标签页、面包屑等导航
- 页面结构引导

**不适用**

- 单页极简场景可省略复杂导航组件

## 基础用法

> `import { Tabs } from 'amg-webui/core'`

```vue
<script setup>
import { ref } from 'vue'
import { Tabs, TabPane } from 'amg-webui/core'

const active = ref('a')
</script>

<template>
  <Tabs v-model="active" aria-label="Demo tabs">
    <TabPane name="a" label="Tab A">Content A</TabPane>
    <TabPane name="b" label="Tab B">Content B</TabPane>
  </Tabs>
</template>
```

Curated demo：`example/demos/Tabs/index.vue`

## 示例

<DocsDemo name="tabs-basic" />

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | `undefined` | 绑定值 / Bound value (v-model) |
| `ariaLabel` | `string` | `undefined` | Accessible name for the tablist |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string \| number` | v-model 更新 / v-model update |
| `change` | `value: string \| number` | 值变更 / Change |
| `tabClick` | `value: string \| number, event: MouseEvent \| KeyboardEvent` | tabClick 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `TabsPaneMeta`
- `TabsProps`
- `TabsEmits`
- `TabPaneProps`

## 键盘交互

- 状态：`PASS`
- 按键：`ArrowRight` · `ArrowLeft`
- ArrowRight: ArrowRight activates next tab and emits update:modelValue; ArrowLeft: ArrowLeft activates previous tab and emits update:modelValue

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Tabs uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Tabs RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Tabs client mount OK; no required browser-only top-level in package gate

## 当前限制

- Interactive actions no-op when disabled
- API 尚未冻结，可能随 hardening 批次调整

## 相关组件

- [TabPane](./tab-pane)
- [Menu](./menu)

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/core` |
| metadata | `component-metadata/Tabs.json` |
| API extract | `generated/component-api/Tabs.json` |

> **DocsDemo** 为 docs 站内嵌演示；完整 curated demo 见 `example/demos/Tabs`。

