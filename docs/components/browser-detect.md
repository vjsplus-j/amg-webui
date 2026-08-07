# BrowserDetect

BrowserDetect：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

BrowserDetect：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件
- 异步提交或加载过程反馈

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { BrowserDetect } from 'amg-webui/core'`

```vue
<script setup>
import { BrowserDetect } from 'amg-webui/core'
</script>

<template>
  <BrowserDetect />
</template>
```

Curated demo：`example/demos/BrowserDetect/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `userAgent` | `string` | `undefined` | userAgent 字符串 |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `title` | `string` | `undefined` | 标题 / Title |
| `telemetry` | `boolean` | `undefined` | 是否上报 Telemetry / Enable telemetry |
| `trackId` | `string` | `undefined` | Telemetry 追踪 id / Telemetry track id |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `detected` | `info: BrowserInfo` | detected 时触发 |
| `refresh` | `void` | refresh 时触发 |

### Public Types

- `BrowserDetectProps`
- `BrowserDetectEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts BrowserDetect interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts BrowserDetect uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts BrowserDetect RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts BrowserDetect client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/BrowserDetect.json` |
| API extract | `generated/component-api/BrowserDetect.json` |

> 完整 Demo 见 `example/demos/BrowserDetect`（example 本地调试，不上线）。

