# AvatarGroup

AvatarGroup：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

AvatarGroup：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- 多尺寸规格
- 外观变体
- 支持禁用状态
- 插槽自定义

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件
- 需要禁用/只读控制的表单场景

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { AvatarGroup } from 'amg-webui/core'`

```vue
<script setup>
import { AvatarGroup } from 'amg-webui/core'
</script>

<template>
  <AvatarGroup />
</template>
```

Curated demo：`example/demos/AvatarGroup/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `max` | `number` | `undefined` | Max visible avatars before +N overflow (default 3; component > global) |
| `size` | `AvatarSize` | `undefined` | Cascades to child Avatars when they omit size |
| `shape` | `AvatarShape` | `undefined` | Cascades to child Avatars when they omit shape |
| `variant` | `'default' \| 'neon'` | `undefined` | Cascades appearance to children: neon = dashed track + lightboard marquee. |
| `overlap` | `string` | `undefined` | Negative margin for stack overlap (token preferred) |
| `maxTooltip` | `string` | `undefined` | Custom overflow / members tooltip (default: joined member labels) |
| `disabled` | `boolean` | false | Disable all children + overflow interactions |

### Slots

| Slot | Props | 说明 |
| --- | --- | --- |
| `default` | `props: Record<string, never>` | 默认插槽 |
| `overflowTooltip` | `props: { overflowCount: number; labels: string[] }` | Custom overflow tooltip body |

### Public Types

- `AvatarGroupEmits`
- `AvatarGroupProps`
- `AvatarGroupSlots`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts AvatarGroup non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts AvatarGroup uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts AvatarGroup RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts AvatarGroup client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/AvatarGroup.json` |
| API extract | `generated/component-api/AvatarGroup.json` |

> 完整 Demo 见 `example/demos/AvatarGroup`（example 本地调试，不上线）。

