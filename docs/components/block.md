# Block

Block：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Block：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { Block } from 'amg-webui/core'`

```vue
<script setup>
import { Block } from 'amg-webui/core'
</script>

<template>
  <Block />
</template>
```

Curated demo：`example/demos/Block/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `display` | `BlockDisplay` | `block` | CSS display — default `block` |
| `padding` | `BlockPadding` | `undefined` | Inner padding via spacing / theme tokens. When omitted, `padded` controls card pad vs none. |
| `padded` | `boolean` | true | Legacy boolean pad — true → card pad (default); ignored when `padding` is set |
| `bordered` | `boolean` | false | 是否启用 bordered |
| `gap` | `BlockGap` | true | Child stack gap — `true` → md; token key or false/none to disable |
| `margin` | `BlockMargin` | `none` | Outer margin — spacing tokens; default `none` |
| `bg` | `BlockBg` | `surface-1` | Background surface token |
| `fullBleed` | `boolean` | false | Cancel parent page pad; edge-to-edge within content column |
| `radius` | `BlockRadius` | `card` | Border radius token |
| `raised` | `boolean` | false | Soft elevation (shadow-sm) |

### Public Types

- `BlockMargin`
- `BlockPadding`
- `BlockDisplay`
- `BlockBg`
- `BlockGap`
- `BlockRadius`
- `BlockEmits`
- `BlockProps`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Block non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Block uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Block RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Block client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Block.json` |
| API extract | `generated/component-api/Block.json` |

> 完整 Demo 见 `example/demos/Block`（example 本地调试，不上线）。

