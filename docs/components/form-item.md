# FormItem

FormItem 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

FormItem 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

- [Form](./form)
- [InputText](./input-text)
- [Select](./select)
- [Checkbox](./checkbox)

## 基础用法

```vue
<script setup>
import { FormItem } from '@amg-webui/form'
</script>

<template>
  <FormItem />
</template>
```

Curated demo：`example/demos/FormItem/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `prop` | `string` | — | — |
| `label` | `string` | — | 显示文案 / Display label |
| `required` | `boolean` | — | 是否必填 / Required field |
| `labelWidth` | `string` | — | 标签宽度 / Label width |
| `trackId` | `string` | — | Telemetry 追踪 id / Telemetry track id |
| `telemetry` | `boolean` | — | 是否上报 Telemetry / Enable telemetry |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `validate` | `error: string \| null` | — |

## Public types

- `FormItemContext`
- `FormItemProps`
- `FormItemEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/FormItem.json` |

> 完整 Demo 见 `example/demos/FormItem`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
