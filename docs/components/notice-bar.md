# NoticeBar

NoticeBar：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

NoticeBar：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- v-model 双向绑定
- 语义色变体
- 可关闭
- 事件回调

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { NoticeBar } from 'amg-webui/core'`

```vue
<script setup>
import { NoticeBar } from 'amg-webui/core'
</script>

<template>
  <NoticeBar />
</template>
```

Curated demo：`example/demos/NoticeBar/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | true | 绑定值 / Bound value (v-model) |
| `message` | `string` | `undefined` | message 字符串 |
| `title` | `string` | `undefined` | 标题 / Title |
| `severity` | `Severity` | `info` | 语义色：`primary` · `secondary` · `danger` 等 / Semantic color |
| `icon` | `string \| boolean` | true | 图标名 / Icon name |
| `closable` | `boolean` | true | 显示关闭按钮 / Show close button |
| `scrollable` | `boolean` | false | 是否启用 scrollable |
| `speed` | `number` | 18 | speed 数值 |
| `pauseOnHover` | `boolean` | true | 是否启用 pauseOnHover |
| `wrap` | `boolean` | false | 是否启用 wrap |
| `actionText` | `string` | `undefined` | actionText 字符串 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: boolean` | v-model 更新 / v-model update |
| `close` | `event: MouseEvent` | 关闭 / Close |
| `click` | `event: MouseEvent` | 点击 / Click |
| `action` | `event: MouseEvent` | action 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `NoticeBarProps`
- `NoticeBarEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts NoticeBar interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts NoticeBar uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts NoticeBar RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts NoticeBar client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/NoticeBar.json` |
| API extract | `generated/component-api/NoticeBar.json` |

> 完整 Demo 见 `example/demos/NoticeBar`（example 本地调试，不上线）。

