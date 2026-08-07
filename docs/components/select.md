# Select 选择器

Select 选择器：面向企业场景的 Selection 组件（成熟度 rc）。

## 组件介绍

Select 选择器：面向企业场景的 Selection 组件（成熟度 rc）。

## 核心特性

- Selection 家族组件
- v-model 双向绑定
- 选项列表配置
- 占位提示
- 支持禁用状态
- 只读模式
- 可筛选
- 可一键清空
- 多尺寸规格
- 宽度 100%
- 多选模式
- 虚拟滚动
- 加载状态反馈
- 事件回调
- 插槽自定义
- 实例方法暴露

## 何时使用 / 不适用

**适用**

- 下拉、级联、树选等选择场景
- 表单字段与筛选器
- 需要禁用/只读控制的表单场景
- 异步提交或加载过程反馈
- 大数据量列表/表格性能场景

**不适用**

- 超大数据集未开启虚拟化时可能影响性能

## 基础用法

> `import { Select } from 'amg-webui/form'`

```vue
<script setup>
import { Select } from 'amg-webui/form'
</script>

<template>
  <Select />
</template>
```

Curated demo：`example/demos/Select/index.vue`

## 示例

<DocsDemo name="select-basic" />

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | `undefined` | Native id — falls back to FormItem field id when nested |
| `name` | `string` | `undefined` | Native name — falls back to FormItem `prop` when nested |
| `modelValue` | `SelectModelValue` | `undefined` | v-model — scalar for single mode, array for `multiple` |
| `options` | `SelectOption[]` | `() => []` | Option list rendered in the dropdown |
| `placeholder` | `string` | `undefined` | Placeholder when nothing is selected |
| `disabled` | `boolean` | `undefined` | 是否禁用 / Whether disabled |
| `readonly` | `boolean` | `undefined` | 是否只读 / Read-only |
| `filterable` | `boolean` | `undefined` | Local filter on option labels |
| `clearable` | `boolean` | `undefined` | Show clear control when a value is present |
| `invalid` | `boolean` | `undefined` | 是否启用 invalid |
| `size` | `Size` | `md` | 尺寸：`sm` · `md` · `lg` / Size variant |
| `fluid` | `boolean` | `undefined` | Stretch to container width |
| `width` | `string` | `undefined` | width 字符串 |
| `panelClass` | `string` | `undefined` | panelClass 字符串 |
| `panelStyle` | `Record<string, string>` | `undefined` | panelStyle 字符串 |
| `multiple` | `boolean` | `undefined` | Multi-select mode — `modelValue` becomes `(string \| number)[]`. Dropdown stays open after each pick; selected values render as tags. |
| `collapseTags` | `boolean` | `undefined` | Collapse excess tags to `+N` (multiple mode only). |
| `maxCollapseTags` | `number` | 1 | Max visible tags before collapse when `collapseTags` is true. |
| `virtual` | `boolean` | `undefined` | Enable virtual scrolling in the dropdown. When `undefined`, auto-enables when option count exceeds `virtualThreshold`. Set `false` to force full DOM render. |
| `virtualThreshold` | `number` | 60 | Option count threshold for auto virtual scroll. |
| `filterDebounce` | `number` | 200 | Delay local and remote filtering to avoid repeated large-list work. @default 200 |
| `remote` | `boolean` | `undefined` | Remote search — skips local filtering; call `remoteMethod` on filter input. Implies filterable search input when open. |
| `remoteMethod` | `( query: string, context: SelectRemoteContext, ) => void \| SelectOption[] \| Promise<void \| SelectOption[]>` | `undefined` | Invoked with the current filter query when `remote` is true. Returning options enables built-in latest-request-wins handling; returning void remains compatible with externally controlled `options`. |
| `loading` | `boolean` | `undefined` | Loading indicator while remote options are fetched |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: SelectModelValue` | v-model 更新 / v-model update |
| `change` | `event: { originalEvent: Event; value: SelectModelValue }` | 值变更 / Change |
| `focus` | `event: FocusEvent` | 聚焦 / Focus |
| `blur` | `event: FocusEvent` | 失焦 / Blur |
| `show` | `void` | show 时触发 |
| `hide` | `void` | hide 时触发 |
| `clear` | `void` | clear 时触发 |
| `remove-tag` | `value: string \| number` | Fired when a tag is removed in multiple mode |
| `remote-error` | `error: Error, query: string` | Fired for a non-abort remote lookup failure. |

### Slots

| Slot | Props | 说明 |
| --- | --- | --- |
| `default` | `props: Record<string, never>` | Trailing auxiliary content beside the control |
| `option` | `props: { option: SelectOption }` | Custom option row in the dropdown |
| `empty` | `props: Record<string, never>` | Empty state when no options match |
| `loading` | `props: Record<string, never>` | Loading indicator while remote options load |

### Expose

| 方法 / 属性 | 类型 | 说明 |
| --- | --- | --- |
| `focus` | `() => void` | Focus the trigger input |
| `blur` | `() => void` | Blur the trigger input |
| `open` | `() => void` | Open the dropdown panel |
| `close` | `() => void` | Close the dropdown panel |
| `clear` | `() => void` | Clear the current selection |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `SelectModelValue`
- `SelectInstance`
- `SelectRemoteContext`
- `SelectProps`
- `SelectEmits`
- `SelectSlots`
- `SelectExpose`

## 键盘交互

- 状态：`PASS`
- 按键：`ArrowDown` · `Enter` · `Escape`
- ArrowDown: moves highlighted active option in open listbox; Enter: selects active option and emits update:modelValue; Escape: closes listbox and sets aria-expanded false

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
- [SelectNav](./select-nav)
- [TreeSelect](./tree-select)
- [Cascader](./cascader)

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/form` |
| metadata | `component-metadata/Select.json` |
| API extract | `generated/component-api/Select.json` |

> **DocsDemo** 为 docs 站内嵌演示；完整 curated demo 见 `example/demos/Select`。

