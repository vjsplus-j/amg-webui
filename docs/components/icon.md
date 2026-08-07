# Icon

Icon：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Icon：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- 多尺寸规格
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

> `import { Icon } from 'amg-webui/core'`

```vue
<script setup>
import { Icon } from 'amg-webui/core'
</script>

<template>
  <Icon />
</template>
```

Curated demo：`example/demos/Icon/index.vue`

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
| `name` | `IconName` | `undefined` | Lucide icon name (PascalCase or kebab-case aliases) |
| `size` | `IconSize` | `md` | Token size xs–xl, or custom number (px) / CSS length |
| `color` | `string` | `undefined` | Fill/stroke color; defaults to currentColor / inherit |
| `strokeWidth` | `number` | `undefined` | Override Lucide stroke width; defaults from IconStyleService / --icon-stroke-width |
| `absoluteStrokeWidth` | `boolean` | false | When true, stroke width stays constant in screen px as the icon scales (Lucide `absoluteStrokeWidth`). |
| `rotate` | `number` | `undefined` | Static rotation in degrees |
| `flip` | `IconFlip` | `undefined` | Flip glyph horizontally and/or vertically |
| `flipH` | `boolean` | false | Horizontal flip (shorthand) |
| `flipV` | `boolean` | false | Vertical flip (shorthand) |
| `disabled` | `boolean` | false | Dimmed, non-interactive appearance |
| `loading` | `boolean` | false | Replace glyph with Loader2 + spin until cleared |
| `selected` | `boolean` | false | Selected accent color |
| `opacity` | `number` | `undefined` | Opacity 0–1 (also via style) |
| `label` | `string` | `undefined` | Accessible name. When set, role="img" + aria-label; otherwise aria-hidden. Checklist `alt` is accepted as an alias. |
| `alt` | `string` | `undefined` | Alias of `label` (a11y / alt text) |
| `title` | `string` | `undefined` | Native title tooltip |
| `interactive` | `boolean` | false | Treat as a control: role=button, focusable, Enter/Space activate. Also auto-enabled when the parent listens for `@click`. Presentational by default — no Telemetry (see TELEMETRY.md). |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `click` | `event: MouseEvent` | 点击 / Click |
| `focus` | `event: FocusEvent` | 聚焦 / Focus |
| `blur` | `event: FocusEvent` | 失焦 / Blur |
| `keydown` | `event: KeyboardEvent` | keydown 时触发 |

### Public Types

- `IconName`
- `IconSize`
- `IconFlip`
- `IconProps`
- `IconEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Icon non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Icon uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Icon RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Icon client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Icon.json` |
| API extract | `generated/component-api/Icon.json` |

> 完整 Demo 见 `example/demos/Icon`（example 本地调试，不上线）。

