# Avatar

Avatar：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Avatar：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- 多尺寸规格
- 外观变体
- 支持禁用状态
- 加载状态反馈
- 事件回调
- 插槽自定义

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件
- 需要禁用/只读控制的表单场景
- 异步提交或加载过程反馈

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { Avatar } from 'amg-webui/core'`

```vue
<script setup>
import { Avatar } from 'amg-webui/core'
</script>

<template>
  <Avatar />
</template>
```

Curated demo：`example/demos/Avatar/index.vue`

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
| `src` | `string` | `undefined` | Image URL |
| `alt` | `string` | `undefined` | Accessible description for image / role=img |
| `text` | `string` | `undefined` | Letter avatar text (username / initials) |
| `textMaxLength` | `number` | 2 | Max graphemes for letter avatar (default 2) |
| `size` | `AvatarSize` | `undefined` | 尺寸：`sm` · `md` · `lg` / Size variant |
| `shape` | `AvatarShape` | `undefined` | shape 配置项 |
| `borderRadius` | `string` | `undefined` | Custom radius — CSS value (token / % preferred) |
| `icon` | `string` | `undefined` | Lucide icon name — icon avatar / final fallback |
| `bordered` | `boolean` | `undefined` | Show border (default true; neon variant always draws a dashed track) |
| `borderColor` | `string` | `undefined` | Border color (token / CSS preferred) |
| `borderWidth` | `string` | `undefined` | Border width CSS (default 1px hairline) |
| `variant` | `'default' \| 'neon'` | `undefined` | Appearance: default \| neon (dashed track + lightboard marquee glow). Cascades from AvatarGroup when omitted. |
| `colorBg` | `string` | `undefined` | Background override (token preferred) |
| `colorText` | `string` | `undefined` | Text / icon color override |
| `tooltip` | `string` | `undefined` | Hover tooltip content |
| `tooltipDelay` | `number` | `undefined` | Tooltip show delay (ms) |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `loading` | `boolean` | false | Skeleton while image loads, or force skeleton |
| `clickable` | `boolean` | false | Interactive — keyboard focus + click |
| `fallbackSrc` | `string` | `undefined` | Secondary image when `src` fails |
| `fallbackText` | `string` | `undefined` | Letter fallback when image fails (defaults to `text`) |
| `fallbackIcon` | `string` | `undefined` | Icon fallback when no letter text (default User) |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `error` | `event: Event` | error 时触发 |
| `click` | `event: MouseEvent` | 点击 / Click |
| `load` | `event: Event` | load 时触发 |

### Slots

| Slot | Props | 说明 |
| --- | --- | --- |
| `default` | `props: Record<string, never>` | 默认插槽 |
| `icon` | `props: Record<string, never>` | icon 插槽 |

### Public Types

- `AvatarSize`
- `AvatarShape`
- `AvatarProps`
- `AvatarEmits`
- `AvatarSlots`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Avatar non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Avatar uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Avatar RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Avatar client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Avatar.json` |
| API extract | `generated/component-api/Avatar.json` |

> 完整 Demo 见 `example/demos/Avatar`（example 本地调试，不上线）。

