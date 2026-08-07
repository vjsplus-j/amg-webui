# Spin

Spin：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Spin：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- 多尺寸规格

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { Spin } from 'amg-webui/core'`

```vue
<script setup>
import { Spin } from 'amg-webui/core'
</script>

<template>
  <Spin />
</template>
```

Curated demo：`example/demos/Spin/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `spinning` | `boolean` | true | Show spinner overlay (default true) |
| `tip` | `string` | `undefined` | Tip under the spinner |
| `size` | `SpinSize` | `md` | 尺寸：`sm` · `md` · `lg` / Size variant |
| `delay` | `number` | 0 | Delay before showing spinner (ms) — reduces flash |
| `fullscreen` | `boolean` | false | Full-bleed overlay when wrapping slotted content |
| `ariaLabel` | `string` | `undefined` | Accessible name for the status region (falls back to tip) |

### Public Types

- `SpinSize`
- `SpinProps`
- `SpinEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Spin non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Spin uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Spin RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Spin client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Spin.json` |
| API extract | `generated/component-api/Spin.json` |

> 完整 Demo 见 `example/demos/Spin`（example 本地调试，不上线）。

