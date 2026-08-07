# Badge

Badge：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Badge：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- 语义色变体
- 多尺寸规格
- 支持禁用状态
- 事件回调
- 插槽自定义

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件
- 需要禁用/只读控制的表单场景

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { Badge } from 'amg-webui/core'`

```vue
<script setup>
import { Badge } from 'amg-webui/core'
</script>

<template>
  <Badge />
</template>
```

Curated demo：`example/demos/Badge/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `spin` | `boolean` | false | Continuous rotate — shared Motion |
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
| `value` | `string \| number` | `undefined` | Count or short text mark (NEW / HOT…). Number ≤0 hides unless `dot`. |
| `max` | `number` | `undefined` | Truncate threshold — shows `{max}+` when numeric value exceeds (default 99). |
| `dot` | `boolean` | false | Pure status dot — no number / text. |
| `hidden` | `boolean` | false | Force hide. |
| `type` | `BadgeSeverity` | `undefined` | Alias of `severity` |
| `severity` | `BadgeSeverity` | `undefined` | 语义色：`primary` · `secondary` · `danger` 等 / Semantic color |
| `size` | `BadgeSize` | `undefined` | 尺寸：`sm` · `md` · `lg` / Size variant |
| `position` | `BadgePosition` | `undefined` | Anchor corner relative to host (default top-right). |
| `offset` | `[number, number]` | `undefined` | Extra translate offset `[x, y]` in px (right/down positive when top-right). Prefer leaving at `[0,0]` so Token offsets control alignment. |
| `colorBg` | `string` | `undefined` | Custom background (prefer CSS Token vars). |
| `colorText` | `string` | `undefined` | Custom text color (prefer CSS Token vars). |
| `color` | `string` | `undefined` | Shorthand fill — sets background; pair with `colorText` for contrast. |
| `tooltip` | `string` | `undefined` | Hover tooltip content. |
| `tooltipDelay` | `number` | `undefined` | Tooltip show delay (ms). |
| `disabled` | `boolean` | false | Dimmed / expired mark. |
| `pulse` | `boolean` | `undefined` | Badge ring/brightness pulse for urgent reminders (not shared `vp-motion--pulse`). |
| `ariaLabel` | `string` | `undefined` | Override accessible name; defaults to count / text / i18n for dots. |
| `decorative` | `boolean` | false | Pure decoration — suppress screen-reader announcement. |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `click` | `event: MouseEvent` | 点击 / Click |

### Slots

| Slot | Props | 说明 |
| --- | --- | --- |
| `default` | `props: Record<string, never>` | 默认插槽 |

### Public Types

- `BadgeSize`
- `BadgeSeverity`
- `BadgePosition`
- `BadgeProps`
- `BadgeEmits`
- `BadgeSlots`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Badge non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Badge uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Badge RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Badge client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Badge.json` |
| API extract | `generated/component-api/Badge.json` |

> 完整 Demo 见 `example/demos/Badge`（example 本地调试，不上线）。

