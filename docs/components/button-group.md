# ButtonGroup 按钮组

ButtonGroup 按钮组：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

ButtonGroup 按钮组：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- 多尺寸规格
- 语义色变体
- 外观变体
- 块级布局
- 支持禁用状态
- 加载状态反馈

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件
- 需要禁用/只读控制的表单场景
- 异步提交或加载过程反馈

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { ButtonGroup } from 'amg-webui/core'`

```vue
<script setup>
import { ButtonGroup } from 'amg-webui/core'
</script>

<template>
  <ButtonGroup />
</template>
```

Curated demo：`example/demos/ButtonGroup/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `size` | `Size` | `undefined` | 尺寸：`sm` · `md` · `lg` / Size variant |
| `severity` | `ButtonSeverity` | `undefined` | 语义色：`primary` · `secondary` · `danger` 等 / Semantic color |
| `variant` | `ButtonVariant` | `undefined` | 外观变体：`solid` · `outlined` · `text` / Visual variant |
| `block` | `boolean` | false | Stretch group to full width |
| `direction` | `'horizontal' \| 'vertical'` | `horizontal` | Layout axis for child buttons |
| `disabled` | `boolean` | false | Disable all cascaded children when Button honors group inject |
| `loading` | `boolean` | false | Cascade loading state to child Buttons |
| `ariaLabel` | `string` | `undefined` | Accessible name for the group |

### Public Types

- `ButtonGroupProps`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts ButtonGroup non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts ButtonGroup uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts ButtonGroup RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts ButtonGroup client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/ButtonGroup.json` |
| API extract | `generated/component-api/ButtonGroup.json` |

> 完整 Demo 见 `example/demos/ButtonGroup`（example 本地调试，不上线）。

