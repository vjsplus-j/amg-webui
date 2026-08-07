# FloatButton

FloatButton：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

FloatButton：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- 语义色变体
- 事件回调

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { FloatButton } from 'amg-webui/core'`

```vue
<script setup>
import { FloatButton } from 'amg-webui/core'
</script>

<template>
  <FloatButton />
</template>
```

Curated demo：`example/demos/FloatButton/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `type` | `Severity` | `undefined` | 输入类型 / Input type |
| `severity` | `Severity` | `primary` | 语义色：`primary` · `secondary` · `danger` 等 / Semantic color |
| `shape` | `Shape` | `circle` | shape 配置项 |
| `icon` | `string` | `undefined` | 图标名 / Icon name |
| `href` | `string` | `undefined` | href 字符串 |
| `top` | `string \| number` | `undefined` | top 数值 |
| `right` | `string \| number` | `undefined` | right 数值 |
| `bottom` | `string \| number` | `undefined` | bottom 数值 |
| `left` | `string \| number` | `undefined` | left 数值 |
| `open` | `boolean` | `undefined` | Controlled menu open state (when `#menu` slot is used) |
| `ariaLabel` | `string` | `undefined` | Accessible name for the trigger (defaults to `common.more` when menu is present) |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `click` | `event: MouseEvent` | 点击 / Click |
| `update:open` | `open: boolean` | `open` 更新时触发（v-model） |
| `openChange` | `open: boolean` | openChange 时触发 |

### Public Types

- `FloatButtonProps`
- `FloatButtonEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts FloatButton interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts FloatButton uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts FloatButton RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts FloatButton client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/FloatButton.json` |
| API extract | `generated/component-api/FloatButton.json` |

> 完整 Demo 见 `example/demos/FloatButton`（example 本地调试，不上线）。

