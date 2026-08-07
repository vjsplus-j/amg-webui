# CategoryNav

CategoryNav：面向企业场景的 Navigation 组件（成熟度 rc）。

## 组件介绍

CategoryNav：面向企业场景的 Navigation 组件（成熟度 rc）。

## 核心特性

- Navigation 家族组件
- v-model 双向绑定
- 支持禁用状态
- 外观变体
- 多尺寸规格
- 事件回调

## 何时使用 / 不适用

**适用**

- 菜单、标签页、面包屑等导航
- 页面结构引导
- 需要禁用/只读控制的表单场景

**不适用**

- 单页极简场景可省略复杂导航组件

## 基础用法

> `import { CategoryNav } from 'amg-webui/core'`

```vue
<script setup>
import { CategoryNav } from 'amg-webui/core'
</script>

<template>
  <CategoryNav />
</template>
```

Curated demo：`example/demos/CategoryNav/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `items` | `NavItem[]` | `() => []` | 菜单项 / Menu items |
| `modelValue` | `string \| number` | `undefined` | 绑定值 / Bound value (v-model) |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `variant` | `CategoryNavVariant` | `pills` | 外观变体：`solid` · `outlined` · `text` / Visual variant |
| `size` | `CategoryNavSize` | `md` | 尺寸：`sm` · `md` · `lg` / Size variant |
| `wrap` | `boolean` | true | 是否启用 wrap |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string \| number` | v-model 更新 / v-model update |
| `change` | `value: string \| number` | 值变更 / Change |
| `select` | `item: NavItem, event: MouseEvent` | 选中 / Select |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `CategoryNavVariant`
- `CategoryNavSize`
- `CategoryNavProps`
- `CategoryNavEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts CategoryNav interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts CategoryNav uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts CategoryNav RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts CategoryNav client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/CategoryNav.json` |
| API extract | `generated/component-api/CategoryNav.json` |

> 完整 Demo 见 `example/demos/CategoryNav`（example 本地调试，不上线）。

