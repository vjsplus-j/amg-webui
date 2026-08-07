# FormTabs

FormTabs 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

FormTabs 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

- [Form](./form)
- [FormItem](./form-item)
- [Tabs](./tabs)

## 基础用法

```vue
<script setup>
import { FormTabs } from '@amg-webui/form'
</script>

<template>
  <FormTabs />
</template>
```

Curated demo：`example/demos/FormTabs/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | — | 绑定值 / Bound value (v-model) |
| `tabs` | `FormTabItem[]` | — | — |
| `tabData` | `Record<string, Record<string, unknown>>` | — | — |
| `fieldLabels` | `Record<string, Record<string, string>>` | — | — |
| `rules` | `FormRules` | — | 校验规则 / Validation rules |
| `trackId` | `string` | — | Telemetry 追踪 id / Telemetry track id |
| `telemetry` | `boolean` | — | 是否上报 Telemetry / Enable telemetry |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string \| number` | v-model 更新 / v-model update |
| `update:tabData` | `value: Record<string, Record<string, unknown>>` | — |
| `change` | `name: string \| number` | 值变更 / Change |

## Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

## Public types

- `FormTabItem`
- `FormTabsProps`
- `FormTabsEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/FormTabs.json` |

> 完整 Demo 见 `example/demos/FormTabs`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
