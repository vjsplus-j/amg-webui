# PTZControl

PTZControl：面向企业场景的 Media 组件（成熟度 rc）。

## 组件介绍

PTZControl：面向企业场景的 Media 组件（成熟度 rc）。

## 核心特性

- Media 家族组件
- v-model 双向绑定
- 支持禁用状态
- 事件回调

## 何时使用 / 不适用

**适用**

- 音视频播放与控制
- 监控预览场景

**不适用**

- 非媒体业务无需引入行业包

## 基础用法

> `import { PTZControl } from 'amg-webui/media'`

```vue
<script setup>
import { PTZControl } from 'amg-webui/media'
</script>

<template>
  <PTZControl />
</template>
```

Curated demo：`example/demos/PTZControl/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `PtzCommand \| null` | `undefined` | 绑定值 / Bound value (v-model) |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `speed` | `number` | 4 | speed 数值 |
| `minSpeed` | `number` | 1 | minSpeed 数值 |
| `maxSpeed` | `number` | 8 | maxSpeed 数值 |
| `step` | `number` | 1 | step 数值 |
| `keyboard` | `boolean` | true | 是否启用 keyboard |
| `showAdvanced` | `boolean` | true | 是否启用 showAdvanced |
| `presets` | `number[]` | `() => []` | presets 数值 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `cmd: PtzCommand \| null` | v-model 更新 / v-model update |
| `update:speed` | `value: number` | `speed` 更新时触发（v-model） |
| `command` | `cmd: PtzCommand, payload: PtzCommandPayload` | command 时触发 |
| `change` | `payload: PtzCommandPayload` | 值变更 / Change |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `PtzCommand`
- `PtzCommandPayload`
- `PTZControlProps`
- `PTZControlEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts PTZControl interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`FAIL`
- a11y PASS requires A11Y_STRUCTURE/A11Y_CONTRAST or critical/serious counts (family name alone insufficient)

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts PTZControl uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts PTZControl RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts PTZControl client mount OK; no required browser-only top-level in package gate

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
| import | `amg-webui/media` |
| metadata | `component-metadata/PTZControl.json` |
| API extract | `generated/component-api/PTZControl.json` |

> 完整 Demo 见 `example/demos/PTZControl`（example 本地调试，不上线）。

