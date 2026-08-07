# TreeChart

TreeChart：面向企业场景的 Charts 组件（成熟度 rc）。

## 组件介绍

TreeChart：面向企业场景的 Charts 组件（成熟度 rc）。

## 核心特性

- Charts 家族组件
- v-model 双向绑定
- 支持禁用状态
- 加载状态反馈
- 选项列表配置
- 事件回调

## 何时使用 / 不适用

**适用**

- 统计图表可视化
- 仪表盘指标展示

**不适用**

- 极简单数值用 Statistic

## 基础用法

> `import { TreeChart } from 'amg-webui/charts'`

```vue
<script setup>
import { TreeChart } from 'amg-webui/charts'
</script>

<template>
  <TreeChart />
</template>
```

Curated demo：`example/demos/TreeChart/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `undefined` | 标题 / Title |
| `description` | `string` | `undefined` | description 字符串 |
| `data` | `unknown` | `undefined` | 树形数据 / Tree data |
| `modelValue` | `unknown` | `undefined` | 绑定值 / Bound value (v-model) |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `options` | `TreeNode[]` | `() => []` | 选项列表 / Option list |
| `emptyText` | `string` | `undefined` | emptyText 字符串 |
| `selectable` | `boolean` | true | 是否启用 selectable |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string` | v-model 更新 / v-model update |
| `change` | `value: TreeNode` | 值变更 / Change |
| `select` | `value: TreeNode, event?: MouseEvent \| KeyboardEvent` | 选中 / Select |
| `click` | `event: MouseEvent` | 点击 / Click |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `TreeChartProps`
- `TreeChartEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts TreeChart non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts TreeChart uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts TreeChart RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts TreeChart client mount OK; no required browser-only top-level in package gate

## 当前限制

- Interactive actions no-op when disabled
- API 尚未冻结，可能随 hardening 批次调整

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/charts` |
| metadata | `component-metadata/TreeChart.json` |
| API extract | `generated/component-api/TreeChart.json` |

> 完整 Demo 见 `example/demos/TreeChart`（example 本地调试，不上线）。

