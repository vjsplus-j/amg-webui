# TelemetryProvider

TelemetryProvider：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

TelemetryProvider：面向企业场景的 Foundation 组件（成熟度 rc）。

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

> `import { TelemetryProvider } from 'amg-webui/core'`

```vue
<script setup>
import { TelemetryProvider } from 'amg-webui/core'
</script>

<template>
  <TelemetryProvider />
</template>
```

Curated demo：`example/demos/TelemetryProvider/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `config` | `VpTelemetryConfig` | `undefined` | Configuration applied while this provider is mounted. |
| `enabled` | `boolean` | `undefined` | Explicit enabled override; omitted keeps `config.enabled` or the current state. |
| `tag` | `string` | `div` | Render element. The provider uses `display: contents` by default. |
| `restoreOnUnmount` | `boolean` | true | Restore the previous global telemetry configuration on unmount. |
| `trackLifecycle` | `boolean` | false | Record provider mount/unmount lifecycle events when telemetry is enabled. |
| `ariaLabel` | `string` | `undefined` | Accessible label when a visible wrapper tag is used. |
| `eager` | `boolean` | false | Apply changes immediately before mount (useful for SSR-safe setup). |
| `display` | `"contents" \| "block" \| "inline"` | `contents` | Wrapper layout mode; contents preserves zero-layout behavior. |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `applied` | `config: Readonly<VpTelemetryConfig>` | applied 时触发 |
| `error` | `error: unknown` | error 时触发 |
| `restored` | `config: Readonly<VpTelemetryConfig>` | restored 时触发 |
| `enabled-change` | `enabled: boolean` | enabled-change 时触发 |

### Public Types

- `TelemetryProviderProps`
- `TelemetryProviderEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts TelemetryProvider non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts TelemetryProvider uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts TelemetryProvider RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts TelemetryProvider client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/TelemetryProvider.json` |
| API extract | `generated/component-api/TelemetryProvider.json` |

> 完整 Demo 见 `example/demos/TelemetryProvider`（example 本地调试，不上线）。

