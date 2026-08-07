# Watermark

Watermark：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Watermark：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- 事件回调

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { Watermark } from 'amg-webui/core'`

```vue
<script setup>
import { Watermark } from 'amg-webui/core'
</script>

<template>
  <Watermark />
</template>
```

Curated demo：`example/demos/Watermark/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `content` | `string \| string[]` | `undefined` | content 字符串 |
| `image` | `string` | `undefined` | image 字符串 |
| `imageCrossOrigin` | `"" \| "anonymous" \| "use-credentials"` | `anonymous` | imageCrossOrigin 配置项 |
| `gap` | `[number, number]` | `() => [0, 0]` | gap 数值 |
| `offset` | `[number, number]` | `() => [0, 0]` | offset 数值 |
| `width` | `number` | `undefined` | width 数值 |
| `height` | `number` | `undefined` | height 数值 |
| `rotate` | `number` | -22 | rotate 数值 |
| `fontSize` | `number` | 14 | fontSize 数值 |
| `font` | `WatermarkFont` | `undefined` | font 配置项 |
| `opacity` | `number` | 0.15 | opacity 数值 |
| `zIndex` | `number` | 1 | zIndex 数值 |
| `inherit` | `boolean` | true | 是否启用 inherit |
| `observe` | `boolean` | true | 是否启用 observe |
| `enabled` | `boolean` | true | 是否启用 enabled |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `render` | `dataUrl: string` | render 时触发 |
| `error` | `error: Error` | error 时触发 |
| `tamper` | `type: WatermarkTamperType` | tamper 时触发 |

### Public Types

- `WatermarkTamperType`
- `WatermarkFont`
- `WatermarkProps`
- `WatermarkEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Watermark non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Watermark uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Watermark RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Watermark client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Watermark.json` |
| API extract | `generated/component-api/Watermark.json` |

> 完整 Demo 见 `example/demos/Watermark`（example 本地调试，不上线）。

