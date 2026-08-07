# Textarea

Textarea 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

Textarea 当前成熟度为 **RC**；完整交互见本地 example。

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
import { Textarea } from '@amg-webui/form'
</script>

<template>
  <Textarea />
</template>
```

Curated demo：`example/demos/Textarea/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | — | 绑定值 / Bound value (v-model) |
| `id` | `string` | — | 元素 id（无障碍）/ Element id for a11y |
| `name` | `string` | — | 表单字段名 / Form field name |
| `autocomplete` | `string` | — | — |
| `ariaLabel` | `string` | — | 无障碍标签 / ARIA label |
| `placeholder` | `string` | — | 占位提示 / Placeholder text |
| `disabled` | `boolean` | — | 是否禁用 / Whether disabled |
| `readonly` | `boolean` | — | 是否只读 / Read-only |
| `maxlength` | `number` | — | 最大长度 / Max length |
| `rows` | `number` | — | 每页行数 / Rows per page |
| `cols` | `number` | — | — |
| `size` | `Size` | — | 尺寸：`sm` · `md` · `lg` / Size variant |
| `invalid` | `boolean` | — | — |
| `fluid` | `boolean` | — | 宽度 100% / Full width |
| `autoResize` | `boolean` | — | — |
| `showCounter` | `boolean` | — | — |
| `sanitizeInput` | `boolean \| 'blur' \| 'input' \| 'off'` | — | — |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `keydown` | `event: KeyboardEvent` | — |
| `keyup` | `event: KeyboardEvent` | — |

## Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

## Public types

- `TextareaProps`
- `TextareaEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/Textarea.json` |

> 完整 Demo 见 `example/demos/Textarea`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
