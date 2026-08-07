# Tag

Tag：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Tag：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- 语义色变体
- 多尺寸规格
- 可关闭
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

> `import { Tag } from 'amg-webui/core'`

```vue
<script setup>
import { Tag } from 'amg-webui/core'
</script>

<template>
  <Tag />
</template>
```

Curated demo：`example/demos/Tag/index.vue`

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
| `label` | `string` | `undefined` | 显示文案 / Display label |
| `type` | `TagSeverity` | `undefined` | Alias of `severity` |
| `severity` | `TagSeverity` | `undefined` | 语义色：`primary` · `secondary` · `danger` 等 / Semantic color |
| `effect` | `TagEffect` | `undefined` | effect 配置项 |
| `size` | `TagSize` | `undefined` | 尺寸：`sm` · `md` · `lg` / Size variant |
| `icon` | `string` | `undefined` | Lucide icon name — prefix; size follows tag unless `iconSize` set |
| `iconSize` | `Size` | `undefined` | iconSize 配置项 |
| `closable` | `boolean` | false | 显示关闭按钮 / Show close button |
| `round` | `boolean` | false | Pill / full radius |
| `rounded` | `boolean` | false | Alias of `round` |
| `borderRadius` | `string` | `undefined` | Custom radius — CSS value (token / % preferred) |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `clickable` | `boolean` | false | Interactive tag — keyboard focus + role=button when click listeners present |
| `wait` | `number` | `undefined` | Close debounce wait (ms); falls back to global config |
| `beforeClose` | `(event: MouseEvent) => boolean \| void \| Promise<boolean \| void>` | `undefined` | Pre-close interceptor — return false / reject to abort |
| `colorBg` | `string` | `undefined` | Custom fill (prefer CSS vars / tokens) |
| `colorText` | `string` | `undefined` | Custom text color |
| `colorBorder` | `string` | `undefined` | Custom border color |
| `color` | `string` | `undefined` | Shorthand custom color: solid → bg; outlined/light → text + border. Prefer Token vars; pair with colorText for contrast when needed. |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `close` | `event: MouseEvent` | 关闭 / Close |
| `click` | `event: MouseEvent` | 点击 / Click |

### Slots

| Slot | Props | 说明 |
| --- | --- | --- |
| `default` | `props: Record<string, never>` | 默认插槽 |
| `icon` | `props: Record<string, never>` | icon 插槽 |
| `closeIcon` | `props: Record<string, never>` | closeIcon 插槽 |

### Public Types

- `TagEffect`
- `TagSeverity`
- `TagSize`
- `TagProps`
- `TagEmits`
- `TagSlots`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Tag non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Tag uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Tag RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Tag client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Tag.json` |
| API extract | `generated/component-api/Tag.json` |

> 完整 Demo 见 `example/demos/Tag`（example 本地调试，不上线）。

