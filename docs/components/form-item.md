# FormItem

FormItem：面向企业场景的 Form 组件（成熟度 rc）。

## 组件介绍

FormItem：面向企业场景的 Form 组件（成熟度 rc）。

## 核心特性

- Form 家族组件
- 事件回调

## 何时使用 / 不适用

**适用**

- 表单布局、校验与字段编排
- 动态/分步表单

**不适用**

- 纯展示场景无需引入完整 Form

## 基础用法

> `import { FormItem } from 'amg-webui/form'`

```vue
<script setup>
import { FormItem } from 'amg-webui/form'
</script>

<template>
  <FormItem />
</template>
```

Curated demo：`example/demos/FormItem/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `prop` | `string` | `undefined` | prop 字符串 |
| `label` | `string` | `undefined` | 显示文案 / Display label |
| `required` | `boolean` | `undefined` | 是否必填 / Required field |
| `labelWidth` | `string` | `undefined` | 标签宽度 / Label width |
| `trackId` | `string` | `undefined` | Telemetry 追踪 id / Telemetry track id |
| `telemetry` | `boolean` | `undefined` | 是否上报 Telemetry / Enable telemetry |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `validate` | `error: string \| null` | validate 时触发 |

### Public Types

- `FormItemContext`
- `FormItemProps`
- `FormItemEmits`

## 键盘交互

- 状态：`N/A`
- FormItem is a label/layout wrapper; keyboard interaction is delegated to slotted controls — no standalone keyboard contract

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
- [InputText](./input-text)
- [Select](./select)
- [Checkbox](./checkbox)

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/form` |
| metadata | `component-metadata/FormItem.json` |
| API extract | `generated/component-api/FormItem.json` |

> 完整 Demo 见 `example/demos/FormItem`（example 本地调试，不上线）。

