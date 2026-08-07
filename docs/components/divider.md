# Divider

Divider：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Divider：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { Divider } from 'amg-webui/core'`

```vue
<script setup>
import { Divider } from 'amg-webui/core'
</script>

<template>
  <Divider />
</template>
```

Curated demo：`example/demos/Divider/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `direction` | `DividerDirection` | `undefined` | Layout axis — `vertical` is the inline `\|` pipe separator |
| `type` | `DividerDirection` | `undefined` | Alias of `direction` (Ant Design–style API) |
| `contentPosition` | `DividerContentPosition` | `center` | contentPosition 配置项 |
| `dashed` | `boolean` | false | 是否启用 dashed |
| `borderStyle` | `string` | `undefined` | borderStyle 字符串 |
| `plain` | `boolean` | false | Compact visual weight (softer line / text) |
| `margin` | `DividerMargin` | `md` | Outer margin along the primary axis — maps to spacing tokens |
| `decorative` | `boolean` | false | Decorative separator (no semantic landmark). Sets `aria-hidden` and omits `role="separator"` when true. |
| `ariaLabel` | `string` | `undefined` | Accessible name when the divider is a landmark separator |

### Public Types

- `DividerDirection`
- `DividerContentPosition`
- `DividerMargin`
- `DividerProps`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Divider non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Divider uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Divider RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Divider client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Divider.json` |
| API extract | `generated/component-api/Divider.json` |

> 完整 Demo 见 `example/demos/Divider`（example 本地调试，不上线）。

