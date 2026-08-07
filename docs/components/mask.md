# Mask

Mask：面向企业场景的 Overlay 组件（成熟度 rc）。

## 组件介绍

Mask：面向企业场景的 Overlay 组件（成熟度 rc）。

## 核心特性

- Overlay 家族组件
- 事件回调

## 何时使用 / 不适用

**适用**

- 对话框、抽屉、气泡确认等浮层
- 阻断式交互

**不适用**

- 轻量提示优先 Toast / Message
- 非阻断提示不要用 Modal 对话框

## 基础用法

> `import { Mask } from 'amg-webui/overlay'`

```vue
<script setup>
import { Mask } from 'amg-webui/overlay'
</script>

<template>
  <Mask />
</template>
```

Curated demo：`example/demos/Mask/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `visible` | `boolean` | false | 是否可见 / Visibility (v-model:visible) |
| `dismissible` | `boolean` | true | 是否启用 dismissible |
| `zIndex` | `number` | `undefined` | zIndex 数值 |
| `lockScroll` | `boolean` | true | 是否启用 lockScroll |
| `trapFocus` | `boolean` | true | 是否启用 trapFocus |
| `centered` | `boolean` | true | 是否启用 centered |
| `blur` | `boolean` | true | 是否启用 blur |
| `teleportTo` | `string \| HTMLElement` | `body` | teleportTo 字符串 |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |
| `closeOnPressEscape` | `boolean` | true | 是否启用 closeOnPressEscape |
| `beforeClose` | `( reason: MaskCloseReason, event?: Event, ) => boolean \| Promise<boolean>` | `undefined` | 是否启用 beforeClose |
| `trackId` | `string` | `undefined` | Telemetry 追踪 id / Telemetry track id |
| `telemetry` | `boolean` | `undefined` | 是否上报 Telemetry / Enable telemetry |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:visible` | `value: boolean` | visible 更新 / visible update |
| `close` | `event?: Event, reason?: MaskCloseReason` | 关闭 / Close |
| `open` | `void` | 打开 / Open |
| `closed` | `void` | closed 时触发 |
| `error` | `error: unknown` | error 时触发 |

### Public Types

- `MaskCloseReason`
- `MaskProps`
- `MaskEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Mask uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Mask RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Mask client mount OK; no required browser-only top-level in package gate

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
| import | `amg-webui/overlay` |
| metadata | `component-metadata/Mask.json` |
| API extract | `generated/component-api/Mask.json` |

> 完整 Demo 见 `example/demos/Mask`（example 本地调试，不上线）。

