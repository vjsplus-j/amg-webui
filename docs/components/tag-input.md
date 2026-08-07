# TagInput

TagInput：面向企业场景的 Input 组件（成熟度 rc）。

## 组件介绍

TagInput：面向企业场景的 Input 组件（成熟度 rc）。

## 核心特性

- Input 家族组件
- v-model 双向绑定
- 占位提示
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

> `import { TagInput } from 'amg-webui/form'`

```vue
<script setup>
import { TagInput } from 'amg-webui/form'
</script>

<template>
  <TagInput />
</template>
```

Curated demo：`example/demos/TagInput/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string[]` | `() => []` | 绑定值 / Bound value (v-model) |
| `id` | `string` | `undefined` | 元素 id（无障碍）/ Element id for a11y |
| `invalid` | `boolean` | `undefined` | 是否启用 invalid |
| `max` | `number` | `undefined` | max 数值 |
| `unique` | `boolean` | true | 是否启用 unique |
| `placeholder` | `string` | `undefined` | 占位提示 / Placeholder text |
| `size` | `Size` | `md` | 尺寸：`sm` · `md` · `lg` / Size variant |
| `fluid` | `boolean` | `undefined` | 宽度 100% / Full width |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string[]` | v-model 更新 / v-model update |
| `add` | `value: string` | add 时触发 |
| `remove` | `value: string` | 移除文件 / Remove file |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `TagInputProps`
- `TagInputEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts TagInput uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts TagInput RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts TagInput client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/TagInput.json` |
| API extract | `generated/component-api/TagInput.json` |

> 完整 Demo 见 `example/demos/TagInput`（example 本地调试，不上线）。

