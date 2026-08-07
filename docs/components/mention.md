# Mention

Mention：面向企业场景的 Selection 组件（成熟度 rc）。

## 组件介绍

Mention：面向企业场景的 Selection 组件（成熟度 rc）。

## 核心特性

- Selection 家族组件
- v-model 双向绑定
- 选项列表配置
- 占位提示
- 事件回调

## 何时使用 / 不适用

**适用**

- 下拉、级联、树选等选择场景
- 表单字段与筛选器

**不适用**

- 超大数据集未开启虚拟化时可能影响性能

## 基础用法

> `import { Mention } from 'amg-webui/form'`

```vue
<script setup>
import { Mention } from 'amg-webui/form'
</script>

<template>
  <Mention />
</template>
```

Curated demo：`example/demos/Mention/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | `undefined` | Native id — falls back to FormItem field id when nested |
| `name` | `string` | `undefined` | Native name — falls back to FormItem `prop` when nested |
| `modelValue` | `string` | `` | 绑定值 / Bound value (v-model) |
| `options` | `MentionOption[]` | `() => []` | 选项列表 / Option list |
| `prefix` | `string` | `@` | prefix 字符串 |
| `placeholder` | `string` | `undefined` | 占位提示 / Placeholder text |
| `rows` | `number` | 3 | 每页行数 / Rows per page |
| `maxLength` | `number` | `undefined` | maxLength 数值 |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string` | v-model 更新 / v-model update |
| `change` | `value: string` | 值变更 / Change |
| `select` | `option: MentionOption` | 选中 / Select |
| `search` | `query: string` | search 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `MentionOption`
- `MentionProps`
- `MentionEmits`

## 键盘交互

- 状态：`PASS`
- 按键：`ArrowDown` · `Enter`
- ArrowDown: moves highlighted mention option in popup listbox; Enter: inserts active mention option into modelValue

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
- structural DOM clean

## 当前限制

- Interactive actions no-op when disabled
- API 尚未冻结，可能随 hardening 批次调整

## 相关组件

- [Form](./form)
- [FormItem](./form-item)
- [InputText](./input-text)

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/form` |
| metadata | `component-metadata/Mention.json` |
| API extract | `generated/component-api/Mention.json` |

> 完整 Demo 见 `example/demos/Mention`（example 本地调试，不上线）。

