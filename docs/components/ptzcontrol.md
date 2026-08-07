# PTZControl

PTZControl 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

PTZControl 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { PTZControl } from '@amg-webui/media'
</script>

<template>
  <PTZControl />
</template>
```

Curated demo：`example/demos/PTZControl/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `PtzCommand \| null` | — | 绑定值 / Bound value (v-model) |
| `disabled` | `boolean` | — | 是否禁用 / Whether disabled |
| `speed` | `number` | — | — |
| `minSpeed` | `number` | — | — |
| `maxSpeed` | `number` | — | — |
| `step` | `number` | — | — |
| `keyboard` | `boolean` | — | — |
| `showAdvanced` | `boolean` | — | — |
| `presets` | `number[]` | — | — |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `cmd: PtzCommand \| null` | v-model 更新 / v-model update |
| `update:speed` | `value: number` | — |
| `command` | `cmd: PtzCommand, payload: PtzCommandPayload` | — |
| `change` | `payload: PtzCommandPayload` | 值变更 / Change |

## Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

## Public types

- `PtzCommand`
- `PtzCommandPayload`
- `PTZControlProps`
- `PTZControlEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/PTZControl.json` |

> 完整 Demo 见 `example/demos/PTZControl`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
