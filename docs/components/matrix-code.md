# MatrixCode

MatrixCode：面向企业场景的 Special 组件（成熟度 rc）。

## 组件介绍

MatrixCode：面向企业场景的 Special 组件（成熟度 rc）。

## 核心特性

- Special 家族组件
- v-model 双向绑定
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

> `import { MatrixCode } from 'amg-webui/core'`

```vue
<script setup>
import { MatrixCode } from 'amg-webui/core'
</script>

<template>
  <MatrixCode />
</template>
```

Curated demo：`example/demos/MatrixCode/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | `` | 绑定值 / Bound value (v-model) |
| `value` | `string \| number` | `` | 表格行数据或绑定值 / Row data or bound value |
| `format` | `MatrixCodeFormat` | `qrcode` | Two-dimensional or stacked barcode symbology. |
| `pixelSize` | `number` | 4 | Module pixel scale. |
| `quietZone` | `number` | 8 | Quiet-zone padding around the generated symbol. |
| `errorCorrection` | `MatrixCodeErrorCorrection` | `undefined` | Format-specific error correction: QR L/M/Q/H, PDF417 0-8, Ultracode EC1-EC5. |
| `version` | `string \| number` | `undefined` | Optional format-specific version, e.g. rMQR R17x43. |
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

- `MatrixCodeProps`
- `MatrixCodeEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts MatrixCode interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts MatrixCode uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts MatrixCode RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts MatrixCode client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/MatrixCode.json` |
| API extract | `generated/component-api/MatrixCode.json` |

> 完整 Demo 见 `example/demos/MatrixCode`（example 本地调试，不上线）。

