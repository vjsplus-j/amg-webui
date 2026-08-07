# ScrollNotice

ScrollNotice：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

ScrollNotice：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- 语义色变体
- 支持禁用状态
- 加载状态反馈
- 可关闭
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

> `import { ScrollNotice } from 'amg-webui/core'`

```vue
<script setup>
import { ScrollNotice } from 'amg-webui/core'
</script>

<template>
  <ScrollNotice />
</template>
```

Curated demo：`example/demos/ScrollNotice/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `undefined` | 标题 / Title |
| `text` | `string` | `undefined` | text 字符串 |
| `data` | `string` | `undefined` | 树形数据 / Tree data |
| `severity` | `Severity` | `info` | 语义色：`primary` · `secondary` · `danger` 等 / Semantic color |
| `speed` | `number` | 40 | speed 数值 |
| `direction` | `"left" \| "right"` | `left` | direction 配置项 |
| `pauseOnHover` | `boolean` | true | 是否启用 pauseOnHover |
| `paused` | `boolean` | false | 是否启用 paused |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `closable` | `boolean` | false | 显示关闭按钮 / Show close button |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:paused` | `value: boolean` | `paused` 更新时触发（v-model） |
| `pause` | `void` | pause 时触发 |
| `resume` | `void` | resume 时触发 |
| `close` | `event: MouseEvent` | 关闭 / Close |
| `click` | `event: MouseEvent` | 点击 / Click |

### Public Types

- `ScrollNoticeProps`
- `ScrollNoticeEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts ScrollNotice non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts ScrollNotice uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts ScrollNotice RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts ScrollNotice client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/ScrollNotice.json` |
| API extract | `generated/component-api/ScrollNotice.json` |

> 完整 Demo 见 `example/demos/ScrollNotice`（example 本地调试，不上线）。

