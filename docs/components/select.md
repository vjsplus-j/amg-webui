# Select

Select 为 **Stable** 公共组件（API frozen）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

Select 已通过 Component Hardening 证据门禁；完整交互演示见本地 example curated demo。

## 何时使用 / 何时不用

- **适用**：生产可用的 Stable 组件场景。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

- [Form](./form)
- [FormItem](./form-item)
- [SelectNav](./select-nav)
- [TreeSelect](./tree-select)
- [Cascader](./cascader)

## 基础用法

```vue
<script setup>
import { Select } from '@amg-webui/form'
</script>

<template>
  <Select />
</template>
```

Curated demo：`example/demos/Select/index.vue`

## 交互演示

<DocsDemo name="select-basic" />

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | — | 元素 id（无障碍）/ Element id for a11y |
| `name` | `string` | — | 表单字段名 / Form field name |
| `modelValue` | `SelectModelValue` | — | 绑定值 / Bound value (v-model) |
| `options` | `SelectOption[]` | — | 选项列表 / Option list |
| `placeholder` | `string` | — | 占位提示 / Placeholder text |
| `disabled` | `boolean` | — | 是否禁用 / Whether disabled |
| `readonly` | `boolean` | — | 是否只读 / Read-only |
| `filterable` | `boolean` | — | — |
| `clearable` | `boolean` | — | 可一键清空 / Show clear button |
| `invalid` | `boolean` | — | — |
| `size` | `Size` | — | 尺寸：`sm` · `md` · `lg` / Size variant |
| `fluid` | `boolean` | — | 宽度 100% / Full width |
| `width` | `string` | — | — |
| `panelClass` | `string` | — | — |
| `panelStyle` | `Record<string, string>` | — | — |
| `multiple` | `boolean` | — | 多选模式 / Multiple selection |
| `collapseTags` | `boolean` | — | — |
| `maxCollapseTags` | `number` | — | — |
| `virtual` | `boolean` | — | 虚拟滚动 / Virtual scrolling |
| `virtualThreshold` | `number` | — | — |
| `filterDebounce` | `number` | — | 筛选防抖毫秒 / Filter debounce (ms) |
| `remote` | `boolean` | — | — |
| `remoteMethod` | `( query: string, context: SelectRemoteContext, ) => void \| SelectOption[] \| Promise<void \| SelectOption[]>` | — | — |
| `loading` | `boolean` | — | 加载中状态 / Loading state |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: SelectModelValue` | v-model 更新 / v-model update |
| `change` | `event: { originalEvent: Event; value: SelectModelValue }` | 值变更 / Change |
| `focus` | `event: FocusEvent` | 聚焦 / Focus |
| `blur` | `event: FocusEvent` | 失焦 / Blur |
| `show` | `void` | — |
| `hide` | `void` | — |
| `clear` | `void` | — |
| `remove-tag` | `value: string \| number` | — |
| `remote-error` | `error: Error, query: string` | — |

## Slots

| Slot | Props | 说明 |
| --- | --- | --- |
| `default` | `props: Record<string, never>` | — |
| `option` | `props: { option: SelectOption }` | — |
| `empty` | `props: Record<string, never>` | — |
| `loading` | `props: Record<string, never>` | — |

## Expose

| Expose | 类型 | 说明 |
| --- | --- | --- |
| `focus` | `() => void` | — |
| `blur` | `() => void` | — |
| `open` | `() => void` | — |
| `close` | `() => void` | — |
| `clear` | `() => void` | — |

## Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

## Public types

- `SelectModelValue`
- `SelectInstance`
- `SelectRemoteContext`
- `SelectProps`
- `SelectEmits`
- `SelectSlots`
- `SelectExpose`

## 无障碍与键盘

交互行为与键盘路径以 `component-hardening/evidence/Select/a11y.json` · `keyboard.json` 为准；本地可复现：`example/demos/Select/`。

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `stable` |
| apiFreeze | `frozen` |
| API extract | `generated/component-api/Select.json` |

> 上方 **DocsDemo** 为 docs 站内嵌交互演示。完整 curated demo 见 `example/demos/Select`。
