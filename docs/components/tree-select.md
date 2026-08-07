# TreeSelect 树形选择

TreeSelect 树形选择：面向企业场景的 Selection 组件（成熟度 rc）。

## 组件介绍

TreeSelect 树形选择：面向企业场景的 Selection 组件（成熟度 rc）。

## 核心特性

- Selection 家族组件
- v-model 双向绑定
- 选项列表配置
- 占位提示
- 可筛选
- 可一键清空
- 多选模式
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- 下拉、级联、树选等选择场景
- 表单字段与筛选器
- 异步提交或加载过程反馈

**不适用**

- 超大数据集未开启虚拟化时可能影响性能

## 基础用法

> `import { TreeSelect } from 'amg-webui/data'`

```vue
<script setup>
import { TreeSelect } from 'amg-webui/data'
</script>

<template>
  <TreeSelect />
</template>
```

Curated demo：`example/demos/TreeSelect/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | `undefined` | Native id — falls back to FormItem field id when nested |
| `name` | `string` | `undefined` | Native name — falls back to FormItem `prop` when nested |
| `modelValue` | `unknown` | `undefined` | 绑定值 / Bound value (v-model) |
| `options` | `TreeSelectOption[]` | `() => []` | 选项列表 / Option list |
| `placeholder` | `string` | `undefined` | 占位提示 / Placeholder text |
| `filterable` | `boolean` | false | 是否启用 filterable |
| `clearable` | `boolean` | false | 可一键清空 / Show clear button |
| `multiple` | `boolean` | false | 多选模式 / Multiple selection |
| `showCheckbox` | `boolean` | false | Show tree checkboxes (implies cascade when multiple). |
| `checkStrictly` | `boolean` | false | 是否启用 checkStrictly |
| `loading` | `boolean` | false | Show loading state in the dropdown panel |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: unknown` | v-model 更新 / v-model update |
| `change` | `value: unknown` | 值变更 / Change |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `TreeSelectOption`
- `TreeSelectProps`
- `TreeSelectEmits`

## 键盘交互

- 状态：`PASS`
- 按键：`ArrowDown` · `Enter`
- ArrowDown: opens panel and moves highlighted tree node; Enter: selects focused node and emits update:modelValue

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`N/A`
- optional

## RTL

- 状态：`N/A`
- optional

## SSR

- 状态：`PASS`
- structural DOM + component entry

## 当前限制

- Interactive actions no-op when disabled
- API 尚未冻结，可能随 hardening 批次调整

## 相关组件

- [Form](./form)
- [FormItem](./form-item)
- [Select](./select)
- [Tree](./tree)

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/data` |
| metadata | `component-metadata/TreeSelect.json` |
| API extract | `generated/component-api/TreeSelect.json` |

> 完整 Demo 见 `example/demos/TreeSelect`（example 本地调试，不上线）。

