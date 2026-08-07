# Qrcode

Qrcode：面向企业场景的 Special 组件（成熟度 rc）。

## 组件介绍

Qrcode：面向企业场景的 Special 组件（成熟度 rc）。

## 核心特性

- Special 家族组件
- v-model 双向绑定
- 多尺寸规格
- 支持禁用状态
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- 特殊场景组件
- 业务定制页面块
- 需要禁用/只读控制的表单场景
- 异步提交或加载过程反馈

**不适用**

- 通用场景优先 foundation 组件

## 基础用法

> `import { Qrcode } from 'amg-webui/core'`

```vue
<script setup>
import { Qrcode } from 'amg-webui/core'
</script>

<template>
  <Qrcode />
</template>
```

Curated demo：`example/demos/Qrcode/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | `` | 绑定值 / Bound value (v-model) |
| `value` | `string \| number` | `` | 表格行数据或绑定值 / Row data or bound value |
| `size` | `number` | `undefined` | 尺寸：`sm` · `md` · `lg` / Size variant |
| `pixelSize` | `number` | 4 | pixelSize 数值 |
| `standard` | `QrcodeStandard` | `iso` | QR Code standard profile. |
| `errorCorrection` | `QrcodeErrorCorrectionLevel` | `undefined` | QR Code error correction level. |
| `quietZone` | `number` | 8 | Quiet-zone padding around the generated symbol. |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |
| `editable` | `boolean` | true | 是否启用 editable |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `loading` | `boolean` | false | 加载中状态 / Loading state |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string` | v-model 更新 / v-model update |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `QrcodeProps`
- `QrcodeEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts Qrcode interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Qrcode uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Qrcode RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Qrcode client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Qrcode.json` |
| API extract | `generated/component-api/Qrcode.json` |

> 完整 Demo 见 `example/demos/Qrcode`（example 本地调试，不上线）。

