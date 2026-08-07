# Radio 单选框

Radio 单选框：面向企业场景的 Input 组件（成熟度 rc）。

## 组件介绍

Radio 单选框：面向企业场景的 Input 组件（成熟度 rc）。

## 核心特性

- Input 家族组件
- v-model 双向绑定
- 多尺寸规格
- 事件回调

## 何时使用 / 不适用

**适用**

- 表单文本/数值输入
- 受控与非受控输入场景

**不适用**

- 极复杂富文本编辑请使用 RichText / MdEditor

## 基础用法

> `import { Radio } from 'amg-webui/form'`

```vue
<script setup>
import { Radio } from 'amg-webui/form'
</script>

<template>
  <Radio />
</template>
```

Curated demo：`example/demos/Radio/index.vue`

## 示例

<DocsDemo name="radio-basic" />

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `unknown` | `undefined` | 绑定值 / Bound value (v-model) |
| `id` | `string` | `undefined` | 元素 id（无障碍）/ Element id for a11y |
| `value` | `unknown` | **必填** | 表格行数据或绑定值 / Row data or bound value |
| `label` | `string` | `undefined` | 显示文案 / Display label |
| `name` | `string` | `undefined` | 表单字段名 / Form field name |
| `invalid` | `boolean` | `undefined` | 是否启用 invalid |
| `skipFormItem` | `boolean` | false | 是否启用 skipFormItem |
| `size` | `Size` | `undefined` | 尺寸：`sm` · `md` · `lg` / Size variant |

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

- `RadioGroupContext`
- `RadioProps`
- `RadioEmits`

## 键盘交互

- 状态：`PASS`
- 按键：`Space`
- Space: Space on focused Radio selects value and emits update:modelValue; Space: disabled Radio does not emit update:modelValue on Space

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Radio uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Radio RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Radio client mount OK; no required browser-only top-level in package gate

## 当前限制

- Interactive actions no-op when disabled
- API 尚未冻结，可能随 hardening 批次调整

## 相关组件

- [RadioGroup](./radio-group)
- [Form](./form)

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/form` |
| metadata | `component-metadata/Radio.json` |
| API extract | `generated/component-api/Radio.json` |

> **DocsDemo** 为 docs 站内嵌演示；完整 curated demo 见 `example/demos/Radio`。

