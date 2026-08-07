# Affix

Affix：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Affix：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- v-model 双向绑定
- 支持禁用状态
- 占位提示
- 事件回调

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件
- 需要禁用/只读控制的表单场景

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { Affix } from 'amg-webui/core'`

```vue
<script setup>
import { Affix } from 'amg-webui/core'
</script>

<template>
  <Affix />
</template>
```

Curated demo：`example/demos/Affix/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `undefined` | 绑定值 / Bound value (v-model) |
| `offsetTop` | `number` | 0 | Distance to top when affixed (px) |
| `offsetBottom` | `number` | `undefined` | Distance to bottom when affixed (px) |
| `target` | `string \| HTMLElement \| Window` | `undefined` | Scroll container — defaults to window |
| `zIndex` | `number` | `undefined` | zIndex 数值 |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `placeholder` | `boolean` | true | 占位提示 / Placeholder text |
| `affixedClass` | `string` | `undefined` | affixedClass 字符串 |
| `ariaLive` | `'off' \| 'polite' \| 'assertive'` | `off` | ariaLive 配置项 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `affixed: boolean` | v-model 更新 / v-model update |
| `change` | `affixed: boolean` | 值变更 / Change |
| `scroll` | `payload: AffixScrollPayload` | scroll 时触发 |
| `focus` | `event: FocusEvent` | 聚焦 / Focus |
| `blur` | `event: FocusEvent` | 失焦 / Blur |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `AffixProps`
- `AffixScrollPayload`
- `AffixEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Affix non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Affix uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Affix RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Affix client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Affix.json` |
| API extract | `generated/component-api/Affix.json` |

> 完整 Demo 见 `example/demos/Affix`（example 本地调试，不上线）。

