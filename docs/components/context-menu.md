# ContextMenu

ContextMenu：面向企业场景的 Navigation 组件（成熟度 rc）。

## 组件介绍

ContextMenu：面向企业场景的 Navigation 组件（成熟度 rc）。

## 核心特性

- Navigation 家族组件
- v-model 双向绑定
- 事件回调

## 何时使用 / 不适用

**适用**

- 菜单、标签页、面包屑等导航
- 页面结构引导

**不适用**

- 单页极简场景可省略复杂导航组件

## 基础用法

> `import { ContextMenu } from 'amg-webui/overlay'`

```vue
<script setup>
import { ContextMenu } from 'amg-webui/overlay'
</script>

<template>
  <ContextMenu />
</template>
```

Curated demo：`example/demos/ContextMenu/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | false | 绑定值 / Bound value (v-model) |
| `items` | `ContextMenuItem[]` | `() => []` | 菜单项 / Menu items |
| `target` | `HTMLElement \| null` | `null` | External element that opens the menu on contextmenu. When omitted, the default slot host listens. |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: boolean` | v-model 更新 / v-model update |
| `show` | `void` | show 时触发 |
| `hide` | `void` | hide 时触发 |
| `command` | `command: string, item: ContextMenuItem` | command 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `ContextMenuItem`
- `ContextMenuProps`
- `ContextMenuEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts ContextMenu interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts ContextMenu uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts ContextMenu RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts ContextMenu client mount OK; no required browser-only top-level in package gate

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
| import | `amg-webui/overlay` |
| metadata | `component-metadata/ContextMenu.json` |
| API extract | `generated/component-api/ContextMenu.json` |

> 完整 Demo 见 `example/demos/ContextMenu`（example 本地调试，不上线）。

