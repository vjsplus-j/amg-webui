# Typography

Typography：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Typography：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- 支持禁用状态
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件
- 需要禁用/只读控制的表单场景
- 异步提交或加载过程反馈

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { Typography } from 'amg-webui/core'`

```vue
<script setup>
import { Typography } from 'amg-webui/core'
</script>

<template>
  <Typography />
</template>
```

Curated demo：`example/demos/Typography/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `spin` | `boolean` | false | Continuous rotate — shared Motion |
| `pulse` | `boolean` | false | Soft opacity pulse — shared Motion |
| `heartbeat` | `boolean` | false | Scale heartbeat — shared Motion |
| `bounce` | `boolean` | false | Jump upward — shared Motion |
| `blink` | `boolean` | false | Sharp flash — shared Motion |
| `breathe` | `boolean` | false | Breathing light — shared Motion |
| `glow` | `boolean` | false | Fluorescent glow — shared Motion |
| `marqueeLeft` | `boolean` | false | Marquee scroll left — shared Motion |
| `marqueeRight` | `boolean` | false | Marquee scroll right — shared Motion |
| `scrollUp` | `boolean` | false | Vertical scroll up — shared Motion |
| `scrollDown` | `boolean` | false | Vertical scroll down — shared Motion |
| `dampOut` | `boolean` | false | Damped zoom then fade out — shared Motion |
| `animationDuration` | `number \| string` | `undefined` | Animation duration (ms or CSS time) — shared Motion |
| `type` | `TypographyType` | `undefined` | 输入类型 / Input type |
| `typeColor` | `Severity` | `undefined` | Semantic status color |
| `color` | `Severity` | `undefined` | Alias of typeColor |
| `copyable` | `TypographyCopyable` | false | copyable 配置项 |
| `ellipsis` | `TypographyEllipsis` | false | ellipsis 配置项 |
| `strong` | `boolean` | false | 是否启用 strong |
| `italic` | `boolean` | false | 是否启用 italic |
| `underline` | `boolean` | false | 是否启用 underline |
| `delete` | `boolean` | false | Strikethrough |
| `mark` | `boolean` | false | 是否启用 mark |
| `code` | `boolean` | false | 是否启用 code |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `loading` | `boolean` | false | Wait / thinking state — keeps the text visible while a light beam walks across the glyphs (not a block skeleton). |
| `shimmer` | `boolean` | false | Same light-beam visual without locking interaction / aria-busy |
| `clickable` | `boolean` | false | 是否启用 clickable |
| `fontFamily` | `TypographyFontFamily` | `undefined` | fontFamily 配置项 |
| `lineHeight` | `string \| number` | `undefined` | CSS length or unitless; prefers design tokens when string |
| `content` | `string` | `undefined` | Explicit text when default slot is empty / for copy payload fallback |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `copy` | `text: string` | copy 时触发 |
| `copyError` | `error: Error` | copyError 时触发 |
| `click` | `event: MouseEvent` | 点击 / Click |

### Public Types

- `TypographyType`
- `TypographyFontFamily`
- `TypographyEllipsis`
- `TypographyCopyable`
- `TypographyEllipsisConfig`
- `TypographyCopyableConfig`
- `TypographyProps`
- `TypographyEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Typography non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Typography uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Typography RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Typography client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Typography.json` |
| API extract | `generated/component-api/Typography.json` |

> 完整 Demo 见 `example/demos/Typography`（example 本地调试，不上线）。

