# Search

Search：面向企业场景的 Input 组件（成熟度 rc）。

## 组件介绍

Search：面向企业场景的 Input 组件（成熟度 rc）。

## 核心特性

- Input 家族组件
- v-model 双向绑定
- 占位提示
- 可一键清空
- 多尺寸规格
- 宽度 100%
- 事件回调

## 何时使用 / 不适用

**适用**

- 表单文本/数值输入
- 受控与非受控输入场景

**不适用**

- 极复杂富文本编辑请使用 RichText / MdEditor

## 基础用法

> `import { Search } from 'amg-webui/form'`

```vue
<script setup>
import { Search } from 'amg-webui/form'
</script>

<template>
  <Search />
</template>
```

Curated demo：`example/demos/Search/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `` | 绑定值 / Bound value (v-model) |
| `id` | `string` | `undefined` | Native input id — falls back to FormItem field id when nested |
| `name` | `string` | `undefined` | 表单字段名 / Form field name |
| `placeholder` | `string` | `undefined` | 占位提示 / Placeholder text |
| `clearable` | `boolean` | true | 可一键清空 / Show clear button |
| `size` | `Size` | `md` | 尺寸：`sm` · `md` · `lg` / Size variant |
| `fluid` | `boolean` | `undefined` | 宽度 100% / Full width |
| `invalid` | `boolean` | `undefined` | 是否启用 invalid |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string` | v-model 更新 / v-model update |
| `search` | `value: string` | search 时触发 |
| `clear` | `void` | clear 时触发 |
| `focus` | `event: FocusEvent` | 聚焦 / Focus |
| `blur` | `event: FocusEvent` | 失焦 / Blur |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `SearchProps`
- `SearchEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Search uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Search RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Search client mount OK; no required browser-only top-level in package gate

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
| import | `amg-webui/form` |
| metadata | `component-metadata/Search.json` |
| API extract | `generated/component-api/Search.json` |

> 完整 Demo 见 `example/demos/Search`（example 本地调试，不上线）。

