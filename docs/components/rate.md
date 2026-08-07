# Rate

Rate：面向企业场景的 Input 组件（成熟度 rc）。

## 组件介绍

Rate：面向企业场景的 Input 组件（成熟度 rc）。

## 核心特性

- Input 家族组件
- v-model 双向绑定
- 可一键清空
- 只读模式
- 多尺寸规格
- 事件回调

## 何时使用 / 不适用

**适用**

- 表单文本/数值输入
- 受控与非受控输入场景

**不适用**

- 极复杂富文本编辑请使用 RichText / MdEditor

## 基础用法

> `import { Rate } from 'amg-webui/form'`

```vue
<script setup>
import { Rate } from 'amg-webui/form'
</script>

<template>
  <Rate />
</template>
```

Curated demo：`example/demos/Rate/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | `undefined` | Native id — falls back to FormItem field id when nested |
| `name` | `string` | `undefined` | Native name — falls back to FormItem `prop` when nested |
| `modelValue` | `number` | 0 | 绑定值 / Bound value (v-model) |
| `max` | `number` | 5 | max 数值 |
| `allowHalf` | `boolean` | false | 是否启用 allowHalf |
| `clearable` | `boolean` | false | 可一键清空 / Show clear button |
| `readonly` | `boolean` | false | 是否只读 / Read-only |
| `size` | `RateSize` | `md` | 尺寸：`sm` · `md` · `lg` / Size variant |
| `showScore` | `boolean` | false | 是否启用 showScore |
| `texts` | `string[]` | `() => []` | texts 字符串 |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: number` | v-model 更新 / v-model update |
| `change` | `value: number` | 值变更 / Change |
| `hoverChange` | `value: number \| null` | hoverChange 时触发 |
| `focus` | `event: FocusEvent` | 聚焦 / Focus |
| `blur` | `event: FocusEvent` | 失焦 / Blur |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `RateSize`
- `RateProps`
- `RateEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Rate uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Rate RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Rate client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Rate.json` |
| API extract | `generated/component-api/Rate.json` |

> 完整 Demo 见 `example/demos/Rate`（example 本地调试，不上线）。

