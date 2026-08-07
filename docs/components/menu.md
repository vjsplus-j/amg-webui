# Menu 菜单

Menu 菜单：面向企业场景的 Navigation 组件（成熟度 rc）。

## 组件介绍

Menu 菜单：面向企业场景的 Navigation 组件（成熟度 rc）。

## 核心特性

- Navigation 家族组件
- v-model 双向绑定
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

> `import { Menu } from 'amg-webui/core'`

```vue
<script setup>
import { Menu } from 'amg-webui/core'
</script>

<template>
  <Menu />
</template>
```

Curated demo：`example/demos/Menu/index.vue`

## 示例

<DocsDemo name="menu-basic" />

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `items` | `MenuItem[]` | `() => []` | 菜单项 / Menu items |
| `modelValue` | `string` | `undefined` | 绑定值 / Bound value (v-model) |
| `openKeys` | `string[]` | `() => []` | openKeys 字符串 |
| `collapsed` | `boolean` | false | 是否启用 collapsed |
| `direction` | `'vertical' \| 'horizontal'` | `vertical` | direction 配置项 |
| `mode` | `'auto' \| 'inline' \| 'popup'` | `auto` | inline \| popup \| auto (horizontal/collapsed → popup) |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `trackId` | `string` | `undefined` | Telemetry 追踪 id / Telemetry track id |
| `telemetry` | `boolean` | `undefined` | 是否上报 Telemetry / Enable telemetry |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string` | v-model 更新 / v-model update |
| `update:openKeys` | `value: string[]` | `openKeys` 更新时触发（v-model） |
| `change` | `value: string` | 值变更 / Change |
| `select` | `item: MenuItem, event: MouseEvent` | 选中 / Select |
| `openChange` | `openKeys: string[]` | openChange 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `MenuBadgeTone`
- `NavItem`
- `MenuBadge`
- `MenuItem`
- `MenuProps`
- `MenuEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts Menu interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Menu uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Menu RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Menu client mount OK; no required browser-only top-level in package gate

## 当前限制

- Interactive actions no-op when disabled
- API 尚未冻结，可能随 hardening 批次调整

## 相关组件

- [MenuBar](./menu-bar)
- [SelectNav](./select-nav)

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/core` |
| metadata | `component-metadata/Menu.json` |
| API extract | `generated/component-api/Menu.json` |

> **DocsDemo** 为 docs 站内嵌演示；完整 curated demo 见 `example/demos/Menu`。

