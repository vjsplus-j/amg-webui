# Preview

Preview：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Preview：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- v-model 双向绑定
- 支持禁用状态
- 事件回调

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件
- 需要禁用/只读控制的表单场景

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { Preview } from 'amg-webui/core'`

```vue
<script setup>
import { Preview } from 'amg-webui/core'
</script>

<template>
  <Preview />
</template>
```

Curated demo：`example/demos/Preview/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number` | `undefined` | 绑定值 / Bound value (v-model) |
| `zoom` | `number` | 1 | zoom 数值 |
| `minZoom` | `number` | 0.25 | minZoom 数值 |
| `maxZoom` | `number` | 3 | maxZoom 数值 |
| `step` | `number` | 0.1 | step 数值 |
| `fullscreen` | `boolean` | false | 是否启用 fullscreen |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `keyboard` | `boolean` | true | 是否启用 keyboard |
| `rotatable` | `boolean` | true | 是否启用 rotatable |
| `showToolbar` | `boolean` | true | 是否启用 showToolbar |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: number` | v-model 更新 / v-model update |
| `update:zoom` | `value: number` | `zoom` 更新时触发（v-model） |
| `update:fullscreen` | `value: boolean` | `fullscreen` 更新时触发（v-model） |
| `zoom-change` | `value: number` | zoom-change 时触发 |
| `fullscreen-change` | `value: boolean` | fullscreen-change 时触发 |
| `rotate` | `value: number` | rotate 时触发 |
| `reset` | `void` | reset 时触发 |
| `change` | `payload: { zoom: number; fullscreen: boolean; rotation: number }` | 值变更 / Change |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `PreviewProps`
- `PreviewEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts Preview interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Preview uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Preview RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Preview client mount OK; no required browser-only top-level in package gate

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
| import | `amg-webui/core` |
| metadata | `component-metadata/Preview.json` |
| API extract | `generated/component-api/Preview.json` |

> 完整 Demo 见 `example/demos/Preview`（example 本地调试，不上线）。

