# Card

Card：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Card：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件
- 异步提交或加载过程反馈

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { Card } from 'amg-webui/core'`

```vue
<script setup>
import { Card } from 'amg-webui/core'
</script>

<template>
  <Card />
</template>
```

Curated demo：`example/demos/Card/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `header` | `string` | `undefined` | Header bar title (left) |
| `footer` | `string` | `undefined` | Footer text when no footer slot |
| `title` | `string` | `undefined` | Body title above slot |
| `subTitle` | `string` | `undefined` | Body subtitle |
| `subtitle` | `string` | `undefined` | Alias of subTitle |
| `raised` | `boolean` | false | Soft elevation |
| `hover` | `boolean` | false | Hover affordance; clickable when true |
| `hoverable` | `boolean` | false | Alias of hover |
| `selected` | `boolean` | false | Selected visual state |
| `selectable` | `boolean` | false | Selection interaction; emits update:selected on click |
| `bordered` | `boolean` | true | Show 1px border (default true) |
| `loading` | `boolean` | false | Replace body with a compact skeleton |
| `skeleton` | `CardSkeleton` | `basic` | Which small skeleton to show while loading |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `click` | `event: MouseEvent` | 点击 / Click |
| `update:selected` | `value: boolean` | `selected` 更新时触发（v-model） |

### Public Types

- `CardSkeleton`
- `CardProps`
- `CardEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Card non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Card uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Card RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Card client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Card.json` |
| API extract | `generated/component-api/Card.json` |

> 完整 Demo 见 `example/demos/Card`（example 本地调试，不上线）。

