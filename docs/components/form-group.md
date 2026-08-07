# FormGroup

FormGroup 为 **Stable** 公共组件（API frozen）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

FormGroup 已通过 Component Hardening 证据门禁；完整交互演示见本地 example curated demo。

## 何时使用 / 何时不用

- **适用**：生产可用的 Stable 组件场景。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

- [Form](./form)
- [FormItem](./form-item)

## 基础用法

```vue
<script setup>
import { FormGroup } from '@amg-webui/form'
</script>

<template>
  <FormGroup />
</template>
```

Curated demo：`example/demos/FormGroup/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | — | — |
| `collapsible` | `boolean` | — | — |
| `collapsed` | `boolean` | — | — |
| `trackId` | `string` | — | — |
| `telemetry` | `boolean` | — | — |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:collapsed` | `value: boolean` | — |
| `toggle` | `collapsed: boolean` | — |

## Public types

- `FormGroupProps`
- `FormGroupEmits`

## 无障碍与键盘

交互行为与键盘路径以 `component-hardening/evidence/FormGroup/a11y.json` · `keyboard.json` 为准；本地可复现：`example/demos/FormGroup/`。

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `stable` |
| apiFreeze | `frozen` |
| API extract | `generated/component-api/FormGroup.json` |

> 完整 Demo 见 `example/demos/FormGroup`。对外 docs 为 API 导向页面；交互预览仅在本地 example（不上线）。
