# AutoComplete 自动完成

AutoComplete 自动完成：面向企业场景的 Selection 组件（成熟度 rc）。

## 组件介绍

AutoComplete 自动完成：面向企业场景的 Selection 组件（成熟度 rc）。

## 核心特性

- Selection 家族组件
- v-model 双向绑定
- 占位提示
- 多尺寸规格
- 宽度 100%
- 事件回调
- 插槽自定义
- 实例方法暴露

## 何时使用 / 不适用

**适用**

- 下拉、级联、树选等选择场景
- 表单字段与筛选器

**不适用**

- 超大数据集未开启虚拟化时可能影响性能

## 基础用法

> `import { AutoComplete } from 'amg-webui/form'`

```vue
<script setup>
import { AutoComplete } from 'amg-webui/form'
</script>

<template>
  <AutoComplete />
</template>
```

Curated demo：`example/demos/AutoComplete/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `` | 绑定值 / Bound value (v-model) |
| `id` | `string` | `undefined` | 元素 id（无障碍）/ Element id for a11y |
| `name` | `string` | `undefined` | 表单字段名 / Form field name |
| `invalid` | `boolean` | `undefined` | 是否启用 invalid |
| `suggestions` | `AutoCompleteSuggestion[]` | `() => []` | suggestions 列表数据 |
| `placeholder` | `string` | `undefined` | 占位提示 / Placeholder text |
| `debounce` | `number` | 300 | debounce 数值 |
| `size` | `Size` | `md` | 尺寸：`sm` · `md` · `lg` / Size variant |
| `fluid` | `boolean` | `undefined` | 宽度 100% / Full width |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string` | v-model 更新 / v-model update |
| `select` | `value: string` | 选中 / Select |
| `focus` | `event: FocusEvent` | 聚焦 / Focus |
| `blur` | `event: FocusEvent` | 失焦 / Blur |

### Slots

| Slot | Props | 说明 |
| --- | --- | --- |
| `default` | `props: Record<string, never>` | Trailing auxiliary content beside the control |
| `option` | `props: { item: { value: string; label: string }; index: number }` | Custom suggestion row in the dropdown |
| `empty` | `props: Record<string, never>` | Empty state when no suggestions match |
| `loading` | `props: Record<string, never>` | Loading indicator while remote suggestions load |

### Expose

| 方法 / 属性 | 类型 | 说明 |
| --- | --- | --- |
| `focus` | `() => void` | focus 实例方法/属性 |
| `blur` | `() => void` | blur 实例方法/属性 |
| `open` | `() => void` | open 实例方法/属性 |
| `close` | `() => void` | close 实例方法/属性 |
| `clear` | `() => void` | clear 实例方法/属性 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `AutoCompleteSuggestion`
- `AutoCompleteProps`
- `AutoCompleteEmits`
- `AutoCompleteSlots`
- `AutoCompleteExpose`

## 键盘交互

- 状态：`PASS`
- 按键：`ArrowDown` · `Enter` · `Escape`
- ArrowDown: moves highlighted suggestion in open panel; Enter: selects active suggestion and emits update:modelValue; Escape: closes autocomplete suggestion panel

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
- [Select](./select)

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/form` |
| metadata | `component-metadata/AutoComplete.json` |
| API extract | `generated/component-api/AutoComplete.json` |

> 完整 Demo 见 `example/demos/AutoComplete`（example 本地调试，不上线）。

