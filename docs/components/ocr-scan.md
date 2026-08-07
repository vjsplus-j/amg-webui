# OcrScan

OcrScan：面向企业场景的 Special 组件（成熟度 rc）。

## 组件介绍

OcrScan：面向企业场景的 Special 组件（成熟度 rc）。

## 核心特性

- Special 家族组件
- v-model 双向绑定
- 支持禁用状态
- 事件回调

## 何时使用 / 不适用

**适用**

- 特殊场景组件
- 业务定制页面块
- 需要禁用/只读控制的表单场景

**不适用**

- 通用场景优先 foundation 组件

## 基础用法

> `import { OcrScan } from 'amg-webui/core'`

```vue
<script setup>
import { OcrScan } from 'amg-webui/core'
</script>

<template>
  <OcrScan />
</template>
```

Curated demo：`example/demos/OcrScan/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `` | 绑定值 / Bound value (v-model) |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `accept` | `string` | `image/*` | 接受的文件类型 / Accepted file types |
| `maxFileSize` | `number` | `10 * 1024 * 1024` | maxFileSize 数值 |
| `maxPreviewWidth` | `number` | 640 | maxPreviewWidth 数值 |
| `showPreview` | `boolean` | true | 是否启用 showPreview |
| `autoScan` | `boolean` | true | 是否启用 autoScan |
| `recognizer` | `OcrRecognizer` | `undefined` | recognizer 配置项 |
| `label` | `string` | `undefined` | 显示文案 / Display label |
| `scanText` | `string` | `undefined` | scanText 字符串 |
| `emptyText` | `string` | `undefined` | emptyText 字符串 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `text: string` | v-model 更新 / v-model update |
| `scan` | `text: string, result: OcrScanResult` | scan 时触发 |
| `ready` | `context: OcrScanContext` | ready 时触发 |
| `error` | `error: Error` | error 时触发 |
| `change` | `file: File \| null` | 值变更 / Change |
| `reset` | `void` | reset 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `OcrRecognizer`
- `OcrScanResult`
- `OcrScanContext`
- `OcrScanProps`
- `OcrScanEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts OcrScan interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts OcrScan uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts OcrScan RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts OcrScan client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/OcrScan.json` |
| API extract | `generated/component-api/OcrScan.json` |

> 完整 Demo 见 `example/demos/OcrScan`（example 本地调试，不上线）。

