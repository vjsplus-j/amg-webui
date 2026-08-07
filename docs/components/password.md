# Password

Password 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

Password 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

- [Form](./form)
- [FormItem](./form-item)
- [InputText](./input-text)

## 基础用法

```vue
<script setup>
import { Password } from '@amg-webui/form'
</script>

<template>
  <Password />
</template>
```

Curated demo：`example/demos/Password/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | — | 绑定值 / Bound value (v-model) |
| `id` | `string` | — | 元素 id（无障碍）/ Element id for a11y |
| `name` | `string` | — | 表单字段名 / Form field name |
| `autocomplete` | `string` | — | — |
| `ariaLabel` | `string` | — | 无障碍标签 / ARIA label |
| `showToggle` | `boolean` | — | — |
| `placeholder` | `string` | — | 占位提示 / Placeholder text |
| `size` | `Size` | — | 尺寸：`sm` · `md` · `lg` / Size variant |
| `fluid` | `boolean` | — | 宽度 100% / Full width |
| `invalid` | `boolean` | — | — |
| `readonly` | `boolean` | — | 是否只读 / Read-only |
| `maxlength` | `number` | — | 最大长度 / Max length |
| `sanitizeInput` | `boolean \| 'blur' \| 'input' \| 'off'` | — | — |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string` | v-model 更新 / v-model update |
| `input` | `event: Event` | 输入 / Input |
| `change` | `event: Event` | 值变更 / Change |
| `focus` | `event: FocusEvent` | 聚焦 / Focus |
| `blur` | `event: FocusEvent` | 失焦 / Blur |

## Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

## Public types

- `PasswordProps`
- `PasswordEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/Password.json` |

> 完整 Demo 见 `example/demos/Password`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
