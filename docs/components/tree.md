# Tree 树形控件

Tree 树形控件：面向企业场景的 Tree 组件（成熟度 rc）。

## 组件介绍

Tree 树形控件：面向企业场景的 Tree 组件（成熟度 rc）。

## 核心特性

- Tree 家族组件
- 虚拟滚动
- 事件回调
- v-model 双向绑定

## 何时使用 / 不适用

**适用**

- 层级数据展示与勾选
- 目录/组织架构
- 大数据量列表/表格性能场景

**不适用**

- 扁平列表请用 Table / List

## 基础用法

> `import { Tree } from 'amg-webui/data'`

```vue
<script setup>
import { Tree } from 'amg-webui/data'
</script>

<template>
  <Tree />
</template>
```

Curated demo：`example/demos/Tree/index.vue`

## 示例

<DocsDemo name="tree-basic" />

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `virtual` | `boolean` | `undefined` | Force virtual scroll on/off. When omitted it auto-enables above `virtualThreshold`. |
| `virtualThreshold` | `number` | 100 | virtualThreshold 数值 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: unknown` | v-model 更新 / v-model update |
| `change` | `value: unknown` | 值变更 / Change |
| `node-click` | `node: TreeNode` | node-click 时触发 |
| `check-change` | `node: TreeNode, checked: boolean, indeterminate: boolean,` | check-change 时触发 |
| `node-expand` | `node: TreeNode` | node-expand 时触发 |
| `node-collapse` | `node: TreeNode` | node-collapse 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `BaseTreeProps`
- `TreeProps`
- `TreeEmits`
- `VirtualTreeProps`
- `VirtualTreeEmits`
- `LazyTreeProps`
- `LazyTreeEmits`

## 键盘交互

- 状态：`PASS`
- 按键：`ArrowDown` · `ArrowUp` · `ArrowRight`
- ArrowDown: moves active tree row highlight; ArrowUp: moves active tree row highlight upward; ArrowRight: expands active parent node and sets aria-expanded true

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Tree uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Tree RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Tree client mount OK; no required browser-only top-level in package gate

## 当前限制

- Interactive actions no-op when disabled
- API 尚未冻结，可能随 hardening 批次调整

## 相关组件

- [TreeSelect](./tree-select)
- [TreeTable](./tree-table)

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/data` |
| metadata | `component-metadata/Tree.json` |
| API extract | `generated/component-api/Tree.json` |

> **DocsDemo** 为 docs 站内嵌演示；完整 curated demo 见 `example/demos/Tree`。

