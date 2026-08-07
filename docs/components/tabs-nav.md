# TabsNav

TabsNav：面向企业场景的 Navigation 组件（成熟度 rc）。

## 组件介绍

TabsNav：面向企业场景的 Navigation 组件（成熟度 rc）。

## 核心特性

- Navigation 家族组件
- v-model 双向绑定
- 可关闭
- 支持禁用状态
- 事件回调

## 何时使用 / 不适用

**适用**

- 菜单、标签页、面包屑等导航
- 页面结构引导
- 需要禁用/只读控制的表单场景

**不适用**

- 单页极简场景可省略复杂导航组件

## 基础用法

> `import { TabsNav } from 'amg-webui/core'`

```vue
<script setup>
import { TabsNav } from 'amg-webui/core'
</script>

<template>
  <TabsNav />
</template>
```

Curated demo：`example/demos/TabsNav/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `items` | `TabsNavItem[]` | `() => []` | 菜单项 / Menu items |
| `modelValue` | `string` | `undefined` | 绑定值 / Bound value (v-model) |
| `closable` | `boolean` | false | 显示关闭按钮 / Show close button |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `overflow` | `boolean` | true | When true (default), show scroll arrows + more menu if tabs overflow. |
| `draggable` | `boolean` | false | Enable HTML5 drag-and-drop reorder; emits update:items + reorder |
| `trackId` | `string` | `undefined` | Telemetry 追踪 id / Telemetry track id |
| `telemetry` | `boolean` | `undefined` | 是否上报 Telemetry / Enable telemetry |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string` | v-model 更新 / v-model update |
| `change` | `value: string` | 值变更 / Change |
| `close` | `name: string` | 关闭 / Close |
| `update:items` | `items: TabsNavItem[]` | `items` 更新时触发（v-model） |
| `reorder` | `payload: { from: number; to: number; items: TabsNavItem[] }` | reorder 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `NavItem`
- `TabsNavItem`
- `TabsNavProps`
- `TabsNavEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts TabsNav interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts TabsNav uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts TabsNav RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts TabsNav client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/TabsNav.json` |
| API extract | `generated/component-api/TabsNav.json` |

> 完整 Demo 见 `example/demos/TabsNav`（example 本地调试，不上线）。

