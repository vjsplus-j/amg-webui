# Main

Main：面向企业场景的 Layout 组件（成熟度 rc）。

## 组件介绍

Main：面向企业场景的 Layout 组件（成熟度 rc）。

## 核心特性

- Layout 家族组件
- 事件回调

## 何时使用 / 不适用

**适用**

- 页面栅格与区域布局
- 响应式容器

**不适用**

- 简单页面可用原生 CSS 布局

## 基础用法

> `import { Main } from 'amg-webui/core'`

```vue
<script setup>
import { Main } from 'amg-webui/core'
</script>

<template>
  <Main />
</template>
```

Curated demo：`example/demos/Main/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `padded` | `boolean` | true | Legacy boolean — true → page pad; ignored when `padding` is set |
| `padding` | `MainPadding` | `undefined` | Padding via spacing / theme tokens |
| `label` | `string` | `undefined` | 显示文案 / Display label |
| `overflow` | `"auto" \| "hidden" \| "visible"` | `auto` | overflow 配置项 |
| `fill` | `boolean` | true | Fill remaining flex height in a Layout column |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `scroll` | `event: Event` | scroll 时触发 |

### Public Types

- `MainPadding`
- `MainProps`
- `MainEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Main non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Main uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Main RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Main client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Main.json` |
| API extract | `generated/component-api/Main.json` |

> 完整 Demo 见 `example/demos/Main`（example 本地调试，不上线）。

